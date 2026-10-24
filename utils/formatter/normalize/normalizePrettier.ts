import { asRecord, assignDefined, isRecord, toGlobArray } from './helpers'
import type { OxfmtOptions } from '../types'

/**
 * Prettier's formatter defaults. Oxfmt uses the same option names for almost
 * everything, but a few defaults differ (most notably `printWidth`).
 */
const PRETTIER_DEFAULTS: OxfmtOptions = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  singleAttributePerLine: false,
  objectWrap: 'preserve',
  proseWrap: 'preserve',
  embeddedLanguageFormatting: 'auto',
  htmlWhitespaceSensitivity: 'css',
}

/**
 * Options supported by oxfmt that also exist in Prettier. Unknown Prettier
 * options (plugins, pragma options, ...) are intentionally ignored.
 */
const PRETTIER_OPTIONS = [
  'arrowParens',
  'bracketSameLine',
  'bracketSpacing',
  'embeddedLanguageFormatting',
  'endOfLine',
  'experimentalOperatorPosition',
  'htmlWhitespaceSensitivity',
  'insertFinalNewline',
  'jsxSingleQuote',
  'objectWrap',
  'printWidth',
  'proseWrap',
  'quoteProps',
  'semi',
  'singleAttributePerLine',
  'singleQuote',
  'tabWidth',
  'trailingComma',
  'useTabs',
  'vueIndentScriptAndStyle',
]

export default function normalizePrettierConfig(
  config: Record<string, unknown>,
): OxfmtOptions {
  const options = normalizePrettierOptions(config, true)

  const overrides = normalizePrettierOverrides(config.overrides)
  if (overrides) options.overrides = overrides

  return options
}

function normalizePrettierOptions(
  config: Record<string, unknown>,
  applyDefaults: boolean,
): OxfmtOptions {
  const options: OxfmtOptions = applyDefaults ? { ...PRETTIER_DEFAULTS } : {}

  for (const key of PRETTIER_OPTIONS) {
    const value = config[key]
    if (value === undefined) continue

    // oxfmt does not support Prettier's `endOfLine: "auto"`.
    if (key === 'endOfLine' && value === 'auto') continue

    options[key] = value
  }

  return options
}

function normalizePrettierOverrides(value: unknown) {
  if (!Array.isArray(value)) return undefined

  const overrides: Record<string, unknown>[] = []

  for (const overrideValue of value) {
    if (!isRecord(overrideValue)) continue

    const files = toGlobArray(overrideValue.files)
    if (!files) continue

    const override: Record<string, unknown> = { files }

    const excludeFiles = toGlobArray(overrideValue.excludeFiles)
    if (excludeFiles) override.excludeFiles = excludeFiles

    const options = asRecord(overrideValue.options)
    override.options = normalizePrettierOptions(options, false)

    overrides.push(override)
  }

  return overrides.length > 0 ? overrides : undefined
}

export { PRETTIER_DEFAULTS, PRETTIER_OPTIONS }
