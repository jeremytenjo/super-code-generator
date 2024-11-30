import vscode from 'vscode'
import doesFolderOrFileExist from './doesFolderOrFileExist'
import createUri from './createUri'
import logError from '../log/logError'

export default async function createFile(outputPath, content) {
  const writeData = Buffer.from(content, 'utf8')
  const folderUri = createUri(outputPath)

  const doesExist = await doesFolderOrFileExist(outputPath)

  if (doesExist) logError(`${outputPath} already exitsts`)

  await vscode.workspace.fs.writeFile(folderUri, writeData)
}
