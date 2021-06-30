const vscode = require('vscode')

module.exports = function logError(errorMessage, options = { silent: false }) {
  if (options.silent) {
    console.error(errorMessage)
    throw Error(errorMessage)
  } else {
    console.error(errorMessage.toString())
    vscode.window.showErrorMessage(errorMessage.toString())
  }
}
