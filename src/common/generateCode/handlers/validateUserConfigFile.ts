import logError from '../../../../utils/log/logError'

export default function validateUserConfigFile(userConfigFile) {
  if (!userConfigFile) {
    logError(
      `Config file not found. Please add path to extension settings under superCodeGenerator.userConfigFilePath`,
    )
  }
  if (!Array.isArray(userConfigFile)) {
    logError(`Config file must export an array`)
  }
}
