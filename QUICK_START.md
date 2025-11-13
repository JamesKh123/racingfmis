# Quick Reference Guide

## Project Overview

**Typing Racer** is a complete, production-ready multiplayer typing racing game built with Next.js, Supabase, and Tailwind CSS. This scaffold includes all essential components, utilities, and configurations ready for deployment.

## 🚀 Get Started in 5 Minutes

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with Supabase credentials
cp .env.example .env.local
# Edit .env.local with your values

# 3. Run migrations in Supabase SQL Editor
# Copy & paste scripts/migrations.sql

# 4. Start dev server
npm run dev

# 5. Open http://localhost:3000
```

## 📁 File Structure Reference

### Pages (App Router)
| File | Purpose |
|------|---------|
| `app/page.tsx` | Landing page with Create/Join buttons |
| `app/create.tsx` | Create room with text selection |
| `app/join.tsx` | Join room by code |
| `app/join/[code]/page.tsx` | Main race room with typing area |
| `app/layout.tsx` | Root layout with metadata |

### Components
| Component | Props | Purpose |
|-----------|-------|---------|
| `TypingArea` | `text`, `isActive`, `onProgressChange`, `onComplete` | Main typing input with character-level validation |
| `PlayerTrack` | `playerName`, `progressPercent`, `wpm`, `isFinished` | Individual player racing track with car emoji |
| `Leaderboard` | `participants`, `isLive` | Rankings sorted by WPM |
| `Countdown` | `isVisible`, `onComplete` | 3-2-1-Go countdown sequence |

### Hooks
| Hook | Returns | Purpose |
|------|---------|---------|
| `useRoomRealtime` | `{channel, isConnected, broadcast, on}` | Subscribe to Supabase Realtime channel |

### Utilities
| Module | Functions | Purpose |
|--------|-----------|---------|
| `lib/supabase.ts` | `supabase`, types | Supabase client & TypeScript types |
| `lib/wpm.ts` | `computeWPM`, `computeAccuracy`, `computeNetWPM`, `getPlayerStats` | WPM calculations (tested) |
| `lib/utils.ts` | `generateRoomCode`, `sanitizeCustomText`, `isKhmerText` | Helpers for text & rooms |

### Tests
| File | Coverage |
|------|----------|
| `tests/wpm.test.ts` | WPM formula, accuracy, edge cases |

### Database
| Table | Columns | Purpose |
|-------|---------|---------|
| `rooms` | id, code, creator_id, status, custom_text, max_players | Room metadata |
| `room_players` | id, room_id, display_name, correct_chars, wpm, accuracy, progress_percent | Player progress & stats |
| `texts` | id, language, title, content, length_chars | Text library |
| `matches_history` | id, room_id, ranking, summary_json, created_at | Race archives |

## 🎯 Key Implementations

### Strict Typing System
- Character-by-character validation
- Current word highlighted in blue
- Red underline for errors
- Prevents space advance until word matches exactly

### WPM Calculation
```typescript
WPM = (correct_chars / 5) / (elapsed_seconds / 60)
Accuracy = (correct_chars / total_chars_typed) * 100
```

### Real-time Events (Supabase Channel: `room:{code}`)
- `join` / `leave` - Player joined/left
- `update_progress` - Throttled stats (250-500ms)
- `start_countdown` / `start_race` - Race controls
- `finish` / `final_results` - Game end

### Responsive Design
- Mobile-first Tailwind CSS
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Dark mode support with `dark:` classes
- Accessible ARIA labels

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Tailwind CSS
- Extended config in `tailwind.config.js`
- Custom fonts: Noto Sans, Noto Sans Khmer
- Custom animations: `blink`, `pulse-car`
- Color palette fully customizable

## 📊 Database Indexes

All tables have performance indexes:
- `idx_rooms_code` - Fast room lookups
- `idx_room_players_room_id` - Fast player queries
- `idx_room_players_wpm` - Leaderboard sorting

## 🧪 Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Test coverage
npm run test -- --coverage
```

Test cases verify:
- ✅ WPM formula accuracy
- ✅ Accuracy percentage calculation
- ✅ Net WPM with mistake penalties
- ✅ Edge cases (zero time, no characters)

## 🚢 Deployment

### To Vercel
```bash
# Already configured in vercel.json
# Just push to GitHub, Vercel auto-deploys

git push origin main
```

### Database Setup
1. Run `scripts/migrations.sql` in Supabase SQL Editor
2. Enable Realtime for broadcast tables
3. Set CORS policy to your domain

See `DEPLOYMENT.md` for complete guide.

## 🎨 Customization

### Add Custom Text
Edit `app/create.tsx` `SAMPLE_TEXTS` array:
```typescript
{
  id: 'custom-1',
  language: 'en',
  title: 'My Title',
  content: 'Your text here...',
}
```

### Change Max Players
Default: 20 (configurable in room creation)
Max allowed: 20 (hardcoded in DB constraint)

### Update Colors
Tailwind classes in components. Example:
```tsx
// Change primary color from blue to purple
className="bg-blue-600" → className="bg-purple-600"
```

## 🔐 Security Features

✅ **Input Validation**
- Text sanitization in `lib/utils.ts`
- Room code validation

✅ **SQL Safety**
- Parameterized queries via Supabase
- No raw SQL queries

✅ **Rate Limiting**
- Ready for middleware (Vercel)
- Implement in `/middleware.ts`

✅ **Database Security**
- RLS policies configured
- Public read, authenticated write (MVP)

## 📈 Performance Tips

1. **Minimize Re-renders**
   - Use `React.memo()` for components
   - `useCallback()` for event handlers

2. **Optimize Images**
   - Use Next.js `Image` component
   - Automatic optimization on Vercel

3. **Database**
   - Connection pooling enabled
   - Indexes on all frequently queried columns

4. **Client Updates**
   - Progress sent every 250-500ms (configurable)
   - Only send changed fields

## 🐛 Debugging

### Enable Debug Logging
```typescript
// In useRoomRealtime.ts, add:
console.log('Broadcast:', type, payload);
```

### Supabase Console
- View real-time logs: Dashboard → Logs
- Query stats: Reports → Queries
- Connection monitoring: Database → Monitor

### Browser DevTools
- Network tab: Check Realtime messages
- Console: Supabase client errors
- React DevTools: Component hierarchy

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Framer Motion](https://www.framer.com/motion/introduction/)

## 🎓 Architecture Decisions

1. **Next.js App Router** - Modern, server components ready
2. **Supabase Realtime** - Simpler than WebSockets, built-in auth
3. **Client-side Typing** - Instant feedback, no network latency
4. **Tailwind CSS** - Utility-first, highly customizable
5. **Framer Motion** - Lightweight animations, great DX

## 🔮 Future Enhancements

- [ ] Supabase Auth integration
- [ ] User profiles & authentication
- [ ] Game statistics & history
- [ ] Friend leaderboards
- [ ] Custom game modes
- [ ] Sound effects
- [ ] Mobile app (React Native)
- [ ] API for integrations

## 📞 Support & Issues

- **Deployment Help**: See `DEPLOYMENT.md`
- **WPM Formula Questions**: Check `lib/wpm.ts` comments
- **Component Props**: Each component has TypeScript interfaces
- **Database Questions**: See `scripts/migrations.sql` comments

## ✨ Next Steps

1. Install dependencies: `npm install`
2. Setup Supabase (see Quick Start)
3. Run `npm run dev`
4. Create a room and invite friends!
5. Deploy to Vercel when ready

---

**Built with ❤️ for fast typists everywhere 🏁**
