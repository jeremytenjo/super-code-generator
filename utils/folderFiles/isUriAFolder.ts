import vscode from 'vscode'

export default async function isUriAFolder(uri) {
  const itemStats = await vscode.workspace.fs.stat(uri)
  const isFolder = itemStats.type === 2

  return isFolder
}
