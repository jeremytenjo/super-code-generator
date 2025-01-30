import vscode from 'vscode'

export default function openBrowserLink(url: string) {
  vscode.env.openExternal(vscode.Uri.parse(url))
}
