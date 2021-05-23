const createFile = require('../../../utils/folderFiles/createFile')
const logError = require('../../../utils/log/logError')
const path = require('path')
const doesFolderOrFileExist = require('../../../utils/folderFiles/doesFolderOrFileExist')

module.exports = async function createComponent({
  name,
  helpers,
  componentConfig,
  componentOutputPath
}) {
  try {
    await Promise.all(
      componentConfig.files.map(async (file) => {
        const componentProperties = { name, helpers }
        const outputPath = path.join(
          componentOutputPath,
          name,
          file.path(componentProperties)
        )
        const content = file.template(componentProperties)
        const doesExist = await doesFolderOrFileExist(outputPath)

        if (doesExist) logError(`${name} already exists`, { silent: true })

        await createFile(outputPath, content)
      })
    )
  } catch (error) {
    logError(error)
  }
}
