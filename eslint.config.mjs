// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Build output, not source. Flat config doesn't read .gitignore, so `dist`
  // has to be named here or `npm run lint` reports on emitted JS.
  { ignores: ['**/dist/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'semi': 'error',
    }
  }
);

