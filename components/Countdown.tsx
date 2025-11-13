'use client'

import React, { useState, useEffect } from 'react'
import clsx from 'clsx'

interface CountdownProps {
  isVisible: boolean
  onComplete: () => void
}

export const Countdown: React.FC<CountdownProps> = ({ isVisible, onComplete }) => {
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (!isVisible) return

    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      onComplete()
    }
  }, [count, isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="text-center">
        {count > 0 ? (
          <div
            className={clsx(
              'text-9xl font-bold mb-4 transition-all duration-300',
              count <= 1
                ? 'text-red-500 scale-125'
                : count === 2
                ? 'text-yellow-500 scale-110'
                : 'text-blue-500'
            )}
          >
            {count}
          </div>
        ) : (
          <div className="text-7xl font-bold text-green-500 animate-pulse">
            GO!
          </div>
        )}
      </div>
    </div>
  )
}
