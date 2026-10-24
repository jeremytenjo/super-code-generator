import { asRecord, isRecord, toGlobArray } from './helpers'
import type { FormatterOptions } from '../types'

/**
 * Biome formatter defaults, taken from Biome's configuration reference.
 */
const BIOME_DEFAULTS: FormatterOptions = {
  useTabs: true,
  tabWidth: 2,
  printWidth: 80,
  endOfLine: 'lf',
  bracketSpacing: true,
  singleQuote: false,
  jsxSingleQuote: false,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  semi: true,
  arrowParens: 'always',
  bracketSameLine: false,
  singleAttributePerLine: false,
}

export default function normalizeBiomeConfig(
  config: Record<string, unknown>,
): FormatterOptions | null {
  const formatter = asRecord(config.formatter)
  const jsFormatter = asRecord(asRecord(config.javascript).formatter)

  if (formatter.enabled === false || jsFormatter.enabled === false) return null

  const options = normalizeBiomeOptions(formatter, jsFormatter, true)
  const overrides = normalizeBiomeOverrides(config.overrides)
  if (overrides) options.overrides = overrides

  return options
}

function normalizeBiomeOptions(
  formatter: Record<string, unknown>,
  jsFormatter: Record<string, unknown>,
  applyDefaults: boolean,
): FormatterOptions {
  const options: FormatterOptions = applyDefaults ? { ...BIOME_DEFAULTS } : {}

  const indentStyle = jsFormatter.indentStyle ?? formatter.indentStyle
  if (indentStyle !== undefined) options.useTabs = indentStyle === 'tab'

  const indentWidth = jsFormatter.indentWidth ?? formatter.indentWidth
  if (typeof indentWidth === 'number') options.tabWidth = indentWidth

  const lineWidth = jsFormatter.lineWidth ?? formatter.lineWidth
  if (typeof lineWidth === 'number') options.printWidth = lineWidth

  const lineEnding = formatter.lineEnding
  if (lineEnding === 'lf' || lineEnding === 'crlf' || lineEnding === 'cr') {
    options.endOfLine = lineEnding
  }

  const attributePosition = jsFormatter.attributePosition ?? formatter.attributePosition
  if (attributePosition === 'multiline') options.singleAttributePerLine = true
  if (attributePosition === 'auto') options.singleAttributePerLine = false

  const bracketSpacing = jsFormatter.bracketSpacing ?? formatter.bracketSpacing
  if (typeof bracketSpacing === 'boolean') options.bracketSpacing = bracketSpacing

  if (typeof jsFormatter.bracketSameLine === 'boolean') {
    options.bracketSameLine = jsFormatter.bracketSameLine
  }

  const quoteStyle = jsFormatter.quoteStyle
  if (quoteStyle === 'single') options.singleQuote = true
  if (quoteStyle === 'double') options.singleQuote = false

  const jsxQuoteStyle = jsFormatter.jsxQuoteStyle
  if (jsxQuoteStyle === 'single') options.jsxSingleQuote = true
  if (jsxQuoteStyle === 'double') options.jsxSingleQuote = false

  const quoteProperties = jsFormatter.quoteProperties
  if (quoteProperties === 'asNeeded') options.quoteProps = 'as-needed'
  if (quoteProperties === 'preserve') options.quoteProps = 'preserve'

  const trailingCommas = jsFormatter.trailingCommas
  if (trailingCommas === 'all' || trailingCommas === 'es5' || trailingCommas === 'none') {
    options.trailingComma = trailingCommas
  }

  const semicolons = jsFormatter.semicolons
  if (semicolons === 'always') options.semi = true
  if (semicolons === 'asNeeded') options.semi = false

  const arrowParentheses = jsFormatter.arrowParentheses
  if (arrowParentheses === 'always') options.arrowParens = 'always'
  if (arrowParentheses === 'asNeeded') options.arrowParens = 'avoid'

  return options
}

function normalizeBiomeOverrides(value: unknown) {
  if (!Array.isArray(value)) return undefined

  const overrides: Record<string, unknown>[] = []

  for (const overrideValue of value) {
    if (!isRecord(overrideValue)) continue

    const includes = toGlobArray(overrideValue.includes ?? overrideValue.include)
    const files: string[] = []
    const excludeFiles: string[] = []

    for (const pattern of includes ?? []) {
      if (pattern.charAt(0) === '!') excludeFiles.push(pattern.slice(1))
      else files.push(pattern)
    }

    const ignore = toGlobArray(overrideValue.ignore)
    if (ignore) excludeFiles.push(...ignore)

    const formatter = asRecord(overrideValue.formatter)
    const jsFormatter = asRecord(asRecord(overrideValue.javascript).formatter)

    if (formatter.enabled === false || jsFormatter.enabled === false) continue

    const options = normalizeBiomeOptions(formatter, jsFormatter, false)

    overrides.push({
      files: files.length > 0 ? files : ['**/*'],
      ...(excludeFiles.length > 0 ? { excludeFiles } : {}),
      options,
    })
  }

  return overrides.length > 0 ? overrides : undefined
}

export { BIOME_DEFAULTS }
