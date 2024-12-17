export type WrapInTemplateLiteralProps = {
  text: string
  isPlaceholder?: boolean
}

export type WrapInTemplateLiteralReturn = string

export default function wrapInTemplateLiteral(
  props: WrapInTemplateLiteralProps,
): WrapInTemplateLiteralReturn {
  let stringWrappedInTemplateLiteral = `${'`'}${props.text}${'`'}`

  if (props.isPlaceholder) {
    stringWrappedInTemplateLiteral = `${'${'}${props.text}${'}'}`
  }

  return stringWrappedInTemplateLiteral
}
