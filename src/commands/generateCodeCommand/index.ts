import generateCode from '../../common/generateCode'
import logError from '../../../utils/log/logError'
import getActiveFileFolderPath from '../../../utils/folderFiles/getActiveFileFolderPath'

export default async function generateCodeCommand(
  { path: componentOutputPath } = {
    path: getActiveFileFolderPath().activeFileFolderPath,
  },
) {
  try {
    await generateCode({ outputPath: componentOutputPath })
  } catch (error: unknown) {
    logError((error as Error).message)
  }
}
