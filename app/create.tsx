'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
// Supabase will be dynamically imported in handlers to avoid server build-time errors when env vars are missing
import { generateRoomCode, sanitizeCustomText, isKhmerText } from '@/lib/utils'
import { motion } from 'framer-motion'

// Sample texts
const SAMPLE_TEXTS = [
  {
    id: 'en-1',
    language: 'en',
    title: 'The Future of Technology',
    content:
      'Technology continues to evolve at an unprecedented pace. From artificial intelligence to quantum computing, innovation is reshaping every aspect of our lives. The future promises even more exciting breakthroughs.',
  },
  {
    id: 'en-2',
    language: 'en',
    title: 'Nature\'s Beauty',
    content:
      'The natural world offers endless inspiration and beauty. Majestic mountains, serene forests, and vast oceans remind us of the wonder and complexity of our planet. Protecting these environments is crucial for future generations.',
  },
  {
    id: 'km-1',
    language: 'km',
    title: 'ខ្មែរ សម្រស់ និង ឱយន៍',
    content:
      'ប្រទេសកម្ពុជាមានប្រវត្តិសាស្រ្ត ដ៏សម្បូរបែប។ មន្ទីរប្រាសាទ អង្គរ វត្ត ដែលជា ដ៍ឡាយ វិស្ម័យ នៃលោក។ វប្បធម៌ខ្មែរ គឺមាន ឋានៈ ខ្ពស់នៅលើពិភពលោក។',
  },
]

export default function CreateGame() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [customText, setCustomText] = useState('')
  const [selectedText, setSelectedText] = useState('')
  const [maxPlayers, setMaxPlayers] = useState(20)
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { getSupabase } = await import('../lib/getSupabase')
      const { supabase } = await getSupabase()
      const roomCode = generateRoomCode()
      let textContent = selectedText

      // Use custom text if provided
      if (customText.trim()) {
        textContent = sanitizeCustomText(customText)
      }

      // Create room
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .insert({
          code: roomCode,
          creator_id: 'anonymous', // In real app, use authenticated user
          status: 'waiting',
          custom_text: textContent,
          max_players: maxPlayers,
        })
        .select()
        .single()

      if (roomError || !room) {
        throw new Error('Failed to create room')
      }

      // Create room player entry for creator
      await supabase.from('room_players').insert({
        room_id: room.id,
        display_name: displayName || 'Creator',
        user_id: 'anonymous',
        joined_at: new Date().toISOString(),
      })

      // Redirect to room
      router.push(`/join/${roomCode}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create room'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">🎮 Create Game</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Set up your typing race and invite players
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleCreateRoom}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 space-y-6"
        >
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded">
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
              placeholder="Enter your display name"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Max Players */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Max Players: {maxPlayers}
            </label>
            <input
              type="range"
              min="2"
              max="20"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Set room capacity from 2 to 20 players
            </p>
          </div>

          {/* Sample Texts */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Choose Text or Paste Custom
            </label>
            <div className="grid grid-cols-1 gap-2 mb-4">
              {SAMPLE_TEXTS.map((text) => (
                <button
                  key={text.id}
                  type="button"
                  onClick={() => {
                    setSelectedText(text.content)
                    setCustomText('')
                  }}
                  className={`p-3 rounded-lg text-left transition ${
                    selectedText === text.content
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <div className="font-semibold text-sm">{text.title}</div>
                  <div className="text-xs opacity-75 truncate">
                    {text.content.slice(0, 60)}...
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Text */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Or Paste Custom Text (Optional)
            </label>
            <textarea
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value)
                if (e.target.value.trim()) setSelectedText('')
              }}
              placeholder="Paste your custom text here... (supports Khmer and English)"
              rows={4}
              maxLength={50000}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-khmer"
            />
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {customText.length}/50000 characters
            </p>
          </div>

          {/* Create Button */}
          <button
            type="submit"
            disabled={loading || (!selectedText && !customText)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-lg transition"
          >
            {loading ? 'Creating Room...' : '🚀 Create Room'}
          </button>
        </motion.form>
      </div>
    </div>
  )
}
