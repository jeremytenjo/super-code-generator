import { build } from 'esbuild'
import { pathToFileURL } from 'url'
import { writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

export default async function importTs(props: { filePath: string }) {
  // Compile the TypeScript file with esbuild
  const result = await build({
    entryPoints: [props.filePath],
    format: 'esm', // Use ES Module format
    platform: 'node',
    write: false, // Don't write the output to disk
    bundle: true, // Bundle all dependencies
  })

  // Write the compiled code to a temporary file
  const tmpFilePath = join(tmpdir(), `compiled-${Date.now()}.mjs`)
  writeFileSync(tmpFilePath, result.outputFiles[0].text)

  // Dynamically import the compiled file
  const res = await import(pathToFileURL(tmpFilePath).href)
  return res
}
