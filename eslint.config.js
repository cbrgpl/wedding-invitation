import js from '@eslint/js';
import html from '@html-eslint/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      sourceType: 'module',
    },
  },
  {
    files: ['*.html'],
    ...html.configs['flat/recommended'],
    rules: {
      ...html.configs['flat/recommended'].rules,
      '@html-eslint/indent': ['error', 2],
    },
  },
];
