const { resolve } = require('node:path');
const project = resolve(__dirname, 'tsconfig.json');

module.exports = {
  root: true,
  extends: [
    require.resolve('@vercel/style-guide/eslint/node'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
    require.resolve('@vercel/style-guide/eslint/browser'),
    require.resolve('@vercel/style-guide/eslint/react'),
    require.resolve('@vercel/style-guide/eslint/next'),
  ],
  parserOptions: {
    project,
  },
  settings: {
    'import/resolver': {
      typescript: { project },
    },
  },
  rules: {
    'eslint-comments/require-description': 'off',
    // 🔇 Max suppress warnings and breaking rules
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/naming-convention': 'off',

    // React / JSX / Import issues
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-no-undef': 'off',
    'react/no-unknown-property': 'off',
    'react/prop-types': 'off',
    'react/jsx-fragments': 'off',

    // Import issues
    'import/no-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/order': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-duplicates': 'off',

    // Console/debug
    'no-console': 'off',
    'no-alert': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-promise-executor-return': 'off',
    'func-names': 'off',

    // Unicorn / Misc
    'unicorn/filename-case': 'off',
    'no-nested-ternary': 'off',
    'no-redeclare': 'off',
    'camelcase': 'off',
  },
};
