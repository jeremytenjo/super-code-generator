import vscode from 'vscode'
import generateCode from './commands/generateCodeCommand'
import generateCodeInFolder from './commands/generateCodeInFolder'

export type FileProps = {
  name: string
}

const extensionName = 'superCodeGenerator'

/**
 * @param {vscode.ExtensionContext} context
 * {@Link https://code.visualstudio.com/api/references/vscode-api#ExtensionContext|ExtensionContext API}
 */
function activate(context) {
  console.log(`${extensionName} activated!`)

  context.subscriptions.push(
    vscode.commands.registerCommand('superCodeGenerator.generateCode', generateCode),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('superCodeGenerator.generateCodeInFolder', () =>
      generateCodeInFolder(context),
    ),
  )
}

// this method is called when your extension is deactivated
function deactivate() {
  console.log(`${extensionName} deactivated!`)
}

export { activate, deactivate }
