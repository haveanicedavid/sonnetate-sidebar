import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getDayTimestamp } from './date'

describe('date utilities', () => {
  beforeEach(() => {
    // Mock the Date object
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Restore the Date object
    vi.useRealTimers()
  })

  describe('getDayTimestamp', () => {
    it('should return the same timestamp for all hours between 4 AM and 3:59 AM the next day', () => {
      const baseDate = new Date(2023, 6, 15, 4, 0) // July 15, 2023, 4:00 AM
      const expectedTimestamp = baseDate.getTime()

      // Test various times throughout the day
      const testTimes = [
        new Date(2023, 6, 15, 4, 0), // 4:00 AM
        new Date(2023, 6, 15, 10, 30), // 10:30 AM
        new Date(2023, 6, 15, 23, 59), // 11:59 PM
        new Date(2023, 6, 16, 0, 1), // 12:01 AM (next day)
        new Date(2023, 6, 16, 3, 59), // 3:59 AM (next day)
      ]

      testTimes.forEach((time) => {
        expect(getDayTimestamp(time)).toBe(expectedTimestamp)
      })
    })

    it('should handle the transition to the next day', () => {
      const day1 = new Date(2023, 6, 15, 4, 0) // July 15, 2023, 4:00 AM
      const day2 = new Date(2023, 6, 16, 4, 0) // July 16, 2023, 4:00 AM

      const timestamp1 = getDayTimestamp(day1)
      const timestamp2 = getDayTimestamp(day2)

      expect(timestamp2).not.toBe(timestamp1)
      expect(timestamp2 - timestamp1).toBe(24 * 60 * 60 * 1000) // 24 hours difference
    })

    it('should return the current day timestamp when no argument is provided', () => {
      vi.setSystemTime(new Date(2023, 6, 15, 12, 0)) // Set current time to July 15, 2023, 12:00 PM
      const result = getDayTimestamp()
      const expected = new Date(2023, 6, 15, 4, 0, 0, 0).getTime()
      expect(result).toBe(expected)
    })
  })
})
