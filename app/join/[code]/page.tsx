'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useRoomRealtime } from '@/hooks/useRoomRealtime'
import { TypingArea } from '@/components/TypingArea'
import { PlayerTrack } from '@/components/PlayerTrack'
import { Leaderboard } from '@/components/Leaderboard'
import { Countdown } from '@/components/Countdown'
import { computeWPM, computeAccuracy } from '@/lib/wpm'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface Player {
  id: string
  displayName: string
  progressPercent: number
  correctChars: number
  totalCharsTyped: number
  mistakes: number
  wpm?: number
  accuracy?: number
  finishedAt?: string
  isFinished: boolean
}

interface RoomState {
  id: string
  code: string
  status: 'waiting' | 'running' | 'finished'
  customText: string
  creatorId: string
  startedAt?: string
}

type RaceStatus = 'waiting' | 'countdown' | 'racing' | 'finished'

export default function RoomPage() {
  const params = useParams()
  const roomCode = (params?.code as string) || ''

  const [room, setRoom] = useState<RoomState | null>(null)
  const [players, setPlayers] = useState<Map<string, Player>>(new Map())
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [raceStatus, setRaceStatus] = useState<RaceStatus>('waiting')
  const [countdownVisible, setCountdownVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { isConnected, broadcast } = useRoomRealtime(roomCode)

  // Load room data
  useEffect(() => {
    const loadRoom = async () => {
      try {
        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select()
          .eq('code', roomCode)
          .single()

        if (roomError || !roomData) {
          throw new Error('Room not found')
        }

        setRoom({
          id: roomData.id,
          code: roomData.code,
          status: roomData.status,
          customText: roomData.custom_text || '',
          creatorId: roomData.creator_id,
          startedAt: roomData.started_at,
        })

        // Load players
        const { data: playerData, error: playerError } = await supabase
          .from('room_players')
          .select()
          .eq('room_id', roomData.id)

        if (playerError) throw new Error('Failed to load players')

        const playerMap = new Map<string, Player>()
        playerData?.forEach((p) => {
          playerMap.set(p.id, {
            id: p.id,
            displayName: p.display_name,
            progressPercent: p.progress_percent,
            correctChars: p.correct_chars,
            totalCharsTyped: p.total_chars_typed,
            mistakes: p.mistakes,
            wpm: p.wpm,
            accuracy: p.accuracy,
            finishedAt: p.finished_at,
            isFinished: !!p.finished_at,
          })
        })
        setPlayers(playerMap)
        setCurrentPlayer(playerMap.values().next().value || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load room')
      } finally {
        setLoading(false)
      }
    }

    loadRoom()
  }, [roomCode])

  // Handle start race
  const handleStartRace = useCallback(() => {
    if (!room) return
    setCountdownVisible(true)
    broadcast('start_countdown', { at: new Date().toISOString() })

    setTimeout(() => {
      setRaceStatus('racing')
      setCountdownVisible(false)
      broadcast('start_race', { started_at: new Date().toISOString() })
    }, 4000)
  }, [room, broadcast])

  // Handle progress update
  const handleProgressChange = useCallback(
    (progress: { correctChars: number; totalCharsTyped: number; mistakes: number; progressPercent: number }) => {
      if (!currentPlayer) return

      const updatedPlayer: Player = {
        ...currentPlayer,
        ...progress,
      }

      setCurrentPlayer(updatedPlayer)

      const playerMap = new Map(players)
      playerMap.set(currentPlayer.id, updatedPlayer)
      setPlayers(playerMap)

      // Broadcast progress update
      broadcast('update_progress', {
        playerId: currentPlayer.id,
        ...progress,
      })

      // Update Supabase
      supabase
        .from('room_players')
        .update({
          correct_chars: progress.correctChars,
          total_chars_typed: progress.totalCharsTyped,
          mistakes: progress.mistakes,
          progress_percent: progress.progressPercent,
        })
        .eq('id', currentPlayer.id)
        .then()
        .catch(console.error)
    },
    [currentPlayer, players, broadcast]
  )

  // Handle race completion
  const handleComplete = useCallback(() => {
    if (!currentPlayer || !room) return

    const elapsed = room.startedAt
      ? (new Date().getTime() - new Date(room.startedAt).getTime()) / 1000
      : 0
    const wpm = computeWPM(currentPlayer.correctChars, elapsed)
    const accuracy = computeAccuracy(currentPlayer.correctChars, currentPlayer.totalCharsTyped)

    const finishedPlayer: Player = {
      ...currentPlayer,
      wpm,
      accuracy,
      isFinished: true,
      finishedAt: new Date().toISOString(),
    }

    setCurrentPlayer(finishedPlayer)

    const playerMap = new Map(players)
    playerMap.set(currentPlayer.id, finishedPlayer)
    setPlayers(playerMap)

    // Broadcast finish
    broadcast('finish', {
      playerId: currentPlayer.id,
      wpm,
      accuracy,
      finishedAt: new Date().toISOString(),
    })

    // Update Supabase
    supabase
      .from('room_players')
      .update({
        wpm,
        accuracy,
        finished_at: new Date().toISOString(),
      })
      .eq('id', currentPlayer.id)
      .then()
      .catch(console.error)
  }, [currentPlayer, room, players, broadcast])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p>Loading race...</p>
        </div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error || 'Room not found'}</p>
          <a href="/" className="text-blue-600 hover:underline">
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  const isCreator = room.creatorId === 'anonymous' // Simplified for demo
  const sortedPlayers = Array.from(players.values()).sort(
    (a, b) => (b.wpm || 0) - (a.wpm || 0)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <Countdown
        isVisible={countdownVisible}
        onComplete={() => setCountdownVisible(false)}
      />

      <div className="max-w-6xl mx-auto py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">Race: {room.code}</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Status: <span className="font-semibold capitalize">{raceStatus}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            {!isConnected && (
              <div className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                📡 Reconnecting...
              </div>
            )}
            {isCreator && raceStatus === 'waiting' && (
              <button
                onClick={handleStartRace}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
              >
                🚀 Start Race
              </button>
            )}
          </div>
        </motion.div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Typing area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-lg font-bold mb-4">✍️ Type Here</h2>
            <div
              className={clsx(
                'p-4 rounded-lg bg-slate-50 dark:bg-slate-900 min-h-32 focus:outline-none focus:ring-2 focus:ring-blue-500',
                raceStatus === 'racing' ? 'ring-blue-400' : 'ring-slate-300'
              )}
            >
              {raceStatus === 'waiting' ? (
                <p className="text-slate-600 dark:text-slate-400 text-center">
                  Waiting for race to start... 🏁
                </p>
              ) : (
                <TypingArea
                  text={room.customText}
                  isActive={raceStatus === 'racing'}
                  onProgressChange={handleProgressChange}
                  onComplete={handleComplete}
                />
              )}
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Leaderboard
              participants={sortedPlayers}
              isLive={raceStatus !== 'finished'}
            />
          </motion.div>
        </div>

        {/* Player tracks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6"
        >
          <h2 className="text-lg font-bold mb-4">🏁 Race Track</h2>
          <div className="space-y-2">
            {sortedPlayers.map((player) => (
              <PlayerTrack
                key={player.id}
                playerName={player.displayName}
                progressPercent={player.progressPercent}
                wpm={player.wpm}
                isFinished={player.isFinished}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
