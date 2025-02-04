import getActiveFilePath from './getActiveFilePath'
import splitPath from '../splitPath'
import { sep } from 'path'

/**
 * Get the folder path of the currently open and active vscode file
 */
export default function getActiveFileFolderPath() {
  const activeFilePath = getActiveFilePath()
  // split the path into an array
  const activeFileFolder: string[] = splitPath(activeFilePath)
  // remove the last element
  activeFileFolder.pop()

  const activeFileFolderPath = activeFileFolder.join(sep)

  return {
    activeFileFolderPath,
  }
}
