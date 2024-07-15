/**
 * Get the timestamp for the given day, with the day starting at 4 AM in the user's local timezone.
 */
export function getDayTimestamp(date: Date = new Date()): number {
  const fourAM = new Date(date)
  fourAM.setHours(4, 0, 0, 0)

  return date.getHours() < 4
    ? new Date(fourAM.getTime() - 24 * 60 * 60 * 1000).getTime()
    : fourAM.getTime()
}

