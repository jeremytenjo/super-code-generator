import vscode, { ExtensionContext } from 'vscode'

import logError from '../../../utils/log/logError'
import generateCode from '../../common/generateCode'
import genFolderSelectionList from './handlers/genFolderSelectionList'
import useRecentSelectedPaths from './handlers/useRecentSelectedPaths'

/**
 * User selects folder from a dropdown to put component in
 */
export default async function generateCodeInFolder(context: ExtensionContext) {
  try {
    const folderSelectionList = await genFolderSelectionList()
    const recentSelectedPaths = useRecentSelectedPaths(context).get()
    const quickPick = vscode.window.createQuickPick()
    quickPick.items = [...recentSelectedPaths, ...folderSelectionList]

    quickPick.onDidChangeSelection(async (selection) => {
      const [selectedFile] = selection
      useRecentSelectedPaths(context).update(selectedFile)

      await generateCode({
        outputPath: selectedFile.label,
        context,
      })
    })

    quickPick.onDidHide(() => quickPick.dispose())
    quickPick.title = 'Select folder to add component to'
    quickPick.placeholder = 'Type to filter'
    quickPick.show()
  } catch (error: unknown) {
    logError((error as Error).message)
  }
}
