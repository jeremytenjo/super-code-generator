const prettier = require('prettier')
const eslint = require('eslint')

module.exports = async function prettifyFile({ prettierConfig = {}, content = '' }) {
  try {
    let prettifiedContent = prettier.format(content, {
      ...prettierConfig,
      parser: 'babel',
    })

    prettifiedContent = await eslint.lintText(prettifiedContent)

    return prettifiedContent
  } catch (error) {
    return content
  }
}
