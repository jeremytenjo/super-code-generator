import { minimatch } from 'minimatch'
import path from 'path'

import { isRecord, toGlobArray } from './normalize/helpers'
import type { OxfmtOptions } from './types'

/**
 * Oxfmt's programmatic `format()` does not resolve config `overrides` for us,
 * so apply the matching overrides before calling it.
 *
 * Prettier, oxfmt and (converted) Biome overrides all use the same normalized
 * `{ files, excludeFiles, options }` shape after loading.
 */
export default function applyOverrides(
  options: OxfmtOptions,
  filePath: string,
  configDir: string | null,
): OxfmtOptions {
  const { overrides, ...baseOptions } = options

  if (!configDir || !Array.isArray(overrides)) return baseOptions

  const relativePath = path.relative(configDir, filePath).split(path.sep).join('/')
  const absolutePath = filePath.split(path.sep).join('/')

  let result = baseOptions

  for (const overrideValue of overrides) {
    if (!isRecord(overrideValue)) continue

    const files = toGlobArray(overrideValue.files)
    if (!files) continue

    if (!matchesAny(files, relativePath, absolutePath)) continue

    const excludeFiles = toGlobArray(overrideValue.excludeFiles)
    if (excludeFiles && matchesAny(excludeFiles, relativePath, absolutePath)) {
      continue
    }

    if (isRecord(overrideValue.options)) {
      result = { ...result, ...overrideValue.options }
    }
  }

  return result
}

function matchesAny(globs: string[], relativePath: string, absolutePath: string) {
  return globs.some((globValue) => {
    if (typeof globValue !== 'string') return false

    const glob = globValue.split(path.sep).join('/')
    if (glob.startsWith('!')) return false

    if (path.isAbsolute(glob)) return minimatch(absolutePath, glob, { dot: true })

    return minimatch(relativePath, glob.replace(/^\.\//, ''), { dot: true })
  })
}
