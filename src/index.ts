const vscode = require('vscode')
const createComponent = require('./commands/createComponentCommand')
const createComponentInFolder = require('./commands/createComponentInFolder')
const pkgJson = require('../package.json')

/**
 * @param {vscode.ExtensionContext} context
 * {@Link https://code.visualstudio.com/api/references/vscode-api#ExtensionContext|ExtensionContext API}
 */
function activate(context) {
  console.log(`${pkgJson.name} activated!`)

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'quickComponentCreator.createComponent',
      createComponent
    )
  )

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'quickComponentCreator.createComponentInFolder',
      () => createComponentInFolder(context)
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
