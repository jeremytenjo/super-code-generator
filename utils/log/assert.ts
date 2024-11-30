import logError from './logError'

export default function assert(assertion, message) {
  if (!assertion) {
    return logError(message)
  }
}
