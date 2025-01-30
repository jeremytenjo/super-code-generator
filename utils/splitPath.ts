export const StartsWithSlashRegex = /^[\\/]/;

/**
 * Supports all operating systems
 * @example
 * splitPath('/project/heoo')
 *
 * returns ['project', 'heoo']
 */
export default function splitPath(path: string): string[] {
  // Split by any type of slash
  return path.toString().split(/[\\/]/)
}
