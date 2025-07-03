import generateCode from '../../common/generateCode'
import logError from '../../../utils/log/logError'
import getActiveFileFolderPath from '../../../utils/folderFiles/getActiveFileFolderPath'
import type { ExtensionContext } from 'vscode'

export type GenerateCodeCommandProps = {
  path?: string
  context?: ExtensionContext
}

export default async function generateCodeCommand(props: GenerateCodeCommandProps = {}) {
  const { 
    path: componentOutputPath = getActiveFileFolderPath().activeFileFolderPath,
    context 
  } = props

  try {
    await generateCode({ 
      outputPath: componentOutputPath,
      context 
    })
  } catch (error: unknown) {
    logError((error as Error).message)
  }
}
