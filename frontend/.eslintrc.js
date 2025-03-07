module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'react-app',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // Function size and complexity - temporarily set to warn during refactoring
    'max-lines-per-function': ['warn', { max: 15, skipBlankLines: true, skipComments: true }],
    'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
    'complexity': ['warn', { max: 5 }],
    'max-depth': ['warn', { max: 2 }],
    'max-nested-callbacks': ['warn', { max: 2 }],
    
    // Documentation
    'require-jsdoc': ['warn', {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
        ArrowFunctionExpression: true,
        FunctionExpression: true,
      },
    }],
    
    // React specific
    'react/prop-types': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-max-props-per-line': ['warn', { maximum: 1, when: 'multiline' }],
    'react/jsx-first-prop-new-line': ['warn', 'multiline'],
    'react/jsx-max-depth': ['warn', { max: 4 }],
    
    // General code style
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'prefer-const': 'warn',
    'arrow-body-style': ['warn', 'as-needed'],
    'arrow-parens': ['warn', 'always'],
    'object-shorthand': 'warn',
  },
}; 