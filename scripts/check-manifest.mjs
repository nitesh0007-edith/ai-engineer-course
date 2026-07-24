#!/usr/bin/env node
/**
 * check:manifest — the coverage gate (CLAUDE.md §10, §13).
 *
 * The §10 content manifest in CLAUDE.md is authoritative. This script cross-
 * references it against the chapters that actually exist and fails on drift:
 *
 *   - a chapter file whose id is NOT in the manifest (an orphan — nothing may
 *     ship that the manifest doesn't sanction), or
 *   - a chapter whose frontmatter is missing an id/status, or whose filename id
 *     disagrees with its `layer`.
 *
 * Deep schema validation (the §6 Zod contract) is owned by `astro build` /
 * `astro check`, which already fail on a malformed chapter — this script does
 * not duplicate that. Manifest ids with no chapter yet are reported as coverage,
 * not failures: ~90 chapters land over many months and an unwritten one is the
 * normal state, never an error (per the "nothing stubbed" rule, the alternative
 * would be worse).
 *
 * Runs on plain Node — no build step, no dependencies.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { readManifestIds } from './lib/manifest.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHAPTERS_DIR = join(root, 'src/content/chapters');

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

/** Recursively collect *.mdx chapter files. */
function collectChapters(dir) {
  let out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out; // dir may not exist yet — zero chapters is valid
  }
  for (const name of entries) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out = out.concat(collectChapters(p));
    else if (name.endsWith('.mdx')) out.push(p);
  }
  return out;
}

/** Extract the top-level frontmatter block and a scalar key from it. */
function frontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : null;
}
function scalar(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
}

const errors = [];
function fail(msg) {
  console.error(red(`✕ ${msg}`));
  process.exit(1);
}

const manifestIds = readManifestIds(root);
const files = collectChapters(CHAPTERS_DIR);

const built = new Set(); // manifest ids with at least one chapter
const published = [];

for (const file of files) {
  const rel = relative(root, file);
  const base = file.split('/').pop();
  // Chapter files are `NN-NN[suffix]-slug.mdx`; the manifest id is the NN-NN.
  const idMatch = base.match(/^(\d{2}-\d{2})/);
  if (!idMatch) {
    errors.push(`${rel}: filename does not start with an NN-NN chapter id.`);
    continue;
  }
  const id = idMatch[1];
  if (!manifestIds.has(id)) {
    errors.push(`${rel}: id "${id}" is not in the CLAUDE.md §10 manifest (orphan).`);
    continue;
  }

  const fm = frontmatter(readFileSync(file, 'utf8'));
  if (!fm) {
    errors.push(`${rel}: no frontmatter block found.`);
    continue;
  }
  const status = scalar(fm, 'status');
  const layer = scalar(fm, 'layer');
  if (!status) errors.push(`${rel}: frontmatter is missing "status".`);
  if (layer !== null && Number(layer) !== Number(id.slice(0, 2))) {
    errors.push(`${rel}: frontmatter layer "${layer}" disagrees with id "${id}".`);
  }

  built.add(id);
  if (status === 'published') published.push(id);
}

// ── Report ────────────────────────────────────────────────────────────────
console.log(bold('\ncheck:manifest'));
console.log(
  `  manifest ids:   ${manifestIds.size}\n` +
    `  chapters found: ${files.length}\n` +
    `  ids covered:    ${built.size}\n` +
    `  published:      ${published.length} ${dim(published.sort().join(' ') || '—')}`,
);

if (errors.length) {
  console.error(red(`\n${errors.length} problem(s):`));
  for (const e of errors) console.error(red(`  ✕ ${e}`));
  process.exit(1);
}

console.log(
  green(`\n✓ every chapter maps to the manifest`) +
    dim(` (${manifestIds.size - built.size} manifest ids not yet written)\n`),
);
