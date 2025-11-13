/**
 * Unit tests for WPM and accuracy calculations
 */

import {
  computeWPM,
  computeAccuracy,
  computeNetWPM,
  computeCPM,
  getPlayerStats,
  parseElapsedTime,
} from '@/lib/wpm'

describe('WPM Calculations', () => {
  describe('computeWPM', () => {
    it('should calculate WPM correctly: 250 correct chars in 60s = 50 WPM', () => {
      const wpm = computeWPM(250, 60)
      expect(wpm).toBe(50)
    })

    it('should return 0 for elapsed time <= 0', () => {
      expect(computeWPM(250, 0)).toBe(0)
      expect(computeWPM(250, -1)).toBe(0)
    })

    it('should calculate WPM for partial minute: 125 chars in 30s = 50 WPM', () => {
      const wpm = computeWPM(125, 30)
      expect(wpm).toBe(50)
    })

    it('should round to 2 decimal places', () => {
      const wpm = computeWPM(100, 60)
      expect(wpm).toBe(20)
    })

    it('should handle very fast typing: 500 chars in 60s = 100 WPM', () => {
      const wpm = computeWPM(500, 60)
      expect(wpm).toBe(100)
    })

    it('should handle slow typing: 50 chars in 60s = 10 WPM', () => {
      const wpm = computeWPM(50, 60)
      expect(wpm).toBe(10)
    })
  })

  describe('computeAccuracy', () => {
    it('should calculate accuracy correctly: 100/100 chars = 100%', () => {
      const acc = computeAccuracy(100, 100)
      expect(acc).toBe(100)
    })

    it('should calculate accuracy: 80/100 chars = 80%', () => {
      const acc = computeAccuracy(80, 100)
      expect(acc).toBe(80)
    })

    it('should return 100 for 0 characters typed', () => {
      const acc = computeAccuracy(0, 0)
      expect(acc).toBe(100)
    })

    it('should round to 2 decimal places: 1/3 = 33.33%', () => {
      const acc = computeAccuracy(1, 3)
      expect(acc).toBe(33.33)
    })

    it('should handle high accuracy: 250/251 chars', () => {
      const acc = computeAccuracy(250, 251)
      expect(acc).toBeCloseTo(99.6)
    })
  })

  describe('computeNetWPM', () => {
    it('should calculate net WPM with penalty: 250 correct, 25 mistakes, 60s = 45 WPM', () => {
      const netWpm = computeNetWPM(250, 25, 60)
      expect(netWpm).toBe(45)
    })

    it('should return 0 for elapsed time <= 0', () => {
      expect(computeNetWPM(250, 10, 0)).toBe(0)
    })

    it('should handle case where mistakes exceed correct chars', () => {
      const netWpm = computeNetWPM(50, 100, 60)
      expect(netWpm).toBe(0)
    })
  })

  describe('computeCPM', () => {
    it('should calculate CPM correctly: 300 chars in 60s = 300 CPM', () => {
      const cpm = computeCPM(300, 60)
      expect(cpm).toBe(300)
    })

    it('should return 0 for elapsed time <= 0', () => {
      expect(computeCPM(300, 0)).toBe(0)
    })
  })

  describe('getPlayerStats', () => {
    it('should return all stats for a player', () => {
      const stats = getPlayerStats(250, 260, 10, 60)
      expect(stats).toEqual({
        wpm: 50,
        netWpm: 48,
        accuracy: 96.15,
        cpm: 260,
        correctChars: 250,
        mistakes: 10,
      })
    })
  })

  describe('parseElapsedTime', () => {
    it('should calculate elapsed time in seconds', () => {
      const start = new Date('2024-01-01T00:00:00')
      const end = new Date('2024-01-01T00:01:00')
      const elapsed = parseElapsedTime(start, end)
      expect(elapsed).toBe(60)
    })

    it('should work without end time (using current time)', () => {
      const start = new Date(Date.now() - 1000)
      const elapsed = parseElapsedTime(start)
      expect(elapsed).toBeGreaterThanOrEqual(1)
      expect(elapsed).toBeLessThan(2)
    })
  })
})
