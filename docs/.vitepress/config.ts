import { defineConfig } from 'vitepress'

export default defineConfig({
    title: 'LunchboxJS',
    description: 'Custom Vue 3 renderer for ThreeJS.',
    themeConfig: {
        nav: [{ text: 'Home', link: '/' }],
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
                text: 'Plugin',
                children: [
                    { text: 'Components', link: '/components/' },
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
                ],
            },
        ],
    },
})
