import vscode from 'vscode'

export default function logError(errorMessage: string, options = { silent: false }) {
  if (options.silent) {
    throw new Error(errorMessage)
  } else {
    vscode.window.showErrorMessage(errorMessage.toString())
  }
}
