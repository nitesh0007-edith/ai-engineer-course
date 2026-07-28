import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// Custom-domain GitHub Pages site: served from the domain root.
// `site` + `base` must both be correct so generated canonical URLs, assets,
// and the client-side authentication callback use the production domain.
export default defineConfig({
  site: 'https://www.learnaiwithnitesh.dev',
  base: '/',
  output: 'static',
  trailingSlash: 'ignore',
  markdown: {
    // Dual Shiki themes (DESIGN §3). The high-contrast variants clear WCAG AA
    // on every token, including comments (stock github-dark fails at 3.04).
    // defaultColor:false emits --shiki-light/--shiki-dark vars we switch on the
    // site theme in theme.css, so code follows light/dark like everything else.
    shikiConfig: {
      themes: {
        light: 'github-light-high-contrast',
        dark: 'github-dark-high-contrast',
      },
      defaultColor: false,
      wrap: false,
    },
  },
  // MDX before React so chapter .mdx files can embed React island widgets.
  integrations: [mdx(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
