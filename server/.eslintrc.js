module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'unused-imports',
    'simple-import-sort',
    'import'
  ],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: [
    '.eslintrc.js',
    '**/*.event.ts'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'unused-imports/no-unused-imports': 'error',
    'simple-import-sort/imports': ['error', {
      groups: [
        // 1. built-in node.js modules
        [`^(${require("module").builtinModules.join("|")})(/|$)`],
        // 2.1. package that start without @
        // 2.2. package that start with @ 
        ['^\\w', '^@\\w'],
        // 3. @nestjs packages
        ['^@nestjs\/'],
        // 4. @kibibit external packages
        ['^@kibibit\/'],
        // 5. Internal kibibit packages (inside this project)
        ['^@kb-'],
        // 6. Parent imports. Put `..` last.
        //    Other relative imports. Put same-folder imports and `.` last.
        ["^\\.\\.(?!/?$)", "^\\.\\./?$", "^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
        // 7. Side effect imports.
        // https://riptutorial.com/javascript/example/1618/importing-with-side-effects
        ["^\\u0000"]
      ]
    }],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
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
    ],
    "semi": "off",
    "@typescript-eslint/semi": ["error"]
  }
};
