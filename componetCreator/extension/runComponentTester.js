const changeCase = require('change-case')

const userFuction = require('../testApp/componentTemplates/component/[componentName.raw].js')
const userConfigFile = require('../testApp/componentTemplates/config')

// component anme entered by user
const userEnteredComponentName = 'filter-button'
// output gotten from context menu api
const outputPath = 'componentCreator/output'

// properties sent to each user file template
function wrapInTemplateLiteral(string) {
  const stringWrappedInTemplateLiteral = `${'`${'}${string}${'}`'}`

  return stringWrappedInTemplateLiteral
}

const componentName = {
  raw: userEnteredComponentName,
  pascalCase: changeCase.pascalCase(userEnteredComponentName)
}

// loop through files
const userFuctionRes = userFuction.template({
  componentName,
  wrapInTemplateLiteral
})

console.log(userFuctionRes)
