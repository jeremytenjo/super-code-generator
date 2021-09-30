const vscode = require('vscode')

module.exports = function logError(errorMessage, options = { silent: false }) {
  if (options.silent) {
    throw new Error(errorMessage)
  } else {
    vscode.window.showErrorMessage(errorMessage.toString())
  }
}
