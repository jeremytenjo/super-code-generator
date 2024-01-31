const prettier = require('prettier')

module.exports = async function prettifyFile({ prettierConfig = {}, content = '' }) {
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
