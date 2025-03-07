module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y'],
  rules: {
    // Function size and complexity
    'max-lines-per-function': ['error', { max: 15, skipBlankLines: true, skipComments: true }],
    'max-lines': ['error', { max: 500, skipBlankLines: true, skipComments: true }],
    'complexity': ['error', { max: 5 }],
    'max-depth': ['error', { max: 2 }],
    'max-nested-callbacks': ['error', { max: 2 }],
    
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
    'valid-jsdoc': ['warn', {
      requireReturn: false,
      requireParamDescription: true,
      requireReturnDescription: true,
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
  settings: {
    react: {
      version: 'detect',
    },
  },
}; 