import forwardSlash from './forwardSlash'

/**
 * Supports Mac and Windows
 * @example
 * splitPath('/project/heoo')
 *
 * returns ['project', 'heoo']
 */
export default function splitPath(path) {
  return path.toString().split(forwardSlash)
}
