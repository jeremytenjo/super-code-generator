import { glob } from 'glob'
import getWorkspacePath from '../workspace/getWorkspacePath'

export default async function getFoldersInWorkspace() {
  const workspacePath = await getWorkspacePath()
  const foldersInWorkspace = await glob.sync(workspacePath + '/**/', {
    ignore: ['**/node_modules/**', './node_modules/**'],
  })

  return foldersInWorkspace
}
