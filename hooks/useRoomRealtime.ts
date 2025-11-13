import { useEffect, useCallback, useState } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface RoomEvent {
  type: 'join' | 'leave' | 'update_progress' | 'start_countdown' | 'start_race' | 'finish' | 'final_results'
  payload: Record<string, unknown>
}

export interface PlayerProgress {
  playerId: string
  correctChars: number
  totalCharsTyped: number
  mistakes: number
  progressPercent: number
}

export function useRoomRealtime(roomCode: string) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Subscribe to room channel
  useEffect(() => {
    if (!roomCode) return

    const roomChannel = supabase.channel(`room:${roomCode}`, {
      config: {
        broadcast: { self: true },
      },
    })

    roomChannel
      .on('broadcast', { event: '*' }, (payload) => {
        // Events will be handled by listeners
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
          setError(null)
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsConnected(false)
          setError('Connection lost')
        }
      })

    setChannel(roomChannel)

    return () => {
      supabase.removeChannel(roomChannel)
    }
  }, [roomCode])

  const broadcast = useCallback(
    (type: string, payload: Record<string, unknown>) => {
      if (!channel) return
      channel.send({
        type: 'broadcast',
        event: type,
        payload,
      })
    },
    [channel]
  )

  const on = useCallback(
    (event: string, callback: (payload: Record<string, unknown>) => void) => {
      if (!channel) return
      return channel.on('broadcast', { event }, ({ payload }) => {
        callback(payload)
      }).subscribe()
    },
    [channel]
  )

  return {
    channel,
    isConnected,
    error,
    broadcast,
    on,
  }
}
