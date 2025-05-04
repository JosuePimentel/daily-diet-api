import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([ 
  {
    files: ['**/*.{js,mjs,cjs,ts}'], languageOptions: { globals: globals.node },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'semi': ['error', 'always'], 
      'indent': ['error', 2],
      'quotes': ['error', 'single'],  
      '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }]        
    }
  },
  tseslint.configs.recommended,
]);