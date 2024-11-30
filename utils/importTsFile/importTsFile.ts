import logError from '../log/logError'

export default async function importTs(props: { filePath: string }) {
  if (!props.filePath) {
    logError('Missing required "filePath" property')
  }

  console.log('importTs')

  process.exit(0)
}
