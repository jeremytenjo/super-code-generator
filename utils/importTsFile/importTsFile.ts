import { buildSync } from 'esbuild'
import { pathToFileURL } from 'url'
import { writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import logError from '../log/logError'

export default async function importTs(props: { filePath: string }) {
  if (!props.filePath) {
    logError('Missing required "filePath" property')
  }

  // Compile the TypeScript file with esbuild
  const result = buildSync({
    entryPoints: [props.filePath],
    bundle: true, // Bundle dependencies into a single output
    platform: 'node', // Target Node.js
    format: 'esm', // Use ES Module format
    write: false, // Don't write to disk
  })

  // Write the compiled code to a temporary file
  const tmpFilePath = join(tmpdir(), `compiled-${Date.now()}.mjs`)
  writeFileSync(tmpFilePath, result.outputFiles[0].text)

  // Dynamically import the compiled file
  const module = await import(pathToFileURL(tmpFilePath).href)
  return module
}
