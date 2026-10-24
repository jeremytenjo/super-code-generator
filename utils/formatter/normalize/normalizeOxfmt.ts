import { isRecord, toGlobArray } from './helpers'
import type { FormatterOptions } from '../types'

/**
 * oxfmt configs already use the target option shape. We only normalize file
 * globs so both string and array forms work, and strip editor-only keys.
 */
export default function normalizeOxfmtConfig(
  config: Record<string, unknown>,
): FormatterOptions {
  const options: FormatterOptions = {}

  for (const [key, value] of Object.entries(config)) {
    if (key === '$schema') continue

    if (key === 'overrides' && Array.isArray(value)) {
      const overrides = normalizeOxfmtOverrides(value)
      if (overrides) options.overrides = overrides
      continue
    }

    options[key] = value
  }

  return options
}

function normalizeOxfmtOverrides(value: unknown[]) {
  const overrides: Record<string, unknown>[] = []

  for (const overrideValue of value) {
    if (!isRecord(overrideValue)) continue

    const files = toGlobArray(overrideValue.files)
    if (!files) continue

    const override: Record<string, unknown> = { files }

    const excludeFiles = toGlobArray(overrideValue.excludeFiles)
    if (excludeFiles) override.excludeFiles = excludeFiles

    if (isRecord(overrideValue.options)) {
      const nested: Record<string, unknown> = {}
      for (const [key, nestedValue] of Object.entries(overrideValue.options)) {
        if (key === '$schema') continue
        nested[key] = nestedValue
      }
      override.options = nested
    }

    overrides.push(override)
  }

  return overrides.length > 0 ? overrides : undefined
}
