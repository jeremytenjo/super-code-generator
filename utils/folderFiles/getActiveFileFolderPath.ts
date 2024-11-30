import getActiveFilePath from './getActiveFilePath'
import splitPath from '../splitPath'

/**
 * Get the folder path of the currently open and active vscode file
 */
export default function getActiveFileFolderPath() {
  const activeFilePath = getActiveFilePath()
  let activeFileFolder = splitPath(activeFilePath)

  activeFileFolder.pop()
  activeFileFolder = activeFileFolder.join('/')

  return activeFileFolder
}
