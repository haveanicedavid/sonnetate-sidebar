import short from 'short-uuid'

const translator = short()

/**
 * Converts a standard UUID to a shorter version using the short-uuid library.
 *
 * @param longId - The standard UUID to be converted.
 * @returns The shorter version of the UUID.
 */
export function toShortId(longId: string) {
  return translator.fromUUID(longId)
}

/**
 * Converts a short UUID back to its standard version using the short-uuid library.
 *
 * @param shortId - The short UUID to be converted.
 * @returns The standard version of the UUID.
 */
export function toFullId(shortId: string): string {
  return translator.toUUID(shortId)
}
