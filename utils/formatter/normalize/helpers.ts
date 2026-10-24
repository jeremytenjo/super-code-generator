export function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

export function asRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {}
}

export function toGlobArray(value: unknown): string[] | undefined {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) {
    const globs = value.filter((item): item is string => typeof item === 'string')
    return globs.length > 0 ? globs : undefined
  }
  return undefined
}

export function assignDefined(
  target: Record<string, unknown>,
  key: string,
  value: unknown,
) {
  if (value !== undefined) target[key] = value
}
