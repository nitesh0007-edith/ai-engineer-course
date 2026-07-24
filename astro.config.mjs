import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// Project page on GitHub Pages: served from https://<owner>.github.io/<repo>/
// `site` + `base` must both be correct so built asset URLs carry the repo prefix
// in production (and Astro's dev server mirrors the base too).
export default defineConfig({
  site: 'https://nitesh0007-edith.github.io',
  base: '/ai-engineer-course',
  output: 'static',
  trailingSlash: 'ignore',
  // MDX before React so chapter .mdx files can embed React island widgets.
  integrations: [mdx(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
