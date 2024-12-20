import getWorkspacePath from '../../../../utils/workspace/getWorkspacePath'

export default async function importPrettierConfig({ prettierConfigPath }) {
  const workspacePath = await getWorkspacePath(prettierConfigPath)
  let prettierConfig = false
  const isJsFile = workspacePath.includes('.js')

  if (isJsFile) {
    prettierConfig = await import(workspacePath).then((p) => p.default)
  } else {
    console.warn('Quick Component Create: Prettier config should be a JS file')
  }

  return prettierConfig
}
