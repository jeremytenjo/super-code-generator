const vscode = require('vscode')

const logError = require('../../../utils/log/logError')
const genFolderSelectionList = require('./handlers/genFolderSelectionList')
const createComponent = require('../../common/createComponent')

/**
 * User selects folder from a dropdown to put component in
 */
module.exports = async function createComponentInFolder() {
  try {
    const folderSelectionList = await genFolderSelectionList()
    const quickPick = vscode.window.createQuickPick()
    quickPick.items = folderSelectionList

    quickPick.onDidChangeSelection(async (selection) => {
      const [selectedFile] = selection

      await createComponent({ outputPath: selectedFile.path })
    })

    quickPick.onDidHide(() => quickPick.dispose())
    quickPick.title = 'Select folder to add component to'
    quickPick.placeholder = 'Type to filter'
    quickPick.show()
  } catch (error) {
    logError(error)
  }
}
