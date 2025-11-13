-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE room_status AS ENUM ('waiting', 'running', 'finished');
CREATE TYPE player_language AS ENUM ('en', 'km');

-- Create tables
CREATE TABLE texts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language player_language NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  length_chars INTEGER NOT NULL,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(6) UNIQUE NOT NULL,
  creator_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status room_status DEFAULT 'waiting',
  text_id UUID REFERENCES texts(id) ON DELETE SET NULL,
  custom_text TEXT,
  max_players INTEGER DEFAULT 20 CHECK (max_players > 0 AND max_players <= 20),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

CREATE TABLE room_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID,
  display_name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(512),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  correct_chars INTEGER DEFAULT 0,
  total_chars_typed INTEGER DEFAULT 0,
  mistakes INTEGER DEFAULT 0,
  wpm NUMERIC(6,2),
  accuracy NUMERIC(5,2),
  progress_percent NUMERIC(5,2) DEFAULT 0,
  UNIQUE(room_id, user_id, display_name)
);

CREATE TABLE matches_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  ranking JSONB NOT NULL,
  summary_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_rooms_code ON rooms(code);
CREATE INDEX idx_rooms_creator_id ON rooms(creator_id);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_room_players_room_id ON room_players(room_id);
CREATE INDEX idx_room_players_user_id ON room_players(user_id);
CREATE INDEX idx_matches_history_room_id ON matches_history(room_id);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic - can be further restricted)
CREATE POLICY "Rooms are viewable by anyone" ON rooms FOR SELECT USING (true);
CREATE POLICY "Users can create rooms" ON rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Rooms can be updated" ON rooms FOR UPDATE USING (true);

CREATE POLICY "Room players are viewable by anyone" ON room_players FOR SELECT USING (true);
CREATE POLICY "Users can join room" ON room_players FOR INSERT WITH CHECK (true);
CREATE POLICY "Room players can be updated" ON room_players FOR UPDATE USING (true);

CREATE POLICY "Texts are viewable by anyone" ON texts FOR SELECT USING (true);
CREATE POLICY "Users can create texts" ON texts FOR INSERT WITH CHECK (true);

CREATE POLICY "Matches history is viewable" ON matches_history FOR SELECT USING (true);
CREATE POLICY "Matches history can be created" ON matches_history FOR INSERT WITH CHECK (true);
