import vscode from 'vscode'

export default function logError(errorMessage, options = { silent: false }) {
  if (options.silent) {
    throw new Error(errorMessage)
  } else {
    vscode.window.showErrorMessage(errorMessage.toString())
  }
}
