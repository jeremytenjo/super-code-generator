import vscode from 'vscode'
import path from 'path'
import doesFileExist from './doesFolderOrFileExist'
import assert from '../log/assert'
import importTs from '../importTsFile/importTsFile'

export default async function importFileInWorkspace(uri) {
  const uriPath = path.join(vscode.workspace.workspaceFolders[0].uri.path, uri)
  const uriPathExists = doesFileExist(uriPath)

  const fileeee = await importTs({
    filePath: uriPath,
  })

  console.log({
    fileeee,
  })

  process.exit(0)

  assert(uriPathExists, `Schema not found at ${uriPath}`)
  const fileData = require(uriPath)
  console.log('fileData', fileData)

  return fileData
}
