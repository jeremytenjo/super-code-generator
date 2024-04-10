const vscode = require('vscode')
const path = require('path')

const logError = require('../../../utils/log/logError')
const helpers = require('./handlers/helpers')
const importFileInWorkspace = require('../../../utils/folderFiles/importFileInWorkspace')
const validateUserConfigFile = require('./handlers/validateUserConfigFile')
const importPrettierConfig = require('./handlers/importPrettierConfig')
const create = require('./handlers/create')

module.exports = async function generateCode({ outputPath }) {
  const userConfig = vscode.workspace.getConfiguration('superCodeGenerator')
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
    console.log('selection', selection)
    console.log('selection', selection)

    console.log('optionsList', optionsList)
    console.log('optionsList', optionsList)

    const componentName = await vscode.window.showInputBox({
      value: '',
      title: `${selectedComponentType.label} Name`,
      placeHolder:
        'Create multiple components by separating names with commas eg button, modal',
      validateInput: (value) => {
        if (value === '') return 'Missing name'
      },
      prompt: 'Used for this yeah',
    })

    if (!componentName) return null

    const selectedComponentTypeConfig = configFile.find(
      ({ type }) => type === selectedComponentType.label,
    )

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
            componentConfig: selectedComponentTypeConfig,
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
