#!/usr/bin/env node
/**
 * new:chapter — scaffold a chapter from the §6 template.
 *
 *   pnpm new:chapter <id> "<Title>" [--slug custom-slug]
 *   pnpm new:chapter 00-01 "Python for AI engineering"
 *
 * Writes src/content/chapters/<NN-layerslug>/<id>-<slug>.mdx. The id must be in
 * the CLAUDE.md §10 manifest (nothing may exist that the manifest doesn't
 * sanction). Refuses to overwrite an existing chapter.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { readManifestIds, LAYER_SLUGS } from './lib/manifest.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

function die(msg) {
  console.error(red(`✕ ${msg}`));
  process.exit(1);
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── Parse args ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
let slugArg = null;
const slugIdx = args.indexOf('--slug');
if (slugIdx !== -1) {
  slugArg = args[slugIdx + 1];
  args.splice(slugIdx, 2);
}
const [id, title] = args;

if (!id || !title) {
  die('usage: pnpm new:chapter <id> "<Title>" [--slug custom-slug]');
}
if (!/^\d{2}-\d{2}$/.test(id)) {
  die(`id "${id}" is malformed — expected NN-NN (e.g. 00-01).`);
}

const manifestIds = readManifestIds(root);
if (!manifestIds.has(id)) {
  die(`id "${id}" is not in the CLAUDE.md §10 manifest. Add it there first, or fix the id.`);
}

const layer = Number(id.slice(0, 2));
const order = Number(id.slice(3));
const layerSlug = LAYER_SLUGS[layer];
if (!layerSlug) die(`no directory slug mapped for layer ${layer} (see scripts/lib/manifest.mjs).`);

const slug = slugArg ? slugify(slugArg) : slugify(title);
const dir = join(root, 'src/content/chapters', `${String(layer).padStart(2, '0')}-${layerSlug}`);
const file = join(dir, `${id}-${slug}.mdx`);

if (existsSync(file)) {
  die(`chapter already exists: ${relative(root, file)}`);
}

// ── Fill the template ────────────────────────────────────────────────────────
const tmpl = readFileSync(join(root, 'scripts/templates/chapter.mdx.tmpl'), 'utf8');
const out = tmpl
  .replaceAll('__LAYER__', String(layer))
  .replaceAll('__ORDER__', String(order))
  .replaceAll('__TITLE__', title.replace(/'/g, "\\'"))
  .replaceAll('__SLUG__', slug)
  .replaceAll('__ID__', id)
  .replaceAll('__DATE__', new Date().toISOString().slice(0, 10));

mkdirSync(dir, { recursive: true });
writeFileSync(file, out);

console.log(bold('\nnew:chapter'));
console.log(green(`✓ created ${relative(root, file)}`));
console.log(
  `\nnext:\n` +
    `  1. replace every ‹…› marker and write the prose (CLAUDE.md §6 structure)\n` +
    `  2. keep status: draft until the §6 definition of done holds\n` +
    `  3. pnpm check:manifest && pnpm build\n`,
);
