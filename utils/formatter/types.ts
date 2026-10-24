/**
 * Formatters whose configuration files are supported by the extension.
 *
 * Every supported config is translated into Prettier's option shape, because
 * Prettier, oxfmt and Biome use largely compatible formatter options.
 */
export type FormatterName = 'prettier' | 'oxfmt' | 'biome'

/**
 * `auto` detects a config file based on the generated file's location.
 * `none` skips formatting entirely.
 */
export type FormatterSetting = FormatterName | 'auto' | 'none'

export type FormatterSettings = {
  formatter?: FormatterSetting
  /** Optional explicit config file path. Relative paths use the workspace root. */
  configPath?: string
  /** Deprecated `.oxfmtrc` setting, kept for backwards compatibility. */
  legacyOxfmtConfigPath?: string
}

export type FormatterOptions = Record<string, unknown>

export type ResolvedFormatter = {
  formatter: FormatterName
  /** Absolute path to the config file, or `null` when using formatter defaults. */
  configPath: string | null
  /** Directory the config was loaded from. Used to resolve override globs. */
  configDir: string | null
  options: FormatterOptions
}

export type FormatterConfigFile = {
  formatter: FormatterName
  path: string
  dir: string
}
