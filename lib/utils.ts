/**
 * Utility functions for room and text management
 */

/**
 * Generate a random 6-character room code
 */
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * Validate room code format
 */
export function isValidRoomCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code.toUpperCase())
}

/**
 * Sanitize custom text for security
 * Remove potentially harmful scripts/html and limit length
 */
export function sanitizeCustomText(text: string): string {
  return text
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .slice(0, 50000)
    .trim()
}

/**
 * Count characters in text (excluding newlines for consistency)
 */
export function countChars(text: string): number {
  return text.replace(/\n/g, ' ').length
}

/**
 * Split text into words array
 */
export function splitIntoWords(text: string): string[] {
  return text
    .split(/\s+/)
    .filter(word => word.length > 0)
}

/**
 * Split text into characters array
 */
export function splitIntoChars(text: string): string[] {
  return text.split('')
}

/**
 * Get word at index in text
 */
export function getWordAtIndex(words: string[], index: number): string | null {
  return words[index] || null
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(currentIndex: number, totalCount: number): number {
  if (totalCount === 0) return 0
  return Math.round((currentIndex / totalCount) * 10000) / 100
}

/**
 * Khmer language detection
 */
export function isKhmerText(text: string): boolean {
  // Khmer Unicode ranges: 0x1780-0x17FF
  const khmerPattern = /[\u1780-\u17FF]/g
  const matches = text.match(khmerPattern)
  return (matches?.length || 0) / text.length > 0.3
}
