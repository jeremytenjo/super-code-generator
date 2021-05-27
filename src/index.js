const vscode = require('vscode')
// const activation = require('./handleActivation')
const pkgJson = require('../package.json')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log(`${pkgJson.name} activated!`)
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'quickComponentCreator.createComponent',
      () => vscode.window.showInformationMessage('hello')

      // activation
    )
  )
}

// this method is called when your extension is deactivated
function deactivate() {
  console.log(`${pkgJson.name} deactivated!`)
}

module.exports = {
  activate,
  deactivate
}
