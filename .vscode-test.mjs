import { defineConfig } from '@vscode/test-cli'

export default defineConfig({
  label: 'Unit Tests',
  // Keep tests on the minimum supported VS Code version.
  version: '1.95.0',
  files: 'dist/src/test/**/*.test.js',
  workspaceFolder: './example/app',
  mocha: {
    ui: 'tdd',
    timeout: 10000,
  },
  launchArgs: ['--disable-extensions'],
})
