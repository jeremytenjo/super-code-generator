import vscode from 'vscode'
import path from 'path'
import doesFileExist from './doesFolderOrFileExist'
import assert from '../log/assert'
import importTs from '../importTsFile/importTsFile'

export default async function importFileInWorkspace(uri) {
  let uriPath = path.join(vscode.workspace.workspaceFolders[0].uri.path, uri)
  const uriPathExists = doesFileExist(uriPath)

  assert(uriPathExists, `Schema not found at ${uriPath}`)

  if (uriPath.startsWith('\\')) {
    uriPath = uriPath.slice(0)
  }

  if (uriPath.includes('.ts')) {
    const fileData = await importTs({
      filePath: uriPath,
    })

    return fileData
  } else {
    const fileData = require(uriPath)

    return fileData
  }
}
