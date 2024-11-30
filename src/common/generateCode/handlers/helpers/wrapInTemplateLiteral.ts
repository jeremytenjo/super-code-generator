export default function wrapInTemplateLiteral(string) {
  const stringWrappedInTemplateLiteral = `${'`${'}${string}${'}`'}`

  return stringWrappedInTemplateLiteral
}
