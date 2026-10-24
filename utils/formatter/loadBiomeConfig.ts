import fs from 'fs'
import path from 'path'

import { asRecord, isRecord } from './normalize/helpers'
import { loadConfigFile } from './loadConfigFile'

/**
 * Load a Biome config and resolve local/package `extends` entries.
 */
export default async function loadBiomeConfig(
  configPath: string,
  visited: Set<string> = new Set(),
): Promise<Record<string, unknown>> {
  const resolvedPath = path.resolve(configPath)
  if (visited.has(resolvedPath)) return {}
  visited.add(resolvedPath)

  const raw = asRecord(await loadConfigFile(resolvedPath))
  const extendsValue = raw.extends

  const config: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (key !== 'extends') config[key] = value
  }

  const extendedConfigs = toExtendsArray(extendsValue)
  let merged: Record<string, unknown> = {}

  for (const extendedConfig of extendedConfigs) {
    const extendedPath = resolveExtendedConfig(extendedConfig, path.dirname(resolvedPath))
    if (!extendedPath) {
      console.warn(
        `Super Code Generator: could not resolve Biome config extends "${extendedConfig}"`,
      )
      continue
    }

    const baseConfig = await loadBiomeConfig(extendedPath, visited)
    merged = mergeConfigs(merged, baseConfig)
  }

  return mergeConfigs(merged, config)
}

function toExtendsArray(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }
  return []
}

function resolveExtendedConfig(specifier: string, configDir: string): string | null {
  if (specifier.startsWith('.') || path.isAbsolute(specifier)) {
    const candidate = path.resolve(configDir, specifier)
    if (isFile(candidate)) return candidate
    if (isFile(`${candidate}.json`)) return `${candidate}.json`
    if (isFile(`${candidate}.jsonc`)) return `${candidate}.jsonc`
    return null
  }

  try {
    return require.resolve(specifier, { paths: [configDir] })
  } catch {
    try {
      return require.resolve(`${specifier}/biome.json`, { paths: [configDir] })
    } catch {
      return null
    }
  }
}

function isFile(filePath: string) {
  try {
    return fs.statSync(filePath).isFile()
  } catch {
    return false
  }
}

function mergeConfigs(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base }

  for (const [key, value] of Object.entries(override)) {
    const baseValue = result[key]

    if (isRecord(baseValue) && isRecord(value)) {
      result[key] = mergeConfigs(baseValue, value)
      continue
    }

    if (Array.isArray(baseValue) && Array.isArray(value)) {
      result[key] = [...baseValue, ...value]
      continue
    }

    result[key] = value
  }

  return result
}
