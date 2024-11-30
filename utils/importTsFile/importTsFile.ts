import * as tsImport from 'ts-import'

import logError from '../log/logError'

export default async function importTs(props: { filePath: string }) {
  if (!props.filePath) {
    logError('Missing required "filePath" property')
  }

  console.log('importTs')

  const asyncResult = await tsImport.load(props.filePath)

  console.log({
    asyncResult,
  })

  process.exit(0)
}
