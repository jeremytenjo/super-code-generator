import vscode from 'vscode'
import path from 'path'
import { platform } from 'process';
import { StartsWithSlashRegex } from '../splitPath';
import removeFirstCharacter from '../folderFiles/removeFirstCharacter';

export type FilePath = {
  path: string;
  getFileUri(): string;
  getExtension(): string;
  hasExtension(ext: string): boolean;
  addFile(dir: string): void;
}

export default function getWorkspacePath(add = ''): FilePath {
  // Get the workspace folder uri
  const folderUri = vscode.workspace.workspaceFolders![0].uri
  
  // add the path to the workspace folder
  let filePath = path.join(folderUri.path, add);

  // If the platform is windows and the path starts with a slash, remove the slash
  if(platform == "win32" && StartsWithSlashRegex.test(filePath)) {
    filePath = removeFirstCharacter(filePath)
  }

  // Return the object
  return {
    path: filePath,
    getFileUri() {
      return `file:${path.sep.repeat(2)}${filePath}`
    },
    getExtension(): string {
      return path.extname(filePath)
    },
    hasExtension(ext) {
      return this.getExtension() === ext
    },
    addFile(dir) {
      this.path = path.join(this.path, dir)
    },
  }
}
