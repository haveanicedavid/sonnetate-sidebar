/**
 * This is a bit obfuscated, but We need to dynamically build a query that
 * keeps drilling through parents based on the number of topicIds we have.
 *
 * IE for a path 5 layers deep, like `a/b/c/`, we need to build a query like:
 *
 * @example
 * ```ts
 * const query = {
 *   trees: {
 *     $: {
 *       where: {
 *         'topic.id': path[0],
 *         'parent.topic.id': path[1],
 *         'parent.parent.topic.id': path[2],
 *       },
 *     },
 *   },
 * }
 * ```
 *
 * We also need to go from the end of the path upwards, hence the `reverse()`
 *
 */
export const buildTopicWhereClause = (
  path: string[]
): Record<string, string> => {
  return [...path.reverse()].reduce((acc, id, index) => {
    const key = index === 0 ? 'topic.id' : `${'parent.'.repeat(index)}topic.id`
    return { ...acc, [key]: id }
  }, {})
}
