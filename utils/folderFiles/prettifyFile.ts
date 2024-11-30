import prettier from 'prettier'

export default async function prettifyFile({ prettierConfig = {}, content = '' }) {
  try {
    const prettifiedContent = prettier.format(content, {
      ...prettierConfig,
      parser: 'babel',
    })

    return prettifiedContent
  } catch (error) {
    return content
  }
}
