import getWorkspacePath from '../../../../utils/workspace/getWorkspacePath'

interface importPrettierConfigProps {
  prettierConfigPath: string
}

export default async function importPrettierConfig({ prettierConfigPath }: importPrettierConfigProps) {
  const workspacePath = getWorkspacePath(prettierConfigPath)
  let prettierConfig = false

  if (workspacePath.hasExtension('.js')) {
    prettierConfig = await import(workspacePath.getFileUri()).then((p) => p.default)
  } else {
    console.warn('Quick Component Create: Prettier config should be a JS file')
  }

  console.log("prettier config loaded:", prettierConfig);

  return prettierConfig
}
