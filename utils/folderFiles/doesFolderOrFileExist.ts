import fs from 'fs'

/**
 * @example
 * doesFolderOrFileExist(dir)
 */
export default function doesFolderOrFileExist(path: string) {
  return fs.existsSync(path)
}
