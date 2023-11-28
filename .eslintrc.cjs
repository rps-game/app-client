/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'indent': [
      'error',
      2,
    ],
    'arrow-parens': 'off',
    'quote-props': [
      'error',
      'consistent-as-needed',
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'always',
    ],
    'no-alert': 'off',
    'no-params-reassign': 'off',
    // Пробел между именем функции и открывающимися скобками
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    }],
    'object-curly-spacing': [
      'error',
      'always',
      { objectsInObjects: false },
    ],
    'vue/singleline-html-element-content-newline': ['error', {
      ignoreWhenNoAttributes: true,
      ignores: ['pre', 'textarea'],
    }],
    'vue/html-closing-bracket-newline': [
      'error', { multiline: 'never' },
    ],
    'generator-star-spacing': ['error', {
      before: true,
      after: false,
    }],
  },
};
