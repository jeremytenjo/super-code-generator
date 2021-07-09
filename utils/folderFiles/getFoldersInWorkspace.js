const { glob } = require('glob')
const getWorkspacePath = require('../workspace/getWorkspacePath')

module.exports = async function getFoldersInWorkspace() {
  const workspacePath = await getWorkspacePath()
  const foldersInWorkspace = await glob.sync(workspacePath + '/**/')

  return foldersInWorkspace
}
