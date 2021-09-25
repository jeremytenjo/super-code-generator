const removeFirstCharacter = require('../../../../utils/folderFiles/removeFirstCharacter/index')
const removeLastCharacter = require('../../../../utils/folderFiles/removeLastCharacter/index')
const getFoldersInWorkspace = require('../../../../utils/folderFiles/getFoldersInWorkspace')
const getWorkspacePath = require('../../../../utils/workspace/getWorkspacePath')

module.exports = async function genFolderSelectionList() {
  const workspacePath = await getWorkspacePath()
  const workplaceFiles = await getFoldersInWorkspace()
  const folderSelectionList = workplaceFiles.map((wsFile) => ({
    label:
      wsFile.replace(workspacePath, '') === '/'
        ? '/'
        : removeFirstCharacter(removeLastCharacter(wsFile.replace(workspacePath, ''))),
    path: wsFile,
  }))

  return folderSelectionList
}
