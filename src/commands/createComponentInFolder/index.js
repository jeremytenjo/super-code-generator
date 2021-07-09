const vscode = require('vscode')

const logError = require('../../../utils/log/logError')
const createComponent = require('../../common/createComponent')
const genFolderSelectionList = require('./handlers/genFolderSelectionList')
const useRecentSelectedPaths = require('./handlers/useRecentSelectedPaths')

/**
 * User selects folder from a dropdown to put component in
 */
module.exports = async function createComponentInFolder(context) {
  try {
    const folderSelectionList = await genFolderSelectionList()
    const recentSelectedPaths = useRecentSelectedPaths(context).get()
    const quickPick = vscode.window.createQuickPick()
    quickPick.items = [...recentSelectedPaths, ...folderSelectionList]

    quickPick.onDidChangeSelection(async (selection) => {
      const [selectedFile] = selection
      useRecentSelectedPaths(context).update(selectedFile)

      await createComponent({
        outputPath: selectedFile.path,
        prefixedPaths: recentSelectedPaths
      })
    })

    quickPick.onDidHide(() => quickPick.dispose())
    quickPick.title = 'Select folder to add component to'
    quickPick.placeholder = 'Type to filter'
    quickPick.show()
  } catch (error) {
    logError(error)
  }
}
