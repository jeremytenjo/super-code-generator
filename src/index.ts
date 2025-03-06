import vscode from 'vscode'
import generateCode from './commands/generateCodeCommand'
import generateCodeInFolder from './commands/generateCodeInFolder'
import { SuperCodeGeneratorHelpersProps } from './common/generateCode/handlers/helpers'
import { installDependencies } from './commands/installDependencies'

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

export type SuperCodeGeneratorSettingsSchema = {
  verbose: boolean
  useDependencyAutoInstaller: boolean
}


const extensionName = 'superCodeGenerator'

async function firstTimeActivation(context: vscode.ExtensionContext) {
  // Don't run on MacOS as it was built on MacOS so it's not needed
  if (process.platform === 'darwin') return
  const userSettings = context.workspaceState.get(`${context.extension.id}.extensionSettings`) as SuperCodeGeneratorSettingsSchema

  // Check if the user has disabled the dependency auto installer
  if (!userSettings.useDependencyAutoInstaller) {
    if (userSettings.verbose) {
      vscode.window.showInformationMessage('Super Code Generator dependencies auto installer is disabled');
    }
    return;
  }

  // Get the extension version
  const version = context.extension.packageJSON.version ?? '0.0.0'
  // get the previous version
  const previousVersion = context.globalState.get(context.extension.id);

  if (previousVersion === version) {
    if (userSettings.verbose && userSettings.verbose) {
      vscode.window.showInformationMessage('Super Code Generator dependencies are up to date');
    }
    return;
  }
  if (userSettings.verbose && userSettings.verbose) {
    vscode.window.showInformationMessage('Super Code Generator dependencies are outdated. Updating...');
  }

  installDependencies(context, userSettings.verbose);

  context.globalState.update(context.extension.id, version)
}

/**
 * @param {vscode.ExtensionContext} context
 * {@Link https://code.visualstudio.com/api/references/vscode-api#ExtensionContext|ExtensionContext API}
 */
export function activate(context: vscode.ExtensionContext) {
  // load the extension configuration
  const extensionConfig =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vscode.workspace.getConfiguration('superCodeGenerator');
  
  // check if the user has enabled verbose mode
  const extensionSettings: SuperCodeGeneratorSettingsSchema = {
    verbose: extensionConfig.get('verbose'),
    useDependencyAutoInstaller: extensionConfig.get('useDependencyAutoInstaller'),
  };

  if(extensionSettings.verbose) {
    vscode.window.showInformationMessage('Super Code Generator running in verbose mode');
  }
  
  context.workspaceState.update(`${context.extension.id}.extensionSettings`, extensionSettings);

  if(extensionSettings.useDependencyAutoInstaller)
    firstTimeActivation(context)

  context.subscriptions.push(
    vscode.commands.registerCommand('superCodeGenerator.installDependencies', () =>
      installDependencies(context, extensionSettings.verbose),
    ),
  )

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
