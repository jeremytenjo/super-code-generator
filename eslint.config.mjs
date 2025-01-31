/**
 * ESLint configuration for the project.
 *
 * See https://eslint.style and https://typescript-eslint.io for additional linting options.
 */
// @ts-check
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['out', 'dist', 'scripts'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
)

// {
//   "env": {
//     "browser": false,
//     "commonjs": true,
//     "es6": true,
//     "node": true,
//     "mocha": true
//   },
//   "parserOptions": {
//     "ecmaVersion": "latest",
//     "ecmaFeatures": {
//       "jsx": true
//     },
//     "sourceType": "module"
//   },
//   "ignorePatterns": ["lib", "app", "out"],
//   "rules": {
//     "no-const-assign": "warn",
//     "no-this-before-super": "warn",
//     "no-undef": "error",
//     "no-unreachable": "warn",
//     "no-unused-vars": "error",
//     "constructor-super": "warn",
//     "valid-typeof": "warn"
//   }
// }
