// .vitepress/theme/index.ts
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { initLunchbox } from '../../../lunchboxjs/src';
import './custom.css';

export default {
    extends: DefaultTheme,
    enhanceApp() {
        initLunchbox();
    }
} satisfies Theme;