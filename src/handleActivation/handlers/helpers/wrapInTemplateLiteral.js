module.exports = function wrapInTemplateLiteral(string) {
  const stringWrappedInTemplateLiteral = `${'`${'}${string}${'}`'}`

  return stringWrappedInTemplateLiteral
}
