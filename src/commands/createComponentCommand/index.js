const createComponent = require('../../common/createComponent')
const logError = require('../../../utils/log/logError')
const getActiveFileFolderPath = require('../../../utils/folderFiles/getActiveFileFolderPath')

module.exports = async function createComponentCommand(
  { path: componentOutputPath } = { path: getActiveFileFolderPath() },
) {
  try {
    await createComponent({ outputPath: componentOutputPath })
  } catch (error) {
    logError(error)
  }
}
