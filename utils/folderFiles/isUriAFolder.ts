import vscode from 'vscode'

export default async function isUriAFolder(uri: vscode.Uri) {
  const itemStats = await vscode.workspace.fs.stat(uri)

  return itemStats.type === vscode.FileType.Directory
}
