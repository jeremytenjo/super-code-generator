import removeFirstCharacter from '../../../../utils/folderFiles/removeFirstCharacter/index'
import removeLastCharacter from '../../../../utils/folderFiles/removeLastCharacter/index'
import getFoldersInWorkspace from '../../../../utils/folderFiles/getFoldersInWorkspace'
import getWorkspacePath from '../../../../utils/workspace/getWorkspacePath'

export default async function genFolderSelectionList() {
  const workspacePath = getWorkspacePath({})
  const workplaceFiles = await getFoldersInWorkspace()
  const folderSelectionList = workplaceFiles.map((wsFile) => ({
    label:
      wsFile.replace(workspacePath.path, '') === '/'
        ? '/'
        : removeFirstCharacter(
            removeLastCharacter(wsFile.replace(workspacePath.path, '')),
          ),
    path: wsFile,
  }))

  return folderSelectionList
}
