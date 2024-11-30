import vscode from 'vscode'
import path from 'path'

export default async function getWorkspacePath(add = '') {
  const folderUri = vscode.workspace.workspaceFolders[0].uri
  return path.join(folderUri.path, add)
}
