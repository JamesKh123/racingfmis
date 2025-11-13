'use client'

import React, { useState, useCallback } from 'react'
import clsx from 'clsx'

interface TypingAreaProps {
  text: string
  isActive: boolean
  onProgressChange: (progress: {
    correctChars: number
    totalCharsTyped: number
    mistakes: number
    progressPercent: number
  }) => void
  onComplete: () => void
}

interface TypingState {
  currentWordIndex: number
  currentCharIndex: number
  words: string[]
  userInput: string[]
  mistakes: number
  totalCharsTyped: number
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  text,
  isActive,
  onProgressChange,
  onComplete,
}) => {
  const words = text.split(/\s+/).filter(w => w.length > 0)
  const [state, setState] = useState<TypingState>({
    currentWordIndex: 0,
    currentCharIndex: 0,
    words,
    userInput: Array(words.length).fill(''),
    mistakes: 0,
    totalCharsTyped: 0,
  })

  // Calculate correct characters
  const correctChars = state.userInput.reduce((acc, word, idx) => {
    if (idx < state.currentWordIndex) {
      return acc + words[idx].length
    }
    // For current word, count matching characters
    return (
      acc +
      [...word].filter((char, i) => char === words[idx]?.[i]).length
    )
  }, 0)

  // Calculate progress
  const totalChars = words.join('').length
  const progressPercent = totalChars > 0 ? (correctChars / totalChars) * 100 : 0

  // Update parent with progress
  React.useEffect(() => {
    onProgressChange({
      correctChars,
      totalCharsTyped: state.totalCharsTyped,
      mistakes: state.mistakes,
      progressPercent,
    })
  }, [correctChars, state.totalCharsTyped, state.mistakes, progressPercent, onProgressChange])

  // Check if race is complete
  React.useEffect(() => {
    if (
      state.currentWordIndex >= words.length &&
      state.currentCharIndex >= (words[words.length - 1]?.length || 0)
    ) {
      onComplete()
    }
  }, [state.currentWordIndex, state.currentCharIndex, words, onComplete])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isActive) return

    const currentWord = words[state.currentWordIndex]
    if (!currentWord) return

    if (e.key === 'Backspace') {
      e.preventDefault()
      setState(prev => ({
        ...prev,
        currentCharIndex: Math.max(0, prev.currentCharIndex - 1),
        userInput: prev.userInput.map((w, i) =>
          i === prev.currentWordIndex
            ? w.slice(0, Math.max(0, prev.currentCharIndex - 1))
            : w
        ),
      }))
      return
    }

    if (e.key === ' ') {
      e.preventDefault()
      // Check if current word is complete and matches
      const userWord = state.userInput[state.currentWordIndex] || ''
      if (userWord === currentWord) {
        // Move to next word
        setState(prev => ({
          ...prev,
          currentWordIndex: Math.min(prev.currentWordIndex + 1, prev.words.length - 1),
          currentCharIndex: 0,
        }))
      }
      return
    }

    if (e.key === 'Enter' || e.key.length === 1) {
      e.preventDefault()
      const char = e.key

      // Only add printable characters
      if (char.length === 1 && state.currentCharIndex < currentWord.length) {
        const isCorrect = char === currentWord[state.currentCharIndex]
        setState(prev => ({
          ...prev,
          currentCharIndex: prev.currentCharIndex + 1,
          userInput: prev.userInput.map((w, i) =>
            i === prev.currentWordIndex
              ? w + char
              : w
          ),
          mistakes: prev.mistakes + (isCorrect ? 0 : 1),
          totalCharsTyped: prev.totalCharsTyped + 1,
        }))
      }
    }
  }, [isActive, state, words])

  const currentWord = words[state.currentWordIndex]
  const userWord = state.userInput[state.currentWordIndex] || ''
  const isCurrentWordCorrect = userWord === currentWord

  return (
    <div
      className="w-full focus:outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="textbox"
      aria-label="Typing area"
      aria-live="polite"
    >
      {/* Display all words */}
      <div className="text-lg md:text-xl leading-relaxed font-khmer">
        {words.map((word, wordIdx) => {
          const isCurrentWord = wordIdx === state.currentWordIndex
          const isCompleted = wordIdx < state.currentWordIndex
          const userInputWord = state.userInput[wordIdx] || ''
          const isWordCorrect = isCompleted && userInputWord === word

          return (
            <span
              key={wordIdx}
              className={clsx(
                'typing-word inline-block mx-1',
                isCurrentWord && 'current bg-blue-200 dark:bg-blue-900 rounded',
                isWordCorrect && 'completed text-green-600 dark:text-green-400',
                isCompleted && !isWordCorrect && 'error text-red-600 dark:text-red-400'
              )}
            >
              {/* Character level display */}
              {word.split('').map((char, charIdx) => {
                const userChar = userInputWord[charIdx]
                const isCurrentChar = isCurrentWord && charIdx === userWord.length
                const isCharCorrect = userChar === char
                const isCharWrong = userChar && userChar !== char

                return (
                  <span
                    key={charIdx}
                    className={clsx(
                      'typing-char relative',
                      isCurrentChar && 'current border-l-2 border-blue-500 animate-blink ml-0.5',
                      isCharWrong && 'error border-b-2 border-red-500'
                    )}
                  >
                    {char}
                  </span>
                )
              })}
            </span>
          )
        })}
      </div>

      {/* Stats display */}
      <div className="mt-6 grid grid-cols-4 gap-2 text-sm">
        <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded">
          <div className="text-xs text-slate-600 dark:text-slate-400">Progress</div>
          <div className="text-lg font-bold">{progressPercent.toFixed(1)}%</div>
        </div>
        <div className="bg-green-50 dark:bg-green-950 p-2 rounded">
          <div className="text-xs text-slate-600 dark:text-slate-400">Correct</div>
          <div className="text-lg font-bold">{correctChars}</div>
        </div>
        <div className="bg-red-50 dark:bg-red-950 p-2 rounded">
          <div className="text-xs text-slate-600 dark:text-slate-400">Mistakes</div>
          <div className="text-lg font-bold">{state.mistakes}</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950 p-2 rounded">
          <div className="text-xs text-slate-600 dark:text-slate-400">Typed</div>
          <div className="text-lg font-bold">{state.totalCharsTyped}</div>
        </div>
      </div>
    </div>
  )
}
