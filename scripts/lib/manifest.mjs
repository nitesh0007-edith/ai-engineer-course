/**
 * Shared manifest helpers. The §10 content manifest in CLAUDE.md is the single
 * source of truth for which chapters may exist; both check:manifest and
 * new:chapter read it through here so they never disagree.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Directory slug per layer number, matching the CLAUDE.md §4 repo layout. */
export const LAYER_SLUGS = {
  0: 'foundations',
  1: 'classical-ml',
  2: 'deep-learning',
  3: 'transformers',
  4: 'llm-apps',
  5: 'evals',
  6: 'model-adaptation',
  7: 'inference',
  8: 'llmops',
  9: 'safety',
  10: 'specialisations',
};

/** Parse the set of authoritative chapter ids ("NN-NN") from CLAUDE.md §10. */
export function readManifestIds(root) {
  const md = readFileSync(join(root, 'CLAUDE.md'), 'utf8');
  const start = md.indexOf('## 10. Content manifest');
  const end = md.indexOf('## 11.', start);
  if (start === -1 || end === -1) {
    throw new Error('Could not locate the §10 manifest section in CLAUDE.md.');
  }
  const ids = new Set();
  for (const m of md.slice(start, end).matchAll(/`(\d{2}-\d{2})`/g)) ids.add(m[1]);
  return ids;
}
