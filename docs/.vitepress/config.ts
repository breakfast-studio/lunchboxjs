import { defineConfig } from 'vitepress'

export default defineConfig({
    title: 'LunchboxJS',
    description: 'Custom Vue 3 renderer for ThreeJS.',
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            {
                text: 'GitHub',
                link: 'https://github.com/breakfast-studio/lunchboxjs',
            },
        ],
        sidebar: [
            {
                text: 'Getting Started',
                collapsable: true,
                children: [
                    { text: 'Installation', link: '/installation/' },
                    { text: 'Core Concepts', link: '/core/' },
                ],
            },
            {
                text: 'Basic',
                children: [
                    { text: 'Wrapper', link: '/components/wrapper/' },
                    { text: 'Components', link: '/components/' },
                    { text: 'Utilities', link: '/utilities/' },
                    { text: 'Extend', link: '/components/extend/' },
                ],
            },
            {
                text: 'Advanced',
                children: [
                    {
                        text: 'Custom Render Function',
                        link: '/advanced/custom-render/',
                    },
                    {
                        text: 'Custom Cameras, Renderers, and Scenes',
                        link: '/advanced/custom-cameras-renderers-and-scenes/',
                    },
                ],
            },
        ],
    },
})
