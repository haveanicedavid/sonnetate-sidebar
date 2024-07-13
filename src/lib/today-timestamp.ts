/**
 * Get the timestamp for the given day, with the day starting at 4 AM in the user's local timezone.
 */
export function getDayTimestamp(date: Date = new Date()) {
  const givenDate = new Date(date)
  const currentHour = givenDate.getHours()

  // If it's before 4 AM, we consider it part of the previous day
  if (currentHour < 4) {
    givenDate.setDate(givenDate.getDate() - 1)
  }

  // Set the time to 4:00:00 AM of the determined day
  givenDate.setHours(4, 0, 0, 0)

  return givenDate.getTime()
}
