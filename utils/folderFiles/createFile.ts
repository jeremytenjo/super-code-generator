import vscode from 'vscode'
import doesFolderOrFileExist from './doesFolderOrFileExist'
import createUri from './createUri'
import logError from '../log/logError'
import { platform } from 'process'
import { StartsWithSlashRegex } from '../splitPath'
import removeFirstCharacter from './removeFirstCharacter'

export default async function createFile(outputPath: string, content: string) {
  const writeData = Buffer.from(content, 'utf8')
  if (platform === 'win32' && StartsWithSlashRegex.test(outputPath)) {
    outputPath = removeFirstCharacter(outputPath)
  }
  const folderUri = createUri(outputPath)

  if (doesFolderOrFileExist(outputPath)) logError(`${outputPath} already exists`)

  await vscode.workspace.fs.writeFile(folderUri, writeData)
}
