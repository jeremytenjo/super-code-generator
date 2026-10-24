/**
 * Minimal JSONC parser. Handles comments and trailing commas, which are both
 * supported by `biome.jsonc` and `.oxfmtrc.jsonc`.
 */
export default function parseJsonc<T = unknown>(text: string): T {
  const withoutBom = text.replace(/^\uFEFF/, '')

  try {
    return JSON.parse(withoutBom) as T
  } catch {
    const withoutComments = stripComments(withoutBom)
    const withoutTrailingCommas = stripTrailingCommas(withoutComments)
    return JSON.parse(withoutTrailingCommas) as T
  }
}

function stripComments(text: string) {
  let result = ''
  let inString = false
  let escaped = false

  for (let index = 0; index < text.length; index++) {
    const char = text[index]
    const next = text[index + 1]

    if (inString) {
      result += char
      if (escaped) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === '"') {
        inString = false
      }
      continue
    }

    if (char === '"') {
      inString = true
      result += char
      continue
    }

    if (char === '/' && next === '/') {
      while (index < text.length && text[index] !== '\n') index++
      result += '\n'
      continue
    }

    if (char === '/' && next === '*') {
      index += 2
      while (index < text.length && !(text[index] === '*' && text[index + 1] === '/')) {
        if (text[index] === '\n') result += '\n'
        index++
      }
      index++
      continue
    }

    result += char
  }

  return result
}

function stripTrailingCommas(text: string) {
  let result = ''
  let inString = false
  let escaped = false

  for (let index = 0; index < text.length; index++) {
    const char = text[index]

    if (inString) {
      result += char
      if (escaped) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === '"') {
        inString = false
      }
      continue
    }

    if (char === '"') {
      inString = true
      result += char
      continue
    }

    if (char === ',') {
      let lookahead = index + 1
      while (lookahead < text.length && /\s/.test(text[lookahead])) lookahead++
      if (text[lookahead] === '}' || text[lookahead] === ']') continue
    }

    result += char
  }

  return result
}
