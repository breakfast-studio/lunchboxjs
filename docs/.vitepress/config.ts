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
            {
                text: 'Examples',
                link: 'https://twitter.com/lunchboxjs',
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
            {
                text: 'Development',
                children: [
                    { text: 'Internal Development', link: '/dev/' },
                    { text: 'Lunchbox Overview', link: '/dev/overview/' },
                    { text: 'Overrides', link: '/dev/overrides/' },
                    { text: 'Contributing', link: '/dev/contributing/' },
                ],
            },
        ],
    },
})
