import vscode from 'vscode'
import path from 'path'
import doesFileExist from './doesFolderOrFileExist'
import assert from '../log/assert'
import importTs from '../importTsFile/importTsFile'

export type ImportFileInWorkspaceProps = {
  uri: string
}

export default async function importFileInWorkspace(props: ImportFileInWorkspaceProps) {
  const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath
  let uriPath: string

  if (props.uri.startsWith('file://')) {
    uriPath = vscode.Uri.parse(props.uri).fsPath
  } else {
    uriPath = path.join(workspaceRoot, props.uri)
  }

  uriPath = path.normalize(uriPath)

  const uriPathExists = doesFileExist(uriPath)
  assert(uriPathExists, `Schema not found at ${uriPath}`)

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

export type ImportFileInWorkspaceReturn = ReturnType<typeof importFileInWorkspace>
