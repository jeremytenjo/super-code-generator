import {defineConfig} from "@vscode/test-cli";

export default defineConfig({
    label: "Unit Tests",
    files: 'out/src/test/**/*.test.js',
    workspaceFolder: "./example/app",
    mocha: {
        ui: 'tdd',
        timeout: 10000
    }
})