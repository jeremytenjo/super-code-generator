import vscode from 'vscode'

import createUri from './createUri'

export default async function openFile(filePath: string) {
  // to open a file in vscode, we need to get the uri of the file, then open it 
  vscode.window.showTextDocument(await vscode.workspace.openTextDocument(createUri(filePath)))
}
