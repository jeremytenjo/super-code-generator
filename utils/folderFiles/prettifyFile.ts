import prettier from 'prettier'

export default async function prettifyFile(props: {
  prettierConfig: object
  content: string
}) {
  try {
    const prettifiedContent = prettier.format(props.content, {
      ...props.prettierConfig,
      parser: 'babel',
    })

    return prettifiedContent
  } catch (error) {
    return props.content
  }
}
