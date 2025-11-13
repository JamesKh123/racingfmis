import { useEffect, useCallback, useState, useRef } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'

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
    let mounted = true
    let supabaseClient: any = null
    let roomChannel: RealtimeChannel | null = null

    ;(async () => {
      try {
        const mod = await import('../lib/getSupabase')
        const res = await mod.getSupabase()
        supabaseClient = res.supabase
        if (!supabaseClient || !supabaseClient.channel) {
          setError('Realtime not available')
          return
        }

        roomChannel = supabaseClient.channel(`room:${roomCode}`, {
          config: { broadcast: { self: true } },
        })

        roomChannel
          .on('broadcast', { event: '*' }, (payload) => {
            // Events will be handled by listeners
          })
          .subscribe((status) => {
            if (!mounted) return
            if (status === 'SUBSCRIBED') {
              setIsConnected(true)
              setError(null)
            } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
              setIsConnected(false)
              setError('Connection lost')
            }
          })

        if (mounted) {
          setChannel(roomChannel)
        }
      } catch (err) {
        setError((err as Error).message || 'Failed to initialize realtime')
      }
    })()

    return () => {
      mounted = false
      if (supabaseClient && roomChannel) {
        try {
          supabaseClient.removeChannel(roomChannel)
        } catch (e) {
          // ignore
        }
      }
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
