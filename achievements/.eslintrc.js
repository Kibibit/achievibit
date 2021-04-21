module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: [ '.eslintrc.js' ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'eol-last': [ 2, 'windows' ],
    'comma-dangle': [ 'error', 'never' ],
    'max-len': [ 'error', { 'code': 80, "ignoreComments": true } ],
    'quotes': ["error", "single"],
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/naming-convention': [
      "error",
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "custom": {
          "regex": "^I[A-Z]",
          "match": true
        }
      }
    ]
  }
};
