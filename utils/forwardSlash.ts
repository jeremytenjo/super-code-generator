import isMac from './isMac'

const splitValue = isMac() ? '/' : '\\'

export default splitValue
