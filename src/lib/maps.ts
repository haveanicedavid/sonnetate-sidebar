/**
 * We use nested topic IDs for queries, but they come back unsorted.
 * Using an object instead of a Map here to avoid annoying type errors.
 * when trying to do things like `.sort``
 */
export function topicIdMap(topicIds: string[] | string) {
  const ids = Array.isArray(topicIds) ? topicIds : topicIds.split('/')
  const map: { [id: string]: number } = {}
  ids.forEach((id, i) => {
    map[id] = i
  })
  return map
}
