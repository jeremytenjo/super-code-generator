import vscode from 'vscode'
import validateUserConfigFile from '../../src/common/generateCode/handlers/validateUserConfigFile'
import importFileInWorkspace from '../folderFiles/importFileInWorkspace'
import type {
  SuperCodeGeneratorConfigSchema,
  SuperCodeGeneratorUserConfigSchema,
} from '../../src'

export default async function getImportUserConfig() {
  const userConfig: SuperCodeGeneratorUserConfigSchema =
    // eslint-disable-next-line typescript/no-explicit-any
    vscode.workspace.getConfiguration('superCodeGenerator') as any

  const configFile = (await importFileInWorkspace({
    uri: userConfig.schemaFilePath,
  }).then((res) => res.default)) as SuperCodeGeneratorConfigSchema

  validateUserConfigFile(configFile)

  if (userConfig) return { userConfig, configFile }
}
