export type WrapInTemplateLiteralProps = string

export default function wrapInTemplateLiteral(text: WrapInTemplateLiteralProps) {
  const stringWrappedInTemplateLiteral = `${'`${'}${text}${'}`'}`

  return stringWrappedInTemplateLiteral
}
