const path = require('path')
const createFile = require('../../../../utils/folderFiles/createFile')
const doesFolderOrFileExist = require('../../../../utils/folderFiles/doesFolderOrFileExist')
const prettifyFile = require('../../../../utils/folderFiles/prettifyFile')
const openFile = require('../../../../utils/folderFiles/openFile')
const logError = require('../../../../utils/log/logError')

module.exports = async function create({
  name,
  helpers,
  componentConfig,
  componentOutputPath,
  prettierConfig = {}
}) {
  try {
    await Promise.all(
      componentConfig.files.map(async (file, index) => {
        const openOnCreate = index === 0
        const componentProperties = {
          name,
          helpers,
          folderPath: componentOutputPath
        }
        const outputPath = path.join(
          componentOutputPath,
          name,
          file.path(componentProperties)
        )
        const content = prettifyFile({
          content: file.template(componentProperties),
          prettierConfig
        })
        const doesExist = await doesFolderOrFileExist(outputPath)

        if (doesExist) logError(`${name} already exists`, { silent: true })

        await createFile(outputPath, content)
        if (openOnCreate) openFile(outputPath)
      })
    )
  } catch (error) {
    logError(error)
  }
}
