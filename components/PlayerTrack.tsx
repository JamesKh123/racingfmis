'use client'

import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface PlayerTrackProps {
  playerName: string
  avatarUrl?: string
  progressPercent: number
  wpm?: number
  isFinished: boolean
}

const CAR_EMOJIS = ['🏎️', '🚗', '🚙', '🚕', '🏍️', '🚓']

export const PlayerTrack: React.FC<PlayerTrackProps> = ({
  playerName,
  avatarUrl,
  progressPercent,
  wpm,
  isFinished,
}) => {
  const carEmoji = CAR_EMOJIS[Math.floor(Math.random() * CAR_EMOJIS.length)]

  return (
    <div className="mb-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={playerName}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="font-medium text-sm md:text-base">{playerName}</span>
        </div>
        {isFinished && (
          <span className="text-xs font-bold text-green-600 dark:text-green-400">
            🏁 Finished {wpm && `- ${wpm} WPM`}
          </span>
        )}
      </div>

      {/* Racing track */}
      <div className="relative bg-slate-200 dark:bg-slate-800 h-10 rounded-lg overflow-hidden">
        {/* Track lines */}
        <div className="absolute inset-0 flex items-center opacity-20">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="h-full w-px bg-slate-400 dark:bg-slate-600"
              style={{ left: `${(i + 1) * 10}%` }}
            />
          ))}
        </div>

        {/* Finish line */}
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-yellow-600" />

        {/* Player car/icon */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 text-2xl"
          animate={{
            left: `${Math.min(progressPercent, 100)}%`,
          }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 100,
          }}
        >
          {carEmoji}
        </motion.div>
      </div>

      {/* Progress percentage */}
      <div className="mt-2 flex justify-between items-center">
        <div className="text-xs text-slate-600 dark:text-slate-400">
          {progressPercent.toFixed(1)}%
        </div>
        {wpm && (
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {wpm.toFixed(2)} WPM
          </div>
        )}
      </div>
    </div>
  )
}
