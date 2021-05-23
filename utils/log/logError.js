const vscode = require('vscode')

module.exports = function logError(errorMessage, options = { silent: false }) {
  if (!options.silent) {
    vscode.window.showErrorMessage(errorMessage.toString())
  }
  throw Error(errorMessage)
}
