import { defineConfig } from '@vscode/test-cli'

export default defineConfig({
  label: 'Unit Tests',
  files: 'dist/src/test/**/*.test.js',
  workspaceFolder: './example/app',
  mocha: {
    ui: 'tdd',
    timeout: 10000,
  },
  launchArgs: ['--disable-extensions'],
})
