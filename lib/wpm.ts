/**
 * WPM (Words Per Minute) and accuracy calculation utilities
 * 
 * Formula used:
 * WPM = (correct_chars / 5) / (elapsed_seconds / 60)
 * Accuracy = (correct_chars / total_chars_typed) * 100
 */

/**
 * Compute WPM based on correctly typed characters and elapsed time
 * Standard conversion: 5 characters = 1 word
 * 
 * @param correctChars - Number of characters typed correctly
 * @param elapsedSeconds - Time elapsed in seconds
 * @returns WPM rounded to 2 decimal places
 */
export function computeWPM(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0
  const words = correctChars / 5 // Standard 5 chars per word
  const minutes = elapsedSeconds / 60
  return Math.round((words / minutes) * 100) / 100 // Two decimals
}

/**
 * Compute typing accuracy as a percentage
 * 
 * @param correctChars - Number of characters typed correctly
 * @param totalCharsTyped - Total characters typed (including mistakes)
 * @returns Accuracy percentage rounded to 2 decimal places
 */
export function computeAccuracy(
  correctChars: number,
  totalCharsTyped: number
): number {
  if (totalCharsTyped === 0) return 100
  return Math.round((correctChars / totalCharsTyped) * 10000) / 100 // Percent with 2 decimals
}

/**
 * Compute net WPM with penalty for mistakes
 * Formula: ((correct_chars - mistakes) / 5) / (elapsed_seconds / 60)
 * 
 * @param correctChars - Number of characters typed correctly
 * @param mistakes - Number of mistakes made
 * @param elapsedSeconds - Time elapsed in seconds
 * @returns Net WPM rounded to 2 decimal places
 */
export function computeNetWPM(
  correctChars: number,
  mistakes: number,
  elapsedSeconds: number
): number {
  if (elapsedSeconds <= 0) return 0
  const netCorrect = Math.max(0, correctChars - mistakes)
  const words = netCorrect / 5
  const minutes = elapsedSeconds / 60
  return Math.round((words / minutes) * 100) / 100
}

/**
 * Compute Characters Per Minute (raw metric)
 * 
 * @param totalCharsTyped - Total characters typed
 * @param elapsedSeconds - Time elapsed in seconds
 * @returns CPM rounded to 2 decimal places
 */
export function computeCPM(totalCharsTyped: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0
  const minutes = elapsedSeconds / 60
  return Math.round((totalCharsTyped / minutes) * 100) / 100
}

/**
 * Get player stats object with all calculated metrics
 */
export function getPlayerStats(
  correctChars: number,
  totalCharsTyped: number,
  mistakes: number,
  elapsedSeconds: number
) {
  return {
    wpm: computeWPM(correctChars, elapsedSeconds),
    netWpm: computeNetWPM(correctChars, mistakes, elapsedSeconds),
    accuracy: computeAccuracy(correctChars, totalCharsTyped),
    cpm: computeCPM(totalCharsTyped, elapsedSeconds),
    correctChars,
    mistakes,
  }
}

/**
 * Parse elapsed time and return seconds
 */
export function parseElapsedTime(startTime: Date, endTime?: Date): number {
  const end = endTime || new Date()
  return (end.getTime() - startTime.getTime()) / 1000
}
