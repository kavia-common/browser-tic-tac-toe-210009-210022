import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      // Use globals to emulate browser/test environments in flat config
      globals: {
        // Browser globals
        window: true,
        document: true,
        navigator: true,
        console: true,

        // Jest/test globals
        describe: true,
        test: true,
        expect: true,
        jest: true,
        beforeEach: true,
        afterEach: true,
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: 'React|App' }],
    },
  },
  pluginJs.configs.recommended,
  {
    // React plugin config
    plugins: { react: pluginReact },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
    },
  },
  // Optional: stronger test-file scoping; if using, it can override or be removed
  {
    files: ['**/*.test.{js,jsx}'],
    languageOptions: {
      globals: {
        describe: true,
        test: true,
        expect: true,
        jest: true,
        beforeEach: true,
        afterEach: true,
      },
    },
  },
];
