import assert from 'assert'
import fs from 'fs'
import os from 'os'
import path from 'path'

import applyOverrides from '../../../utils/formatter/applyOverrides'
import { formatFileContent } from '../../../utils/formatter'
import {
  findFormatterConfig,
  inferFormatterFromConfigPath,
} from '../../../utils/formatter/findConfig'
import normalizeBiomeConfig from '../../../utils/formatter/normalize/normalizeBiome'
import normalizeOxfmtConfig from '../../../utils/formatter/normalize/normalizeOxfmt'
import normalizePrettierConfig from '../../../utils/formatter/normalize/normalizePrettier'
import parseJsonc from '../../../utils/formatter/parseJsonc'

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'scg-formatter-'))
}

function removeDir(dir: string) {
  for (const entry of fs.readdirSync(dir)) {
    const entryPath = path.join(dir, entry)
    if (fs.statSync(entryPath).isDirectory()) removeDir(entryPath)
    else fs.unlinkSync(entryPath)
  }
  fs.rmdirSync(dir)
}

suite('Formatter config support', () => {
  test('parseJsonc supports comments, trailing commas and comment-like strings', () => {
    const config = parseJsonc<{ url: string; nested: { enabled: boolean } }>(`
      {
        // line comment
        "url": "https://example.com//not-a-comment",
        /* block comment */
        "nested": { "enabled": true, },
      }
    `)

    assert.strictEqual(config.url, 'https://example.com//not-a-comment')
    assert.strictEqual(config.nested.enabled, true)
  })

  test('finds the nearest formatter config', () => {
    const root = createTempDir()
    const child = path.join(root, 'packages', 'app')
    fs.mkdirSync(child, { recursive: true })
    fs.writeFileSync(path.join(root, '.prettierrc'), JSON.stringify({ semi: false }))
    fs.writeFileSync(path.join(child, 'biome.json'), JSON.stringify({}))

    try {
      const detected = findFormatterConfig(child)
      assert.strictEqual(detected?.formatter, 'biome')

      const prettier = findFormatterConfig(child, 'prettier')
      assert.strictEqual(prettier?.formatter, 'prettier')
      assert.strictEqual(prettier?.path, path.join(root, '.prettierrc'))
    } finally {
      removeDir(root)
    }
  })

  test('prefers Biome over oxfmt and Prettier in the same directory', () => {
    const dir = createTempDir()
    fs.writeFileSync(path.join(dir, '.prettierrc'), '{}')
    fs.writeFileSync(path.join(dir, '.oxfmtrc.json'), '{}')
    fs.writeFileSync(path.join(dir, 'biome.json'), '{}')

    try {
      assert.strictEqual(findFormatterConfig(dir)?.formatter, 'biome')
    } finally {
      removeDir(dir)
    }
  })

  test('detects Prettier config from package.json', () => {
    const dir = createTempDir()
    fs.writeFileSync(
      path.join(dir, 'package.json'),
      JSON.stringify({ prettier: { singleQuote: true } }),
    )

    try {
      const detected = findFormatterConfig(dir)
      assert.strictEqual(detected?.formatter, 'prettier')
      assert.strictEqual(detected?.path, path.join(dir, 'package.json'))
    } finally {
      removeDir(dir)
    }
  })

  test('infers formatters from explicit config paths', () => {
    assert.strictEqual(inferFormatterFromConfigPath('/app/biome.jsonc'), 'biome')
    assert.strictEqual(inferFormatterFromConfigPath('/app/.oxfmtrc.json'), 'oxfmt')
    assert.strictEqual(inferFormatterFromConfigPath('/app/oxfmt.config.ts'), 'oxfmt')
    assert.strictEqual(inferFormatterFromConfigPath('/app/.prettierrc.js'), 'prettier')
    assert.strictEqual(
      inferFormatterFromConfigPath('/app/prettier.config.mjs'),
      'prettier',
    )
  })

  test('normalizes Prettier options and overrides', () => {
    const options = normalizePrettierConfig({
      semi: false,
      singleQuote: true,
      printWidth: 120,
      endOfLine: 'auto',
      plugins: ['prettier-plugin-unknown'],
      overrides: [
        {
          files: '*.tsx',
          options: { singleQuote: false, semi: true },
        },
      ],
    })

    assert.strictEqual(options.semi, false)
    assert.strictEqual(options.singleQuote, true)
    assert.strictEqual(options.printWidth, 120)
    assert.strictEqual(options.tabWidth, 2)
    assert.strictEqual(options.trailingComma, 'all')
    assert.strictEqual(options.endOfLine, 'lf')
    assert.strictEqual(options.plugins, undefined)

    const overrides = options.overrides as Record<string, unknown>[]
    assert.deepStrictEqual(overrides[0].files, ['*.tsx'])
    assert.strictEqual(
      (overrides[0].options as Record<string, unknown>).singleQuote,
      false,
    )
  })

  test('normalizes Biome options and overrides', () => {
    const options = normalizeBiomeConfig({
      formatter: {
        indentStyle: 'space',
        indentWidth: 4,
        lineWidth: 100,
        lineEnding: 'crlf',
        attributePosition: 'multiline',
      },
      javascript: {
        formatter: {
          quoteStyle: 'single',
          jsxQuoteStyle: 'single',
          quoteProperties: 'asNeeded',
          semicolons: 'asNeeded',
          trailingCommas: 'es5',
          arrowParentheses: 'asNeeded',
        },
      },
      overrides: [
        {
          includes: ['**/*.tsx', '!**/*.test.tsx'],
          javascript: { formatter: { quoteStyle: 'double' } },
        },
      ],
    })

    assert.ok(options)
    assert.strictEqual(options?.useTabs, false)
    assert.strictEqual(options?.tabWidth, 4)
    assert.strictEqual(options?.printWidth, 100)
    assert.strictEqual(options?.endOfLine, 'crlf')
    assert.strictEqual(options?.singleAttributePerLine, true)
    assert.strictEqual(options?.singleQuote, true)
    assert.strictEqual(options?.jsxSingleQuote, true)
    assert.strictEqual(options?.semi, false)
    assert.strictEqual(options?.trailingComma, 'es5')
    assert.strictEqual(options?.arrowParens, 'avoid')

    const overrides = options?.overrides as Record<string, unknown>[]
    assert.deepStrictEqual(overrides[0].files, ['**/*.tsx'])
    assert.deepStrictEqual(overrides[0].excludeFiles, ['**/*.test.tsx'])
    assert.strictEqual(
      (overrides[0].options as Record<string, unknown>).singleQuote,
      false,
    )
  })

  test('returns null when Biome formatting is disabled', () => {
    assert.strictEqual(normalizeBiomeConfig({ formatter: { enabled: false } }), null)
    assert.strictEqual(
      normalizeBiomeConfig({ javascript: { formatter: { enabled: false } } }),
      null,
    )
  })

  test('applies matching overrides to the generated file', () => {
    const options = {
      semi: true,
      singleQuote: false,
      overrides: [
        { files: ['*.tsx'], options: { semi: false, singleQuote: true } },
        { files: ['**/*.test.tsx'], options: { semi: true } },
      ],
    }

    const component = applyOverrides(options, '/app/button.tsx', '/app')
    assert.strictEqual(component.semi, false)
    assert.strictEqual(component.singleQuote, true)

    const testFile = applyOverrides(options, '/app/src/button.test.tsx', '/app')
    assert.strictEqual(testFile.semi, true)

    const otherFile = applyOverrides(options, '/app/src/button.ts', '/app')
    assert.strictEqual(otherFile.semi, true)
    assert.strictEqual(otherFile.overrides, undefined)
  })

  test('formats generated code with Prettier, oxfmt and Biome configs', async () => {
    const code = `const x = "hi";\nexport default x;`

    const prettierDir = createTempDir()
    fs.writeFileSync(
      path.join(prettierDir, '.prettierrc'),
      JSON.stringify({ semi: false, singleQuote: true }),
    )

    const oxfmtDir = createTempDir()
    fs.writeFileSync(
      path.join(oxfmtDir, '.oxfmtrc.json'),
      JSON.stringify({ semi: false, singleQuote: true }),
    )

    const biomeDir = createTempDir()
    fs.writeFileSync(
      path.join(biomeDir, 'biome.json'),
      JSON.stringify({
        formatter: { indentStyle: 'space', indentWidth: 2 },
        javascript: {
          formatter: { quoteStyle: 'single', semicolons: 'asNeeded' },
        },
      }),
    )

    try {
      for (const dir of [prettierDir, oxfmtDir, biomeDir]) {
        const result = await formatFileContent({
          content: code,
          filePath: path.join(dir, 'button.ts'),
          workspaceRoot: dir,
        })

        assert.ok(result.indexOf("const x = 'hi'") !== -1)
        assert.ok(result.indexOf('const x = "hi";') === -1)
      }
    } finally {
      removeDir(prettierDir)
      removeDir(oxfmtDir)
      removeDir(biomeDir)
    }
  })

  test('normalizes oxfmt override globs', () => {
    const options = normalizeOxfmtConfig({
      $schema: './node_modules/oxfmt/configuration_schema.json',
      singleQuote: true,
      overrides: [{ files: '*.ts', options: { semi: false } }],
    })

    assert.strictEqual(options.$schema, undefined)
    assert.strictEqual(options.singleQuote, true)
    const overrides = options.overrides as Record<string, unknown>[]
    assert.deepStrictEqual(overrides[0].files, ['*.ts'])
  })
})
