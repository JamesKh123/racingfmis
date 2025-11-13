"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isValidRoomCode } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function JoinGame() {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const code = roomCode.toUpperCase().trim()

      if (!isValidRoomCode(code)) {
        throw new Error('Invalid room code format')
      }

      if (!displayName.trim()) {
        throw new Error('Please enter your name')
      }

      // Find room
      const { getSupabase } = await import('../../lib/getSupabase')
      const { supabase } = await getSupabase()

      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select()
        .eq('code', code)
        .single()

      if (roomError || !room) {
        throw new Error('Room not found')
      }

      // Check capacity
      const { data: players, error: playersError } = await supabase
        .from('room_players')
        .select()
        .eq('room_id', room.id)

      if (playersError) throw new Error('Failed to check room capacity')

      if (players && players.length >= room.max_players) {
        throw new Error(`Room is full (${room.max_players} players max)`)
      }

      // Join room
      await supabase.from('room_players').insert({
        room_id: room.id,
        display_name: displayName,
        user_id: 'anonymous',
        joined_at: new Date().toISOString(),
      })

      // Redirect to room
      router.push(`/join/${code}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to join room'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="max-w-md mx-auto py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold mb-2">🚀 Join Game</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Enter the room code to join a race
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleJoinRoom}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 space-y-4"
        >
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Display Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Your Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              maxLength={100}
              autoFocus
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Room Code */}
          <div>
            <label className="block text-sm font-semibold mb-2">Room Code</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="e.g., ABC123"
              maxLength={6}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-lg text-center"
            />
          </div>

          {/* Join Button */}
          <button
            type="submit"
            disabled={loading || !roomCode || !displayName}
            className="w-full py-3 mt-6 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-bold rounded-lg transition"
          >
            {loading ? 'Joining...' : '✅ Join Room'}
          </button>
        </motion.form>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-6"
        >
          <a href="/" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">
            ← Back to Home
          </a>
        </motion.div>
      </div>
    </div>
  )
}
