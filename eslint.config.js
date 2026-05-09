import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Conventional escape hatch — `_arg` signals "intentionally unused".
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Teach the a11y rule about our custom form controls so labels wrapping
      // <Checkbox>, <Toggle>, etc. pass the association check.
      'jsx-a11y/label-has-associated-control': [
        'error',
        { controlComponents: ['Checkbox', 'Toggle', 'Input', 'Textarea', 'Select', 'SearchInput'] },
      ],
    },
  },
  {
    // Lazy route loaders need `(m: any)` because each feature module exports a
    // differently-named component; typing them precisely would require a
    // mapped type per feature key. Scope-disable here only.
    files: ['src/app/routes.tsx', 'src/config/feature-imports.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
  {
    // Test files relax a couple of rules that don't apply (assertion shapes,
    // intentional `any` for mock fixtures).
    files: ['src/**/*.{test,spec}.{ts,tsx}'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
])
