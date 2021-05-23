const vscode = require('vscode')
const doesFolderOrFileExist = require('./doesFolderOrFileExist')
const createUri = require('./createUri')
const logError = require('../log/logError')

module.exports = async function createFile(outputPath, content) {
  const writeData = Buffer.from(content, 'utf8')
  const folderUri = createUri(outputPath)

  const doesExist = await doesFolderOrFileExist(outputPath)

  if (doesExist) logError(`${outputPath} already exitsts`)

  await vscode.workspace.fs.writeFile(folderUri, writeData)
}
