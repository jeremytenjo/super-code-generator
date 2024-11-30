import vscode from 'vscode'
import path from 'path'
import doesFileExist from './doesFolderOrFileExist'
import assert from '../log/assert'
import importTs from '../importTsFile/importTsFile'

export default async function importFileInWorkspace(uri) {
  const uriPath = path.join(vscode.workspace.workspaceFolders[0].uri.path, uri)
  const uriPathExists = doesFileExist(uriPath)

  assert(uriPathExists, `Schema not found at ${uriPath}`)

  if (uriPath.includes('.ts')) {
    console.log('importing ts file', uriPath)

    const fileData = await importTs({
      filePath: uriPath,
    })

    console.log({
      fileData,
    })

    return fileData
  } else {
    const fileData = require(uriPath)

    return fileData
  }
}
