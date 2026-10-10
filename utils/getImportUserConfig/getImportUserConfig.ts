import vscode from 'vscode'
import validateUserConfigFile from '../../src/common/generateCode/handlers/validateUserConfigFile'
import importFileInWorkspace from '../folderFiles/importFileInWorkspace'
import type {
  SuperCodeGeneratorConfigSchema,
  SuperCodeGeneratorUserConfigSchema,
} from '../../src'
import logError from '../log/logError'

export default async function getImportUserConfig() {
  const userConfig: SuperCodeGeneratorUserConfigSchema =
    // eslint-disable-next-line typescript/no-explicit-any
    vscode.workspace.getConfiguration('superCodeGenerator') as any

  const configFile = (await importFileInWorkspace({
    uri: userConfig.schemaFilePath,
  }).then((res) => res.default)) as SuperCodeGeneratorConfigSchema

  validateUserConfigFile(configFile)

  if (!userConfig.oxfmtConfigFilePath.includes('json')) {
    logError('oxfmt config file must be a .json file')
  }

  if (userConfig) return { userConfig, configFile }
}
