const vscode = require('vscode')
const path = require('path')
const doesFileExist = require('./doesFolderOrFileExist')
const assert = require('../log/assert')

module.exports = function importFileInWorkspace(uri) {
  const uriPath = path.join(vscode.workspace.workspaceFolders[0].uri.path, uri)
  const uriPathExists = doesFileExist(uriPath)
  assert(uriPathExists, `Schema not found at ${uriPath}`)
  const fileData = require(uriPath)

  return fileData
}
