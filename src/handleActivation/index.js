const changeCase = require('change-case')
const userConfig = require('../../../test/app/userConfigExample')
const createComponent = require('./handlers/createComponent')

module.exports = function handleActivation() {
  // config properties = configFilePath, prettier config path

  // helpers
  const helpers = {
    wrapInTemplateLiteral: require('../helpers/wrapInTemplateLiteral'),
    changeCase
  }

  // user input
  const componentName = 'filter-button'
  const selectedComponentType = 'React component'
  const componentOutputPath = '/test/app/'

  const optionsList = userConfig.map((property) => ({ label: property.type }))

  const selectedComponentTypeConfig = userConfig.find(
    ({ type }) => type === selectedComponentType
  )

  createComponent({
    name: componentName,
    helpers,
    componentConfig: selectedComponentTypeConfig,
    componentOutputPath
  })
}
