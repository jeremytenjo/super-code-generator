const vscode = require('vscode')

module.exports = function handleActivation(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'quickComponentCreator.createComponent',
      async ({}) => {
        vscode.window.showInformationMessage(`HELLOEOEOEO created!`)
      }
    )
  )
}
