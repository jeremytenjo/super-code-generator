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
    outputInRootFolder?: boolean
  }[]
  outputWithoutParentDir?: boolean
  usageInstructions?: string
  hooks?: {
    onCreate: (props: {
      outputPath: string
      componentName: string
    }) => void | Promise<void>
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
  folderPath?: string
  helpers?: SuperCodeGeneratorHelpersProps
  customProps?: CustomProps
  type?: string
}

export type SuperCodeGeneratorUserConfigSchema = {
  schemaFilePath: string
  prettierConfigFilePath: string
}

const extensionName = 'superCodeGenerator'

function firstTimeActivation(context: vscode.ExtensionContext) {
  // Don't run on MacOS as it was built on MacOS so it's not needed
  if (process.platform === 'darwin') return
  // Get the extension version
  const version = context.extension.packageJSON.version ?? '1.0.0'
  // get the previous version
  const previousVersion = context.globalState.get(context.extension.id);
  
  if (previousVersion === version) {
    console.log('Super Code Generator depedencies are up to date');
    return;
  }
  console.log("Super Code Generator dependencies are outdated. Updating...");

  
  const terminal = vscode.window.createTerminal({
    name: 'Super Code Generator - Install Dependencies',
    hideFromUser: false,
    isTransient: true,
    cwd: context.extensionPath,
  })
  terminal.sendText('npm ci --omit=dev')
  terminal.show()
  terminal.dispose()

  context.globalState.update(context.extension.id, version)
}

/**
 * @param {vscode.ExtensionContext} context
 * {@Link https://code.visualstudio.com/api/references/vscode-api#ExtensionContext|ExtensionContext API}
 */
export function activate(context: vscode.ExtensionContext) {
  console.log(`${extensionName} activated!`)
  firstTimeActivation(context)

  // Register the generateCode command
  context.subscriptions.push(
    vscode.commands.registerCommand('superCodeGenerator.generateCode', generateCode),
  )

  // Register the generateCodeInFolder command
  context.subscriptions.push(
    vscode.commands.registerCommand('superCodeGenerator.generateCodeInFolder', () =>
      generateCodeInFolder(context),
    ),
  )
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log(`${extensionName} deactivated!`)
}
