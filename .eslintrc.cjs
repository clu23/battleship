module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    'no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    eqeqeq: 'error',
    'no-var': 'error',
    'prefer-const': 'warn',
    'no-console': 'warn',
  },
};
