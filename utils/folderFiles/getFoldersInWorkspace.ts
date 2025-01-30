import { glob } from 'glob'
import getWorkspacePath from '../workspace/getWorkspacePath'

export default async function getFoldersInWorkspace() {
  // get the path of the workspace
  const workspacePath = getWorkspacePath().path

  // get all the folders in the workspace, excluding node_modules
  const foldersInWorkspace = glob.sync(workspacePath + '/**/', {
    ignore: ['**/node_modules/**', './node_modules/**'],
  })

  // return the folders in the workspace
  return foldersInWorkspace
}
