const getActiveFilePath = require('./getActiveFilePath')
const splitPath = require('../splitPath')

/**
 * Get the folder path of the currently open and active vscode file
 */
module.exports = function getActiveFileFolderPath() {
  const activeFilePath = getActiveFilePath()
  let activeFileFolder = splitPath(activeFilePath)

  activeFileFolder.pop()
  activeFileFolder = activeFileFolder.join('/')

  return activeFileFolder
}
