'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-md"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="text-blue-600">Typing</span>{' '}
            <span className="text-orange-500">Racer</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-2xl">
            Race against up to 20 players in real-time. Test your typing speed and accuracy!
          </p>
        </motion.div>

        {/* Main CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-6 mb-12"
        >
          <Link href="/create">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg">
              🎮 Create Game
            </button>
          </Link>

          <Link href="/join">
            <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg">
              🚀 Join Game
            </button>
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 max-w-4xl w-full"
        >
          {[
            {
              icon: '⚡',
              title: 'Real-time Racing',
              desc: 'Compete with up to 20 players simultaneously',
            },
            {
              icon: '📊',
              title: 'Detailed Stats',
              desc: 'Track WPM, accuracy, mistakes, and more',
            },
            {
              icon: '🌍',
              title: 'Multilingual',
              desc: 'Support for English and Khmer text',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center text-slate-600 dark:text-slate-400"
        >
          <p className="mb-4">Built with Next.js, Supabase, and Tailwind CSS</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:text-blue-600">
              GitHub
            </a>
            <a href="#" className="hover:text-blue-600">
              Docs
            </a>
            <a href="#" className="hover:text-blue-600">
              About
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
