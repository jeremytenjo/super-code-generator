import vscode from 'vscode'

export default function getActiveFilePath() {
  return vscode.window.activeTextEditor.document.uri.fsPath
}
