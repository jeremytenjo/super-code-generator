import doesFileExist from './doesFolderOrFileExist'
import assert from '../log/assert'
import importTs from '../importTsFile/importTsFile'
import getWorkspacePath from '../workspace/getWorkspacePath'

export type importFileInWorkspaceProps = {
  uri: string
}

export default async function importFileInWorkspace({ uri }: importFileInWorkspaceProps) {
  // get the path of the file
  const uriPath = getWorkspacePath({
    add: uri,
  })
  // check if the file exists
  const uriPathExists = doesFileExist(uriPath.path)

  // assert that the file exists
  assert(uriPathExists, `Schema not found at ${uriPath}`)

  // return the file imported/required
  return uriPath.hasExtension('.ts')
    ? await importTs({ filePath: uriPath.path })
    : require(uriPath.path)
}

export type ImportFileInWorkspaceReturn = ReturnType<typeof importFileInWorkspace>
