import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getDayTimestamp } from './today-timestamp'

describe('getDayTimestamp', () => {
  beforeEach(() => {
    // Mock the Date object
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Restore the Date object
    vi.useRealTimers()
  })

  it('should return the same timestamp for all hours between 4 AM and 3:59 AM the next day', () => {
    const baseDate = new Date(2023, 6, 15, 4, 0) // July 15, 2023, 4:00 AM
    const expectedTimestamp = baseDate.getTime()

    // Test various times throughout the day
    const testTimes = [
      new Date(2023, 6, 15, 4, 0), // 4:00 AM
      new Date(2023, 6, 15, 10, 30), // 10:30 AM
      new Date(2023, 6, 15, 15, 45), // 3:45 PM
      new Date(2023, 6, 15, 23, 59), // 11:59 PM
      new Date(2023, 6, 16, 0, 1), // 12:01 AM (next day)
      new Date(2023, 6, 16, 3, 59), // 3:59 AM (next day)
    ]

    testTimes.forEach((time) => {
      expect(getDayTimestamp(time)).toBe(expectedTimestamp)
    })

    // Test the transition to the next day
    const nextDay = new Date(2023, 6, 16, 4, 0) // July 16, 2023, 4:00 AM
    const nextDayTimestamp = getDayTimestamp(nextDay)
    expect(nextDayTimestamp).not.toBe(expectedTimestamp)
    expect(nextDayTimestamp).toBe(expectedTimestamp + 24 * 60 * 60 * 1000) // 24 hours later
  })

  it('should handle daylight saving time changes correctly', () => {
    // Assuming DST starts on March 12, 2023 at 2 AM in the US

    // Test just before DST starts
    let result = getDayTimestamp(new Date(2023, 2, 12, 1, 59))
    let expected = new Date(2023, 2, 11, 4, 0, 0, 0).getTime()
    expect(result).toBe(expected)

    // Test just after DST starts
    result = getDayTimestamp(new Date(2023, 2, 12, 3, 1))
    expect(result).toBe(expected) // Should still be the same as before DST change

    // Test after 4 AM on the day of DST change
    result = getDayTimestamp(new Date(2023, 2, 12, 4, 1))
    expected = new Date(2023, 2, 12, 4, 0, 0, 0).getTime()
    expect(result).toBe(expected) // Should now be the new day
  })

  it('should return the current day timestamp when no argument is provided', () => {
    vi.setSystemTime(new Date(2023, 6, 15, 12, 0)) // Set current time to July 15, 2023, 12:00 PM
    const result = getDayTimestamp()
    const expected = new Date(2023, 6, 15, 4, 0, 0, 0).getTime()
    expect(result).toBe(expected)
  })

  it('should handle dates from different years correctly', () => {
    const result1 = getDayTimestamp(new Date(2022, 11, 31, 23, 59)) // Dec 31, 2022, 23:59
    const expected1 = new Date(2022, 11, 31, 4, 0, 0, 0).getTime()
    expect(result1).toBe(expected1)

    const result2 = getDayTimestamp(new Date(2023, 0, 1, 0, 1)) // Jan 1, 2023, 00:01
    const expected2 = new Date(2022, 11, 31, 4, 0, 0, 0).getTime() // Still Dec 31, 2022
    expect(result2).toBe(expected2)

    const result3 = getDayTimestamp(new Date(2023, 0, 1, 4, 1)) // Jan 1, 2023, 04:01
    const expected3 = new Date(2023, 0, 1, 4, 0, 0, 0).getTime() // Now it's Jan 1, 2023
    expect(result3).toBe(expected3)
  })
})
