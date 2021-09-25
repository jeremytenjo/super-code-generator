const vscode = require('vscode')

const logError = require('../../../utils/log/logError')
const helpers = require('./handlers/helpers')
const importFileInWorkspace = require('../../../utils/folderFiles/importFileInWorkspace')
const validateUserConfigFile = require('./handlers/validateUserConfigFile')
const importPrettierConfig = require('./handlers/importPrettierConfig')
const create = require('./handlers/create')

module.exports = async function createComponent({ outputPath }) {
  const userConfig = vscode.workspace.getConfiguration('quickComponentCreator')
  const configFile = importFileInWorkspace(userConfig.schemaFilePath)

  validateUserConfigFile(configFile)

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
    const componentName = await vscode.window.showInputBox({
      value: '',
      title: 'Component Name',
      placeHolder:
        'Create multiple components by separating names with commas eg button, modal',
      validateInput: (value) => {
        if (value === '') return 'Missing name'
      },
    })

    if (!componentName) return null

    const selectedComponentTypeConfig = configFile.find(
      ({ type }) => type === selectedComponentType.label,
    )

    const componentNames = componentName.split(',')

    await Promise.all(
      componentNames.map(async (componentName) => {
        await create({
          name: componentName.trim(),
          helpers,
          componentConfig: selectedComponentTypeConfig,
          componentOutputPath: outputPath,
          prettierConfig,
        })
      }),
    )

    if (selectedComponentTypeConfig?.hooks?.onCreate) {
      await selectedComponentTypeConfig?.hooks?.onCreate({ outputPath })
    }

    vscode.window.showInformationMessage(`${componentName} created!`)
    quickPick.dispose()
  })

  quickPick.onDidHide(() => quickPick.dispose())
  quickPick.title = 'Select Component Type'
  quickPick.placeholder = 'Type to filter'
  quickPick.show()
}
