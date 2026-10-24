import fs from 'fs'
import path from 'path'

import applyOverrides from './applyOverrides'
import { asRecord } from './normalize/helpers'
import loadBiomeConfig from './loadBiomeConfig'
import { loadConfigFile } from './loadConfigFile'
import normalizeBiomeConfig, { BIOME_DEFAULTS } from './normalize/normalizeBiome'
import normalizeOxfmtConfig from './normalize/normalizeOxfmt'
import normalizePrettierConfig, { PRETTIER_DEFAULTS } from './normalize/normalizePrettier'
import {
  findFormatterConfig,
  inferFormatterFromConfigPath,
  isFormatterName,
} from './findConfig'
import type {
  FormatterName,
  FormatterSettings,
  FormatterSetting,
  OxfmtOptions,
  ResolvedFormatter,
} from './types'

export type { FormatterSettings, FormatterSetting, FormatterName }

type ResolveFormatterProps = {
  /** Directory of the generated file. */
  startDir: string
  workspaceRoot: string
  settings?: FormatterSettings
}

type OxfmtModule = {
  format: (
    fileName: string,
    source: string,
    options?: Record<string, unknown>,
  ) => Promise<{ code: string; errors?: unknown[] }>
}

const dynamicImport = new Function('specifier', 'return import(specifier)') as (
  specifier: string,
) => Promise<unknown>

let oxfmtModulePromise: Promise<OxfmtModule> | null = null
const resolvedConfigCache: Map<string, Promise<ResolvedFormatter | null>> = new Map()

function loadOxfmt(): Promise<OxfmtModule> {
  oxfmtModulePromise ??= dynamicImport('oxfmt').then(
    (moduleValue) => moduleValue as OxfmtModule,
  )
  return oxfmtModulePromise
}

function isFile(filePath: string) {
  try {
    return fs.statSync(filePath).isFile()
  } catch {
    return false
  }
}

function getFileModifiedTime(filePath: string) {
  try {
    return fs.statSync(filePath).mtimeMs
  } catch {
    return ''
  }
}

function resolveSetting(value: FormatterSetting | undefined): FormatterSetting {
  if (!value) return 'auto'
  if (value === 'auto' || value === 'none') return value
  return isFormatterName(value) ? value : 'auto'
}

function resolveConfigPath(configPath: string, workspaceRoot: string) {
  return path.isAbsolute(configPath)
    ? configPath
    : path.resolve(workspaceRoot, configPath)
}

function defaultOptionsFor(formatter: FormatterName): OxfmtOptions {
  if (formatter === 'prettier') return { ...PRETTIER_DEFAULTS }
  if (formatter === 'biome') return { ...BIOME_DEFAULTS }
  return {}
}

async function loadResolvedFormatter(
  formatter: FormatterName,
  configPath: string | null,
): Promise<ResolvedFormatter | null> {
  if (!configPath) {
    return {
      formatter,
      configPath: null,
      configDir: null,
      options: defaultOptionsFor(formatter),
    }
  }

  try {
    if (formatter === 'biome') {
      const config = await loadBiomeConfig(configPath)
      const options = normalizeBiomeConfig(config)
      if (!options) return null

      return {
        formatter,
        configPath,
        configDir: path.dirname(configPath),
        options,
      }
    }

    const rawConfig = asRecord(await loadConfigFile(configPath))
    const options =
      formatter === 'prettier'
        ? normalizePrettierConfig(rawConfig)
        : normalizeOxfmtConfig(rawConfig)

    return {
      formatter,
      configPath,
      configDir: path.dirname(configPath),
      options,
    }
  } catch (error) {
    console.warn(
      `Super Code Generator: failed to load ${formatter} config at ${configPath}. Using formatter defaults.`,
      error,
    )
    return {
      formatter,
      configPath: null,
      configDir: null,
      options: defaultOptionsFor(formatter),
    }
  }
}

/**
 * Resolve the formatter and its translated oxfmt options for a generated file.
 * `null` means formatting should be skipped (disabled in config or by setting).
 */
export default async function resolveFormatter(
  props: ResolveFormatterProps,
): Promise<ResolvedFormatter | null> {
  const setting = resolveSetting(props.settings?.formatter)
  if (setting === 'none') return null

  const explicitConfigPath = props.settings?.configPath?.trim()
  const legacyOxfmtConfigPath = props.settings?.legacyOxfmtConfigPath?.trim()

  let formatter: FormatterName | undefined = isFormatterName(setting)
    ? setting
    : undefined
  let configPath: string | null = null

  if (explicitConfigPath) {
    configPath = resolveConfigPath(explicitConfigPath, props.workspaceRoot)
    if (!isFile(configPath)) {
      console.warn(
        `Super Code Generator: formatter config not found at ${configPath}. Falling back to auto-detection.`,
      )
      configPath = null
    } else {
      formatter = formatter ?? inferFormatterFromConfigPath(configPath)
    }
  }

  // The old setting defaulted to `.oxfmtrc.json`. Let auto-detection handle
  // that name so a nearer Prettier/Biome config can still win.
  if (!configPath && legacyOxfmtConfigPath && legacyOxfmtConfigPath !== '.oxfmtrc.json') {
    const legacyPath = resolveConfigPath(legacyOxfmtConfigPath, props.workspaceRoot)
    if (isFile(legacyPath) && (formatter === undefined || formatter === 'oxfmt')) {
      formatter = 'oxfmt'
      configPath = legacyPath
    }
  }

  if (!configPath) {
    const detected = findFormatterConfig(props.startDir, formatter)
    if (detected) {
      formatter = detected.formatter
      configPath = detected.path
    }
  }

  if (!formatter) formatter = 'oxfmt'

  const cacheKey = [
    props.startDir,
    props.workspaceRoot,
    setting,
    formatter,
    configPath ?? '',
    configPath ? getFileModifiedTime(configPath) : '',
  ].join('|')

  const cached = resolvedConfigCache.get(cacheKey)
  if (cached) return cached

  const resolved = loadResolvedFormatter(formatter, configPath)
  resolvedConfigCache.set(cacheKey, resolved)
  return resolved
}

export function clearFormatterConfigCache() {
  resolvedConfigCache.clear()
}

type FormatFileContentProps = {
  content: string
  filePath: string
  workspaceRoot: string
  settings?: FormatterSettings
}

/**
 * Format generated file content using the project's Prettier, oxfmt or Biome
 * config. Returns the original content when formatting is not possible.
 */
export async function formatFileContent(props: FormatFileContentProps): Promise<string> {
  if (!props.content) return props.content

  const formatter = await resolveFormatter({
    startDir: path.dirname(props.filePath),
    workspaceRoot: props.workspaceRoot,
    settings: props.settings,
  })

  if (!formatter) return props.content

  const baseDir = formatter.configDir ?? props.workspaceRoot
  const fileName = path.relative(baseDir, props.filePath).split(path.sep).join('/')

  try {
    const oxfmt = await loadOxfmt()
    const options = applyOverrides(formatter.options, props.filePath, formatter.configDir)
    const result = await oxfmt.format(fileName, props.content, options)

    if (result.errors && result.errors.length > 0) {
      console.warn(
        `Super Code Generator: ${formatter.formatter} could not format ${props.filePath}. Keeping the generated content.`,
        result.errors,
      )
      return props.content
    }

    return typeof result.code === 'string' ? result.code : props.content
  } catch (error) {
    console.warn(
      `Super Code Generator: failed to format ${props.filePath}. Keeping the generated content.`,
      error,
    )
    return props.content
  }
}
