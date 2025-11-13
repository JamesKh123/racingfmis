#!/usr/bin/env node
/*
  Simple demo script to create a room and a creator player in Supabase.
  Usage: node scripts/create_demo_room.js "Creator Name"

  It uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from env.
*/
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function generateRoomCode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const digits = '0123456789'
  const part1 = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('')
  const part2 = Array.from({ length: 3 }, () => digits[Math.floor(Math.random() * digits.length)]).join('')
  return part1 + part2
}

async function main() {
  const creatorName = process.argv[2] || 'DemoCreator'
  const roomCode = generateRoomCode()

  console.log(`Creating demo room ${roomCode} (creator: ${creatorName})`)

  try {
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .insert({
        code: roomCode,
        creator_id: 'demo',
        status: 'waiting',
        custom_text: 'This is a demo race. Have fun!',
        max_players: 20,
      })
      .select()
      .single()

    if (roomError) throw roomError

    const { data: player, error: playerError } = await supabase
      .from('room_players')
      .insert({
        room_id: room.id,
        display_name: creatorName,
        user_id: 'demo',
        joined_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (playerError) throw playerError

    console.log('Demo room created:')
    console.log(`  Code: ${roomCode}`)
    console.log(`  Room ID: ${room.id}`)
    console.log(`  Creator player ID: ${player.id}`)
    console.log(`Open /join and enter code ${roomCode} to join.`)
  } catch (err) {
    console.error('Failed to create demo room:', err.message || err)
    process.exit(1)
  }
}

main()
