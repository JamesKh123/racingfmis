# Typing Racer 🏎️

A real-time multiplayer typing racing game built with **Next.js**, **Supabase**, and **Tailwind CSS**. Race against up to 20 players simultaneously while testing your typing speed and accuracy!

## Features

✨ **Core Features**
- 🎮 **Multiplayer Racing**: Compete with up to 20 players in real-time
- ⌨️ **Strict Typing**: Exact word matching required before advancing
- 📊 **Live Stats**: WPM, accuracy, mistakes, and character counts
- 🏁 **Leaderboard**: Live and final rankings with detailed stats
- 🌍 **Multilingual**: Support for English and Khmer text
- 🎨 **Modern UI**: Tailwind CSS with dark/light mode support
- ⚡ **Real-time Updates**: Supabase Realtime for instant synchronization
- 📱 **Responsive**: Works seamlessly on desktop and mobile

## Tech Stack

**Frontend**
- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [React 18](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [clsx](https://github.com/lukeed/clsx) - Utility for conditional classes

**Backend & Database**
- [Supabase](https://supabase.com/) - PostgreSQL database + Realtime API
- [Postgres](https://www.postgresql.org/) - SQL database

**Testing**
- [Jest](https://jestjs.io/) - Unit testing framework
- [React Testing Library](https://testing-library.com/react) - Component testing

**Deployment**
- [Vercel](https://vercel.com/) - Hosting and deployment

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier available)

### Installation

1. **Clone & install**
   ```bash
   git clone <repo>
   npm install
   ```

2. **Setup Supabase**
   - Create project at supabase.com
   - Copy `.env.example` to `.env.local` with your credentials
   - Run `scripts/migrations.sql` in Supabase SQL Editor

3. **Run locally**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

### Deployment to Vercel

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel settings
4. Deploy!

See [README.md](./README.md) for detailed docs.

## Project Structure

```
app/               # Next.js pages & layouts
components/        # React components (Typing, Leaderboard, etc)
hooks/            # Custom hooks (useRoomRealtime)
lib/              # Utilities (WPM calc, Supabase client)
styles/           # Tailwind CSS & globals
tests/            # Jest unit tests
scripts/          # Database migrations.sql
```

## Key Features Implemented

✅ **Multiplayer Rooms** - Create/join with unique room codes
✅ **Real-time Sync** - Supabase Realtime broadcasting
✅ **Strict Typing** - Exact word matching required
✅ **WPM Calculation** - Standard formula with unit tests
✅ **Live Leaderboard** - Rankings update every 500ms
✅ **Racing UI** - Animated car icons on tracks
✅ **Countdown** - 3-2-1-Go start sequence
✅ **Khmer Support** - Noto Sans Khmer fonts included
✅ **Responsive** - Mobile & desktop friendly
✅ **Accessibility** - Keyboard navigation, ARIA labels

## Database Schema

**rooms** - Room metadata and status
**room_players** - Player progress & stats (updated real-time)
**texts** - Text library (EN & KM)
**matches_history** - Finished race archives

See `scripts/migrations.sql` for full schema with indexes & RLS policies.

## WPM Formula

```
WPM = (correct_chars / 5) / (elapsed_seconds / 60)
Accuracy = (correct_chars / total_chars_typed) * 100
```

Example: 250 correct chars in 60 sec = 50 WPM

Unit tests verify all edge cases. Run: `npm run test`

## Real-time Events

Supabase broadcasts on channel `room:{code}`:
- `join`, `leave` - Player joined/left
- `update_progress` - Live stats (throttled 250-500ms)
- `start_countdown`, `start_race` - Race controls
- `finish`, `final_results` - End game events

## Performance

- Client-side typing state for instant feedback
- Throttled updates to minimize server load
- Hardware-accelerated animations (Framer Motion)
- Optimized re-renders with React.useCallback

## Security

- SQL injection prevention (parameterized queries)
- XSS protection (text sanitization)
- Room capacity validation (server-side)
- RLS policies configured in Supabase

## Next Steps

Enhance with:
- Supabase Auth for user profiles
- Game statistics & history
- More text varieties
- Sound effects
- Mobile app

## Support

- 📧 Issues: Use GitHub issues
- 📖 Docs: See detailed README
- 💬 Discussions: GitHub discussions

**Happy racing! 🏁**