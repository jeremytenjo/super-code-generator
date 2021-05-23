const vscode = require('vscode')
const path = require('path')

module.exports = function getWorkspacePath(add) {
  const folderUri = vscode.workspace.workspaceFolders[0].uri
  return path.join(folderUri.path, add)
}
