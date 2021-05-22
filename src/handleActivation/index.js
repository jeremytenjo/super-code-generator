const userConfig = require('../../test/app/userConfigExample')
const createComponent = require('./handlers/createComponent')
const helpers = require('./handlers/helpers')

module.exports = function handleActivation() {
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
