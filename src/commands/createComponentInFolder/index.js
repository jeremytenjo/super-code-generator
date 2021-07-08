const vscode = require('vscode')

const logError = require('../../../utils/log/logError')

/**
 * User selects folder from a dropdown to put component in
 */
module.exports = async function createComponentInFolder() {
  try {
    const workplaceFiles = [{ label: 'ehhlo' }, { label: 'hello2' }]
    const quickPick = vscode.window.createQuickPick()
    quickPick.items = workplaceFiles

    quickPick.onDidChangeSelection(async (selection) => {
      const [selectedFile] = selection

      console.log(selectedFile)
    })

    quickPick.onDidHide(() => quickPick.dispose())
    quickPick.title = 'Select folder to add component to'
    quickPick.placeholder = 'Type to filter'
    quickPick.show()
  } catch (error) {
    logError(error)
  }
}
