import vscode from 'vscode'
import generateCode from './commands/generateCodeCommand'
import generateCodeInFolder from './commands/generateCodeInFolder'
import { SuperCodeGeneratorHelpersProps } from './common/generateCode/handlers/helpers'

export type SuperCodeGeneratorConfigSchema<CustomProps = object> = {
  type: string
  files: {
    path: (props: SuperCodeGeneratorFileProps<CustomProps>) => string
    template: (props: SuperCodeGeneratorFileProps<CustomProps>) => string
    parentFolderName?: (props: SuperCodeGeneratorFileProps<CustomProps>) => string
  }[]
  outputWithoutParentDir?: boolean
  usageInstructions?: string
  hooks?: {
    onCreate: (props: { outputPath: string }) => void | Promise<void>
  }
  options?: {
    createNamedFolder?: boolean
    outputInRootFolder?: boolean
    formatParentFolderName?: (props: {
      currentName: string
      helpers: SuperCodeGeneratorHelpersProps
      outputPath: string
    }) => {
      newName: string
    }
  }
}[]

export type SuperCodeGeneratorTemplateSchema<CustomProps = object> =
  SuperCodeGeneratorConfigSchema<CustomProps>[0]

export type SuperCodeGeneratorFilesSchema<CustomProps = object> =
  SuperCodeGeneratorTemplateSchema<CustomProps>['files']

export type SuperCodeGeneratorFileProps<CustomProps = object> = {
  name: string
  helpers?: SuperCodeGeneratorHelpersProps
  customProps?: CustomProps
  type?: string
}

export type SuperCodeGeneratorUserConfigSchema = {
  schemaFilePath: string
  prettierConfigFilePath: string
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
