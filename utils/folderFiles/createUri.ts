import { pathToFileURL } from 'url';
import vscode from 'vscode'

export default function createUri(uri: string) {
  return vscode.Uri.parse(pathToFileURL(uri).toString());
}
