import vscode from 'vscode'
import generateCode from './commands/generateCodeCommand'
import generateCodeInFolder from './commands/generateCodeInFolder'
import { SuperCodeGeneratorHelpersProps } from './common/generateCode/handlers/helpers'

export type SuperCodeGeneratorConfigSchema = {
  type: string
  outputWithoutParentDir: boolean
  hooks: {
    onCreate: (props: { outputPath: string }) => void | Promise<void>
  }
  options: {
    createNamedFolder: boolean
    outputInRootFolder: boolean
    formatParentFolderName?: (props: {
      currentName: string
      helpers: SuperCodeGeneratorHelpersProps
    }) => {
      newName: string
    }
  }
  usageInstructions: string
  files: {
    path: (props: SuperCodeGeneratorFileProps) => string
    template: (props: SuperCodeGeneratorFileProps) => string
    parentFolderName?: (props: SuperCodeGeneratorFileProps) => string
  }[]
}[]

export type SuperCodeGeneratorTemplateSchema = SuperCodeGeneratorConfigSchema[0]

export type SuperCodeGeneratorFilesSchema = SuperCodeGeneratorTemplateSchema['files']

export type SuperCodeGeneratorFileProps = {
  name: string
  helpers: SuperCodeGeneratorHelpersProps
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
