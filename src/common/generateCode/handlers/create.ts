import vscode from 'vscode'
import path from 'path'

import createFile from '../../../../utils/folderFiles/createFile'
import doesFolderOrFileExist from '../../../../utils/folderFiles/doesFolderOrFileExist'
import prettifyFile from '../../../../utils/folderFiles/prettifyFile'
import openFile from '../../../../utils/folderFiles/openFile'
import logError from '../../../../utils/log/logError'
import getWorkspacePath from '../../../../utils/workspace/getWorkspacePath'
import { SuperCodeGeneratorHelpersProps } from './helpers'
import { SuperCodeGeneratorConfigSchema, SuperCodeGeneratorFileProps } from '../../..'
import { ParamsFilePropsSchema } from '../../../../utils/types/ParamsPropsSchema'

export default async function create(props: {
  name: string
  helpers: SuperCodeGeneratorHelpersProps
  componentConfig: SuperCodeGeneratorConfigSchema[0]
  componentOutputPath: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prettierConfig: any
  params: ParamsFilePropsSchema
}) {
  try {
    if (!props.componentConfig.files) {
      return logError(`Property 'files' missing from type ${props.componentConfig.type}`)
    }

    let createNamedFolder = true
    if (props.componentConfig?.options?.createNamedFolder !== undefined) {
      createNamedFolder = props.componentConfig?.options?.createNamedFolder
    }

    let outputInRootFolder = false
    if (props.componentConfig?.options?.outputInRootFolder !== undefined) {
      outputInRootFolder = props.componentConfig?.options?.outputInRootFolder
    }

    await Promise.all(
      props.componentConfig.files.map(async (file, index) => {
        const openOnCreate = index === 0
        const fileProperties: SuperCodeGeneratorFileProps = {
          name: props.name,
          helpers: props.helpers,
          folderPath: props.componentOutputPath,
          type: props.componentConfig.type,
          params: props.params,
          workspacePath: vscode.workspace.workspaceFolders[0].uri.path,
        }
        let parentFolderName =
          file?.parentFolderName?.(fileProperties) || props.name || ''

        // Format parentFolderName (optional)
        if (props.componentConfig?.options?.formatParentFolderName) {
          if (
            typeof props.componentConfig?.options?.formatParentFolderName !== 'function'
          ) {
            return logError(
              `formatParentFolderName must be a function. Received ${typeof props
                .componentConfig?.options?.formatParentFolderName}`,
            )
          }

          parentFolderName = props.componentConfig?.options?.formatParentFolderName({
            currentName: props.name,
            helpers: props.helpers,
            outputPath: props.componentOutputPath,
          })?.newName
        }

        let outputPath: string = path.join(
          !outputInRootFolder ? props.componentOutputPath : getWorkspacePath({}).path,
          createNamedFolder ? parentFolderName : '',
          await file.path(fileProperties),
        )

        fileProperties.outputPath = outputPath

        if (file.outputInRootFolder) {
          outputPath = path.join(
            getWorkspacePath({}).path,
            await file.path(fileProperties),
          )
        }

        // remove \n from content
        let content = await file.template(fileProperties)

        const isJsOrTsFile =
          outputPath.endsWith('.js') ||
          outputPath.endsWith('.ts') ||
          outputPath.endsWith('.jsx') ||
          outputPath.endsWith('.tsx')

        // Format JS/TS files
        if (isJsOrTsFile) {
          const prettifiedContent = await prettifyFile({
            content: await file.template(fileProperties),
            prettierConfig: props.prettierConfig,
          })
          content = prettifiedContent
        }

        if (doesFolderOrFileExist(outputPath))
          logError(`${props.name} already exists`, { silent: true })

        await createFile(outputPath, content)
        if (openOnCreate) openFile(outputPath)
      }),
    )
  } catch (error: unknown) {
    logError((error as Error).message)
  }
}
