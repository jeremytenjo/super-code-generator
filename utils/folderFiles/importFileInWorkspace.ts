import vscode from 'vscode'
import path from 'path'
import doesFileExist from './doesFolderOrFileExist'
import assert from '../log/assert'

export default function importFileInWorkspace(uri) {
  const uriPath = path.join(vscode.workspace.workspaceFolders[0].uri.path, uri)
  const uriPathExists = doesFileExist(uriPath)
  assert(uriPathExists, `Schema not found at ${uriPath}`)
  const fileData = require(uriPath)
  console.log('fileData', fileData)

  return fileData
}
