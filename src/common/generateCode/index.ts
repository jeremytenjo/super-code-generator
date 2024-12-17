import vscode from 'vscode'
import path from 'path'

import logError from '../../../utils/log/logError'
import helpers from './handlers/helpers'
import importPrettierConfig from './handlers/importPrettierConfig'
import create from './handlers/create'
import getImportUserConfig from '../../../utils/getImportUserConfig/getImportUserConfig'

export default async function generateCode({ outputPath }) {
  const { userConfig, configFile } = await getImportUserConfig()

  const optionsList = configFile.map((property, index) => {
    if (!property.type) {
      logError(`Missing type property in config file array object index ${index}`)
    }

    return { label: property.type }
  })

  const prettierConfig = await importPrettierConfig({
    prettierConfigPath: userConfig.prettierConfigFilePath,
  })

  const quickPick = vscode.window.createQuickPick()
  quickPick.items = optionsList
  quickPick.onDidChangeSelection(async (selection) => {
    const [selectedComponentType] = selection

    const selectedComponentTypeConfig = configFile.find(
      ({ type }) => type === selectedComponentType.label,
    )

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

    if (!componentName) return null

    const componentNames = componentName.split(',')

    try {
      await Promise.all(
        componentNames.map(async (componentName) => {
          const componentNameTrimmed = componentName.trim()
          const folderName = path.join(outputPath, componentNameTrimmed)
          let componentOutputPath = outputPath

          if (selectedComponentTypeConfig.outputWithoutParentDir) {
            componentOutputPath = componentOutputPath.split('/')
            componentOutputPath.pop()
            componentOutputPath = componentOutputPath.join('/')
          }

          await create({
            name: componentNameTrimmed,
            helpers,
            componentConfig: selectedComponentTypeConfig as any,
            componentOutputPath,
            prettierConfig,
          })

          if (selectedComponentTypeConfig?.hooks?.onCreate) {
            await selectedComponentTypeConfig?.hooks?.onCreate({ outputPath: folderName })
          }
        }),
      )

      vscode.window.showInformationMessage(`${componentName} created!`)
    } catch (error) {
      logError(error)
    } finally {
      quickPick.dispose()
    }
  })

  quickPick.onDidHide(() => quickPick.dispose())
  quickPick.title = 'Select Component Type'
  quickPick.placeholder = 'Type to filter'
  quickPick.show()
}
