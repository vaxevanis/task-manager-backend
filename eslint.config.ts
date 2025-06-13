import { defineFlatConfig } from 'eslint-define-config';
import prettier from 'eslint-config-prettier';
import tsParser from '@typescript-eslint/parser';

export default defineFlatConfig([
  // Base ignores
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/build/**',
      '.yarn/**',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true, // Auto-detects tsconfig.json
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  prettier // Must be last to disable conflicting formatting rules
]);
