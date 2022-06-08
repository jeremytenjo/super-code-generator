const generateCode = require('../../common/generateCode')
const logError = require('../../../utils/log/logError')
const getActiveFileFolderPath = require('../../../utils/folderFiles/getActiveFileFolderPath')

module.exports = async function generateCodeCommand(
  { path: componentOutputPath } = { path: getActiveFileFolderPath() },
) {
  try {
    await generateCode({ outputPath: componentOutputPath })
  } catch (error) {
    logError(error)
  }
}
