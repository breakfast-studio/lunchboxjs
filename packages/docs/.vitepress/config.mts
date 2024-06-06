import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Lunchbox",
  description: "ThreeJS web components",
  appearance: 'dark',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Guide', link: '/guide' },
    ],

    sidebar: [
      {
        text: 'Getting started',
        items: [
          { text: 'Overview', link: '/guide' },
          { text: 'Install', link: '/install' },
          { text: 'Core concepts', link: '/concepts' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'Wrapper', link: '/components/wrapper' },
          { text: 'Extend', link: '/components/extend' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/breakfast-studio/lunchboxjs' },
    ],
  },
});
