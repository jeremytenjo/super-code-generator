import { buildSync } from 'esbuild'
import { pathToFileURL } from 'url'
import { writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

export default async function importTs(props: { filePath: string }) {
  // Compile the TypeScript file with esbuild

  const result = buildSync({
    entryPoints: [props.filePath],
    bundle: true, // Bundle dependencies into a single output
    platform: 'node', // Target Node.js
    format: 'esm', // Use ES Module format
    write: false, // Don't write to disk
  })

  console.log('HERE!')

  // Write the compiled code to a temporary file
  const tmpFilePath = join(tmpdir(), `compiled-${Date.now()}.mjs`)
  writeFileSync(tmpFilePath, result.outputFiles[0].text)

  console.log('tmpFilePath', tmpFilePath)

  // Dynamically import the compiled file
  const res = await import(pathToFileURL(tmpFilePath).href)

  console.log('res', res)

  return res
}
