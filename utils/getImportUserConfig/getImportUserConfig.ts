import vscode from 'vscode'
import validateUserConfigFile from '../../src/common/generateCode/handlers/validateUserConfigFile'
import importFileInWorkspace from '../folderFiles/importFileInWorkspace'
import { SuperCodeGeneratorConfigSchema, SuperCodeGeneratorUserConfigSchema } from '../../src'
import logError from '../log/logError'

export default async function getImportUserConfig() {
  const userConfig: SuperCodeGeneratorUserConfigSchema =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vscode.workspace.getConfiguration('superCodeGenerator') as any
  
  const configFile = (await importFileInWorkspace(userConfig.schemaFilePath).then(
    (res) => res.default,
  )) as SuperCodeGeneratorConfigSchema

  validateUserConfigFile(configFile)

  if (!userConfig.prettierConfigFilePath.includes('js')) {
    logError('Prettier config file must be a .js file')
  }

  if (userConfig) return { userConfig, configFile }
}
