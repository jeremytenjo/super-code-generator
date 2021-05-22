const createFile = require('../../../utils/folderFiles/createFile')

const path = require('path')

module.exports = async function createComponent({
  name,
  helpers,
  componentConfig,
  componentOutputPath
}) {
  await Promise.all(
    componentConfig.files.map(async (file) => {
      const componentProperties = { name, helpers }
      const outputPath = path.join(
        componentOutputPath,
        name,
        file.path(componentProperties)
      )
      const content = file.template(componentProperties)
      await createFile(outputPath, content)
    })
  )
}
