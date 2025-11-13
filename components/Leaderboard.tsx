'use client'

import React from 'react'
import clsx from 'clsx'

interface Participant {
  id: string
  displayName: string
  wpm?: number
  accuracy?: number
  finishedAt?: string
  correctChars: number
  mistakes: number
}

interface LeaderboardProps {
  participants: Participant[]
  isLive: boolean
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  participants,
  isLive,
}) => {
  // Sort by WPM descending, then by finished time
  const sorted = [...participants]
    .filter(p => p.wpm !== undefined)
    .sort((a, b) => {
      if (!a.wpm || !b.wpm) return 0
      if (b.wpm !== a.wpm) return b.wpm - a.wpm
      if (a.finishedAt && b.finishedAt) {
        return new Date(a.finishedAt).getTime() - new Date(b.finishedAt).getTime()
      }
      return 0
    })

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div
      className={clsx(
        'w-full rounded-lg border-2',
        isLive
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-950'
          : 'border-green-400 bg-green-50 dark:bg-green-950'
      )}
    >
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">
          {isLive ? '📊 Live Leaderboard' : '🏁 Final Results'}
        </h2>

        <div className="space-y-2">
          {sorted.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Waiting for participants to finish...
            </p>
          ) : (
            sorted.map((participant, index) => (
              <div
                key={participant.id}
                className={clsx(
                  'p-3 rounded-lg flex items-center justify-between',
                  isLive
                    ? 'bg-white dark:bg-slate-900'
                    : 'bg-white dark:bg-slate-800',
                  index === 0 && !isLive && 'ring-2 ring-yellow-400'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl w-6 text-center">
                    {index < 3 ? medals[index] : `#${index + 1}`}
                  </span>
                  <div>
                    <div className="font-semibold text-sm">
                      {participant.displayName}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {participant.mistakes > 0 && `${participant.mistakes} mistakes`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm font-semibold">
                  {participant.accuracy !== undefined && (
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Accuracy
                      </div>
                      <div>{participant.accuracy.toFixed(2)}%</div>
                    </div>
                  )}
                  {participant.wpm !== undefined && (
                    <div className="text-right">
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        WPM
                      </div>
                      <div className="text-lg text-blue-600 dark:text-blue-400">
                        {participant.wpm.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
