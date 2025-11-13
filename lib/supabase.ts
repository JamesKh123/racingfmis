import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string
          code: string
          creator_id: string
          created_at: string
          status: 'waiting' | 'running' | 'finished'
          text_id: string | null
          custom_text: string | null
          max_players: number
          started_at: string | null
          ended_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['rooms']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['rooms']['Row']>
      }
      room_players: {
        Row: {
          id: string
          room_id: string
          user_id: string | null
          display_name: string
          avatar_url: string | null
          joined_at: string
          finished_at: string | null
          correct_chars: number
          total_chars_typed: number
          mistakes: number
          wpm: number | null
          accuracy: number | null
          progress_percent: number
        }
        Insert: Omit<Database['public']['Tables']['room_players']['Row'], 'id' | 'joined_at'>
        Update: Partial<Database['public']['Tables']['room_players']['Row']>
      }
      texts: {
        Row: {
          id: string
          language: 'en' | 'km'
          title: string
          content: string
          length_chars: number
          created_by: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['texts']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['texts']['Row']>
      }
      matches_history: {
        Row: {
          id: string
          room_id: string
          ranking: Record<string, unknown>
          summary_json: Record<string, unknown> | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['matches_history']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['matches_history']['Row']>
      }
    }
  }
}
