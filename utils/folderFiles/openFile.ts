import vscode from 'vscode'

import createUri from './createUri'

export default function openFile(filePath) {
  const folderUri = createUri(filePath)
  vscode.window.showTextDocument(folderUri)
}
