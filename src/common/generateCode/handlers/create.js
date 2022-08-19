const path = require('path')
const createFile = require('../../../../utils/folderFiles/createFile')
const doesFolderOrFileExist = require('../../../../utils/folderFiles/doesFolderOrFileExist')
const prettifyFile = require('../../../../utils/folderFiles/prettifyFile')
const openFile = require('../../../../utils/folderFiles/openFile')
const logError = require('../../../../utils/log/logError')
const getWorkspacePath = require('../../../../utils/workspace/getWorkspacePath')

module.exports = async function create({
  name,
  helpers,
  componentConfig,
  componentOutputPath,
  prettierConfig = {},
}) {
  try {
    if (!componentConfig.files) {
      return logError(`Property 'files' missing from type ${componentConfig.type}`)
    }

    let createNamedFolder = true
    if (componentConfig?.options?.createNamedFolder !== undefined) {
      createNamedFolder = componentConfig?.options?.createNamedFolder
    }

    let outputInRootFolder = false
    if (componentConfig?.options?.outputInRootFolder !== undefined) {
      outputInRootFolder = componentConfig?.options?.outputInRootFolder
    }

    await Promise.all(
      componentConfig.files.map(async (file, index) => {
        const openOnCreate = index === 0
        const fileProperties = {
          name,
          helpers,
          folderPath: componentOutputPath,
        }
        const parentFolderName = file?.parentFolderName?.(fileProperties) || name || ''
        const outputPath = path.join(
          !outputInRootFolder ? componentOutputPath : await getWorkspacePath(),
          createNamedFolder ? parentFolderName : '',
          file.path(fileProperties),
        )
        const content = prettifyFile({
          content: file.template(fileProperties),
          prettierConfig,
        })
        const doesExist = await doesFolderOrFileExist(outputPath)

        if (doesExist) logError(`${name} already exists`, { silent: true })

        await createFile(outputPath, content)
        if (openOnCreate) openFile(outputPath)
      }),
    )
  } catch (error) {
    logError(error)
  }
}
