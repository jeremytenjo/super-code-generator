module.exports = {
  changeCase: { ...require('change-case'), lowerCase: require('lower-case').lowerCase },
  wrapInTemplateLiteral: require('./wrapInTemplateLiteral'),
  addEmptyTemplateLiteral: require('./addEmptyTemplateLiteral'),
}
