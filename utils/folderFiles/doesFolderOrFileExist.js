const fs = require('fs')

/**
 * @example
 * doesFolderOrFileExist(dir)
 */
module.exports = function doesFolderOrFileExist(path) {
  return fs.existsSync(path)
}
