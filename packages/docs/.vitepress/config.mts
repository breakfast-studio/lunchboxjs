import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Lunchbox",
  description: "ThreeJS web components",
  appearance: "dark",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Guide", link: "/guide" }],
    outline: {
	level: "deep",
    },

    sidebar: [
      {
        text: "Getting started",
        items: [
          { text: "Overview", link: "/guide" },
          { text: "Install", link: "/install" },
          { text: "Core concepts", link: "/concepts" },
        ],
      },
      {
        text: "Components",
        items: [
          { text: "Component Guide", link: "/components/component-guide" },
          { text: "Events", link: "/components/events" },
          { text: "Advanced components", link: "/components/advanced" },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/breakfast-studio/lunchboxjs",
      },
    ],
  },
});
