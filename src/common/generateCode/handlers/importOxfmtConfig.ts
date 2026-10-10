import getWorkspacePath from '../../../../utils/workspace/getWorkspacePath'

export type ImportOxfmtConfigProps = {
  oxfmtConfigPath: string
}

export default async function importOxfmtConfig({
  oxfmtConfigPath,
}: ImportOxfmtConfigProps) {
  const workspacePath = getWorkspacePath({
    add: oxfmtConfigPath,
  })
  let oxfmtConfig = false

  if (workspacePath.hasExtension('.js')) {
    oxfmtConfig = await import(workspacePath.getFileUri()).then((p) => p.default)
  } else {
    console.warn('Quick Component Create: oxfmt config should be a JS file')
  }

  return oxfmtConfig
}
