export type WrapInTemplateLiteralProps = string

export type WrapInTemplateLiteralReturn = string

export default function wrapInTemplateLiteral(
  text: WrapInTemplateLiteralProps,
): WrapInTemplateLiteralReturn {
  const stringWrappedInTemplateLiteral = `${'`${'}${text}${'}`'}`

  return stringWrappedInTemplateLiteral
}
