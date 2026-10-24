import { build } from 'esbuild'
import fs from 'fs'
import JSON5 from 'json5'
import os from 'os'
import path from 'path'
import { pathToFileURL } from 'url'
import yaml from 'js-yaml'

import parseJsonc from './parseJsonc'

/**
 * Import JS/TS config files without letting TypeScript (or esbuild) rewrite
 * the dynamic import into a CommonJS `require`. This keeps support for ESM
 * configs in VS Code versions that still run the extension host as CJS.
 */
const dynamicImport = new Function('specifier', 'return import(specifier)') as (
  specifier: string,
) => Promise<unknown>

const MODULE_EXTENSIONS = ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts']

export async function loadConfigFile(filePath: string): Promise<unknown> {
  const extension = path.extname(filePath).toLowerCase()
  const fileName = path.basename(filePath)

  if (fileName === 'package.json') {
    const packageJson = JSON.parse(await fs.promises.readFile(filePath, 'utf8')) as {
      prettier?: unknown
    }
    return packageJson.prettier ?? {}
  }

  if (extension === '.json') {
    return parseJsonc(stripBom(await fs.promises.readFile(filePath, 'utf8')))
  }

  if (extension === '.jsonc') {
    return parseJsonc(stripBom(await fs.promises.readFile(filePath, 'utf8')))
  }

  if (extension === '.json5') {
    return JSON5.parse(stripBom(await fs.promises.readFile(filePath, 'utf8')))
  }

  if (extension === '.yaml' || extension === '.yml') {
    return yaml.load(stripBom(await fs.promises.readFile(filePath, 'utf8'))) ?? {}
  }

  if (MODULE_EXTENSIONS.indexOf(extension) !== -1) {
    return loadModuleConfig(filePath)
  }

  if (extension === '') {
    return loadExtensionlessConfig(filePath)
  }

  throw new Error(
    `Unsupported formatter config file "${fileName}". Supported formats: JSON, JSONC, JSON5, YAML, JS and TS.`,
  )
}

function stripBom(text: string) {
  return text.replace(/^\uFEFF/, '')
}

async function loadExtensionlessConfig(filePath: string) {
  const text = stripBom(await fs.promises.readFile(filePath, 'utf8'))

  try {
    return JSON.parse(text)
  } catch {
    try {
      return parseJsonc(text)
    } catch {
      return yaml.load(text) ?? {}
    }
  }
}

async function loadModuleConfig(filePath: string) {
  const extension = path.extname(filePath).toLowerCase()
  const isTypeScript = extension === '.ts' || extension === '.cts' || extension === '.mts'

  if (!isTypeScript) return importModuleConfig(filePath)

  return importCompiledTypeScriptConfig(filePath)
}

async function importModuleConfig(filePath: string) {
  const specifier = `${pathToFileURL(filePath).href}?t=${Date.now()}`
  return unwrapConfig(await dynamicImport(specifier))
}

async function importCompiledTypeScriptConfig(filePath: string) {
  const configDir = path.dirname(filePath)
  let outputDirectory = configDir

  try {
    fs.accessSync(configDir, fs.constants.W_OK)
  } catch {
    outputDirectory = os.tmpdir()
  }

  const result = await build({
    entryPoints: [filePath],
    absWorkingDir: configDir,
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node18',
    packages: 'external',
    write: false,
    logLevel: 'silent',
  })

  const outputFile = path.join(
    outputDirectory,
    `.super-code-generator-config-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.mjs`,
  )

  fs.writeFileSync(outputFile, result.outputFiles[0].text)

  try {
    return unwrapConfig(await importModuleConfig(outputFile))
  } finally {
    try {
      fs.unlinkSync(outputFile)
    } catch {
      // Best effort cleanup. The file lives in the workspace/temp directory.
    }
  }
}

async function unwrapConfig(moduleValue: unknown): Promise<unknown> {
  let value = moduleValue

  if (
    value &&
    typeof value === 'object' &&
    'default' in (value as Record<string, unknown>)
  ) {
    value = (value as Record<string, unknown>).default
  }

  if (typeof value === 'function') {
    value = await (value as () => unknown)()
  }

  return value ?? {}
}
