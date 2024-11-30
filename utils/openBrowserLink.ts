import vscode from 'vscode'

export default function openBrowserLink(url) {
  vscode.env.openExternal(vscode.Uri.parse(url))
}
