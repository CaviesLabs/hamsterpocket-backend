module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'create-empty-pool.dto.ts',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "prettier/prettier": "error",
    '@typescript-eslint/no-var-requires': 'warn',
    "@typescript-eslint/no-unused-vars": "error",
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
