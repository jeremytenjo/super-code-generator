import logError from './logError'

export default function assert(assertion: boolean, message: string) {
  if (!assertion) {
    return logError(message)
  }
}
