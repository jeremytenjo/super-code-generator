import getActiveFilePath from './getActiveFilePath'
import splitPath from '../splitPath'
import { sep } from 'path'

/**
 * Get the folder path of the currently open and active vscode file
 */
export default function getActiveFileFolderPath(): string {
  const activeFilePath = getActiveFilePath()
  // split the path into an array
  const activeFileFolder: string[] = splitPath(activeFilePath)
  // remove the last element
  activeFileFolder.pop()

  //
  const _activeFilePath = getActiveFilePath()
  let _activeFileFolder = splitPath(_activeFilePath)

  _activeFileFolder.pop()
  const olg_activeFileFolder = activeFileFolder.join('/')

  console.log('olg_activeFileFolder')
  //

  return activeFileFolder.join(sep)
}
