const getWorkspacePath = require('../../../../utils/workspace/getWorkspacePath')

module.exports = async function importPrettierConfig({ prettierConfigPath }) {
  const workspacePath = await getWorkspacePath(prettierConfigPath)
  let prettierConfig = false
  const isJsFile = workspacePath.includes('.js')

  if (isJsFile) {
    prettierConfig = require(workspacePath)
  } else {
    console.warn('Quick Component Create: Prettier config should be a JS file')
  }

  return prettierConfig
}
