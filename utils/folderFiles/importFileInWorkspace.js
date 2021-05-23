const vscode = require('vscode')
const path = require('path')

module.exports = function importFileInWorkspace(uri) {
  const fileData = require(path.join(
    vscode.workspace.workspaceFolders[0].uri.path,
    uri
  ))

  return fileData
}
