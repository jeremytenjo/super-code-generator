const activation = require('./handleActivation')
const pkgJson = require('../package.json')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log(`${pkgJson.name} activated!`)
  activation(context)
}

// this method is called when your extension is deactivated
function deactivate() {
  console.log(`${pkgJson.name} deactivated!`)
}

export { activate, deactivate }
