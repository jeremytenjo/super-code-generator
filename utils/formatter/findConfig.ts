import fs from 'fs'
import path from 'path'

import type { FormatterConfigFile, FormatterName } from './types'

/**
 * Config files are checked in the order formatters appear in
 * `FORMATTER_AUTO_DETECTION_ORDER`, then in the order listed here.
 */
export const FORMATTER_CONFIG_FILES: Record<FormatterName, string[]> = {
  biome: ['biome.json', 'biome.jsonc'],
  oxfmt: [
    '.oxfmtrc.json',
    '.oxfmtrc.jsonc',
    'oxfmt.config.js',
    'oxfmt.config.cjs',
    'oxfmt.config.mjs',
    'oxfmt.config.ts',
    'oxfmt.config.mts',
    'oxfmt.config.cts',
  ],
  prettier: [
    '.prettierrc',
    '.prettierrc.json',
    '.prettierrc.json5',
    '.prettierrc.yaml',
    '.prettierrc.yml',
    '.prettierrc.js',
    '.prettierrc.cjs',
    '.prettierrc.mjs',
    '.prettierrc.ts',
    '.prettierrc.mts',
    '.prettierrc.cts',
    'prettier.config.js',
    'prettier.config.cjs',
    'prettier.config.mjs',
    'prettier.config.ts',
    'prettier.config.mts',
    'prettier.config.cts',
  ],
}

/**
 * When more than one formatter config exists in the same directory, prefer
 * the newer all-in-one formatters. Users can always pin a formatter with the
 * `superCodeGenerator.formatter` setting.
 */
export const FORMATTER_AUTO_DETECTION_ORDER: FormatterName[] = [
  'biome',
  'oxfmt',
  'prettier',
]

export function isFormatterName(value: unknown): value is FormatterName {
  return value === 'prettier' || value === 'oxfmt' || value === 'biome'
}

function isFile(filePath: string) {
  try {
    return fs.statSync(filePath).isFile()
  } catch {
    return false
  }
}

function packageJsonHasPrettierConfig(dir: string) {
  const packageJsonPath = path.join(dir, 'package.json')
  if (!isFile(packageJsonPath)) return false

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as {
      prettier?: unknown
    }
    return packageJson.prettier !== undefined
  } catch {
    return false
  }
}

/**
 * Find a formatter config by walking up from `startDir`.
 *
 * The closest config wins. When several configs live in the same directory,
 * `FORMATTER_AUTO_DETECTION_ORDER` decides which one is used.
 */
export function findFormatterConfig(
  startDir: string,
  formatter?: FormatterName,
): FormatterConfigFile | null {
  let dir = path.resolve(startDir)
  const formatters = formatter ? [formatter] : FORMATTER_AUTO_DETECTION_ORDER

  // Guard against pathological symlink loops / very deep folder trees.
  for (let depth = 0; depth < 30; depth++) {
    for (const currentFormatter of formatters) {
      for (const fileName of FORMATTER_CONFIG_FILES[currentFormatter]) {
        const candidate = path.join(dir, fileName)
        if (isFile(candidate)) {
          return { formatter: currentFormatter, path: candidate, dir }
        }
      }

      if (currentFormatter === 'prettier' && packageJsonHasPrettierConfig(dir)) {
        return {
          formatter: 'prettier',
          path: path.join(dir, 'package.json'),
          dir,
        }
      }
    }

    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }

  return null
}

const PRETTIER_CONFIG_PATTERN = /(^|\/)(\.prettierrc|prettier\.config\.)/

/**
 * Infer which formatter an explicitly configured file belongs to.
 */
export function inferFormatterFromConfigPath(configPath: string): FormatterName {
  const normalized = configPath.split(path.sep).join('/')
  const fileName = path.basename(normalized)
  const lowerCaseFileName = fileName.toLowerCase()

  if (fileName === 'biome.json' || fileName === 'biome.jsonc') return 'biome'
  if (lowerCaseFileName.indexOf('biome') !== -1) return 'biome'

  if (fileName === '.oxfmtrc.json' || fileName === '.oxfmtrc.jsonc') return 'oxfmt'
  if (lowerCaseFileName.indexOf('oxfmt') !== -1) return 'oxfmt'

  if (lowerCaseFileName.indexOf('prettier') !== -1) return 'prettier'
  if (PRETTIER_CONFIG_PATTERN.test(normalized) || fileName === 'package.json') {
    return 'prettier'
  }

  // `.oxfmtrc.ts`/`.oxfmtrc.js` style configs and anything else are treated as
  // oxfmt configs; it is the extension's native formatter.
  return 'oxfmt'
}
