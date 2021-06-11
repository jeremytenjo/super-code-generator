const logError = require('./logError')

module.exports = function assert(assertion, message) {
  if (!assertion) {
    return logError(message)
  }
}
