const vscode = require('vscode')

module.exports = function getActiveFilePath() {
  return vscode.window.activeTextEditor.document.uri.fsPath
}
