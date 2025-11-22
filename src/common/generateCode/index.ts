import vscode from 'vscode'
import path from 'path'

import logError from '../../../utils/log/logError'
import helpers from './handlers/helpers'
import importPrettierConfig from './handlers/importPrettierConfig'
import create from './handlers/create'
import getImportUserConfig from '../../../utils/getImportUserConfig/getImportUserConfig'
import { platform } from 'process'
import splitPath, { StartsWithSlashRegex } from '../../../utils/splitPath'
import removeFirstCharacter from '../../../utils/folderFiles/removeFirstCharacter'
import { ParamsFilePropsSchema } from '../../../utils/types/ParamsPropsSchema'
import useRecentSelectedComponents from './handlers/useRecentSelectedComponents'

export type generateCodeProps = {
  outputPath: string
  context?: vscode.ExtensionContext
}

export default async function generateCode({ outputPath, context }: generateCodeProps) {
  // Get the user config and schema config
  const importedUsrCfg = await getImportUserConfig()

  // If the config file is not found, show an error message
  if (importedUsrCfg === undefined) {
    vscode.window.showErrorMessage('Schema config file not found.')
    return null
  }

  // Destructure the user config and schema config
  const { userConfig, configFile } = importedUsrCfg!

  // Make a list of the options from the schema
  const optionsList = configFile.map((property: { type?: string }, index: number) => {
    if (!property.type) {
      logError(`Missing type property in config file array object index ${index}`)
    }

    return { label: property.type }
  })

  // Import the prettier config
  const prettierConfig = await importPrettierConfig({
    prettierConfigPath: userConfig.prettierConfigFilePath,
  })

  // Get recent components if context is available
  let recentComponents: vscode.QuickPickItem[] = []
  let recentComponentsHandler: ReturnType<typeof useRecentSelectedComponents> | null =
    null

  if (context) {
    recentComponentsHandler = useRecentSelectedComponents({ context })
    recentComponents = recentComponentsHandler.get()
  }

  // Create a quick pick to select the component type
  const quickPick = vscode.window.createQuickPick()

  // Combine recent components with all options, avoiding duplicates
  const recentLabels = new Set(recentComponents.map((item) => item.label).filter(Boolean))
  const filteredOptionsList = optionsList.filter(
    (item) => item.label && !recentLabels.has(item.label),
  )
  const allItems = [...recentComponents, ...filteredOptionsList]

  quickPick.items = allItems as readonly vscode.QuickPickItem[]

  // Add a handler for selection change event
  quickPick.onDidChangeSelection(async (selection) => {
    const [selectedComponentType] = selection

    // Track the selected component if context is available
    if (recentComponentsHandler) {
      recentComponentsHandler.update(selectedComponentType)
    }

    // Find the selected component's config from the schema
    const selectedComponentTypeConfig = configFile.find(
      ({ type }: { type: string }) => type === selectedComponentType.label,
    )

    // Prompt the user for the name of the component
    const componentName = await vscode.window.showInputBox({
      value: '',
      title: `${selectedComponentType.label} Name`,
      placeHolder:
        'Create multiple components by separating names with commas eg button, modal',
      validateInput: (value) => {
        if (value === '') return 'Missing name'
      },
      prompt: selectedComponentTypeConfig?.usageInstructions,
    })

    // If the user cancels the input box, return null
    if (!componentName) return null

    // Split the component names by commas
    const componentNames = componentName.split(',')

    // If the user is on Windows, remove the first character of the output path if it starts with a slash
    outputPath =
      platform == 'win32' && StartsWithSlashRegex.test(outputPath)
        ? removeFirstCharacter(outputPath)
        : outputPath

    // create the components
    try {
      await Promise.all(
        componentNames.map(async (componentName) => {
          const componentNameTrimmed = componentName.trim()
          let componentOutputPath: string[]
          if (!selectedComponentTypeConfig) {
            logError(`No config found for ${selectedComponentType.label}`)
            return null
          }

          if (selectedComponentTypeConfig.outputWithoutParentDir) {
            componentOutputPath = splitPath(outputPath)
            componentOutputPath.pop()
            const tmpOutputPath = componentOutputPath.join(path.sep)
            const relativePath = path.relative(tmpOutputPath, outputPath)
            if (relativePath.startsWith('..') && path.isAbsolute(relativePath)) {
              outputPath = tmpOutputPath
            }
          }

          let params: ParamsFilePropsSchema = {}

          if (selectedComponentTypeConfig?.params) {
            await Promise.all(
              selectedComponentTypeConfig.params.map(async (param) => {
                if (param.type === 'input') {
                  const paramValue = await vscode.window.showInputBox({
                    value: '',
                    title: `${selectedComponentType.label} - ${param.name}`,
                    placeHolder: `Enter ${param.name}`,
                    prompt: param.description,
                  })

                  if (paramValue !== undefined) {
                    params = {
                      ...params,
                      [param.name]: paramValue,
                    }
                  }
                }

                if (param.type === 'dropdown') {
                  if (!param.options) {
                    logError(`Missing options for ${param.name}`)
                    return null
                  }

                  const options = param.options.map((option) => {
                    return String(option.value)
                  })

                  const paramValue = await vscode.window.showQuickPick(options, {
                    title: `${selectedComponentType.label} - ${param.name}`,
                    placeHolder: `Select ${param.name}`,
                    canPickMany: false,
                  })

                  if (paramValue !== undefined) {
                    params = {
                      ...params,
                      [param.name]: paramValue,
                    }
                  }
                }

                if (param.type === 'file') {
                  const fileUris = await vscode.window.showOpenDialog({
                    canSelectFiles: true,
                    canSelectFolders: false,
                    canSelectMany: false,
                    openLabel: `Select ${param.name}`,
                    title: `${selectedComponentType.label} - ${param.name}`,
                  })

                  if (fileUris && fileUris.length > 0) {
                    params = {
                      ...params,
                      [param.name]: fileUris[0].fsPath,
                    }
                  }
                }

                if (param.type === 'tags') {
                  if (!param.options) {
                    logError(`Missing options for ${param.name}`)
                    return null
                  }

                  const options = param.options.map((option) => {
                    return String(option.value)
                  })

                  const selectedTags = await vscode.window.showQuickPick(options, {
                    title: `${selectedComponentType.label} - ${param.name}`,
                    placeHolder: `Select ${param.name}`,
                    canPickMany: true,
                  })

                  if (selectedTags !== undefined) {
                    params = {
                      ...params,
                      [param.name]: selectedTags.map((tag) => ({ name: tag })) as { name: string }[],
                    }
                  }
                }
              }),
            )
          }

          if (selectedComponentTypeConfig?.defaultParams) {
            // Filter out undefined values from defaultParams
            const validDefaultParams: ParamsFilePropsSchema = {}
            for (const [key, value] of Object.entries(
              selectedComponentTypeConfig.defaultParams,
            )) {
              if (value !== undefined) {
                validDefaultParams[key] = value as string
              }
            }

            params = {
              ...validDefaultParams,
              ...params,
            }
          }

          await create({
            name: componentNameTrimmed,
            helpers,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            componentConfig: selectedComponentTypeConfig as any,
            componentOutputPath: outputPath,
            prettierConfig,
            params,
          })

          if (
            selectedComponentTypeConfig?.hooks?.onCreate &&
            vscode.workspace.workspaceFolders !== undefined
          ) {
            await selectedComponentTypeConfig?.hooks?.onCreate({
              outputPath: outputPath,
              componentName: componentNameTrimmed,
              params,
              workspacePath: vscode.workspace.workspaceFolders[0].uri.path,
              helpers,
            })
          }
        }),
      )

      vscode.window.showInformationMessage(`${componentName} created! 🚀`)
    } catch (error: unknown) {
      logError((error as Error).message)
    } finally {
      quickPick.dispose()
    }
  })

  quickPick.onDidHide(() => quickPick.dispose())
  quickPick.title = 'Select Template'
  quickPick.placeholder = 'Type to filter'
  quickPick.show()
}
