# Developer Checklist ✓

Complete checklist for setting up and deploying Typing Racer.

## Pre-Development Setup

### Local Environment
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] VS Code or preferred editor ready
- [ ] GitHub account created
- [ ] Terminal/CLI comfortable

### Service Accounts
- [ ] Supabase account created (supabase.com)
- [ ] Vercel account created (vercel.com)
- [ ] GitHub account active

## Project Setup

### Initialize
- [ ] Clone/fork repository
- [ ] Run `npm install` (watch for errors)
- [ ] Verify all dependencies installed
- [ ] No peer dependency warnings

### Configuration
- [ ] Copy `.env.example` to `.env.local`
- [ ] Create Supabase project
- [ ] Get Supabase URL from Settings → API
- [ ] Get Anon Key from Settings → API
- [ ] Get Service Role Key from Settings → API
- [ ] Paste all three into `.env.local`
- [ ] Set `NEXT_PUBLIC_APP_URL=http://localhost:3000`

### Database
- [ ] Open Supabase SQL Editor
- [ ] Copy entire `scripts/migrations.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Verify all 4 tables created:
  - [ ] `rooms`
  - [ ] `room_players`
  - [ ] `texts`
  - [ ] `matches_history`
- [ ] Verify indexes created (6 total)
- [ ] Verify RLS policies created

### Supabase Features
- [ ] Navigate to Realtime
- [ ] Click "Manage publications"
- [ ] Enable replication for:
  - [ ] `rooms`
  - [ ] `room_players`
  - [ ] `matches_history`

## Local Development

### Start & Test
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Landing page loads
- [ ] No console errors

### Manual Testing
- [ ] Click "🎮 Create Game"
- [ ] Enter display name
- [ ] Select text or paste custom
- [ ] Click "🚀 Create Room"
- [ ] Room code generated
- [ ] Redirect to room page
- [ ] Open room in new tab/window
- [ ] Click "🚀 Join Game"
- [ ] Enter room code
- [ ] Enter different name
- [ ] Join succeeds
- [ ] Both windows show players

### Gameplay Testing
- [ ] As creator, click "Start Race"
- [ ] Countdown displays 3-2-1-Go
- [ ] Typing area becomes active
- [ ] Type in one window
- [ ] See characters highlighted in other window
- [ ] Backspace works
- [ ] Cannot advance until word matches exactly
- [ ] WPM calculation shows
- [ ] Accuracy updates in real-time
- [ ] Mistake count increments
- [ ] Player car animates on track
- [ ] Leaderboard updates

### Testing Suite
- [ ] Run `npm run test`
- [ ] All 15+ tests pass
- [ ] No warnings
- [ ] Coverage looks good
- [ ] Run `npm run test:watch` (Ctrl+C to exit)

### Build & Production Preview
- [ ] Run `npm run build`
- [ ] Build completes without errors
- [ ] Run `npm run start`
- [ ] Test locally at http://localhost:3000

## Code Quality

### TypeScript
- [ ] No `any` types introduced
- [ ] All components typed
- [ ] Props interfaces defined
- [ ] tsconfig.json strict mode

### Linting
- [ ] Run `npm run lint`
- [ ] No errors
- [ ] No warnings (or acceptable)

### Performance
- [ ] Lighthouse score 90+
- [ ] Time to First Byte < 500ms
- [ ] Database queries < 100ms
- [ ] Realtime latency < 200ms

## Git & GitHub

### Repository Setup
- [ ] GitHub repository created
- [ ] Repository URL noted
- [ ] Clone/push access confirmed

### Initial Commit
- [ ] Remove `.env.local` (never commit secrets!)
- [ ] `.env.local` in `.gitignore`
- [ ] Git initialized: `git init`
- [ ] Remote added: `git remote add origin <url>`
- [ ] All files staged: `git add .`
- [ ] Initial commit: `git commit -m "Initial commit"`
- [ ] Branch: `git branch -M main`
- [ ] Push: `git push -u origin main`

### Branching (Optional)
- [ ] Create feature branch: `git checkout -b feature/name`
- [ ] Make changes
- [ ] Commit changes
- [ ] Push branch
- [ ] Create Pull Request

## Vercel Deployment

### Project Creation
- [ ] Go to vercel.com
- [ ] Click "Add New Project"
- [ ] Select GitHub repository
- [ ] Import as Next.js project
- [ ] Click "Import"

### Environment Variables
Add to Vercel Project Settings:
- [ ] `NEXT_PUBLIC_SUPABASE_URL` = your_url
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your_key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = your_key
- [ ] `NEXT_PUBLIC_APP_URL` = your_vercel_url
- [ ] All values without quotes

### Deploy
- [ ] Click "Deploy" button
- [ ] Wait for build (3-5 minutes)
- [ ] Build succeeds (green checkmark)
- [ ] Visit deployment URL
- [ ] Test landing page loads
- [ ] Test create/join flow

### Production Testing
- [ ] Open deployed URL in two browsers
- [ ] Create room
- [ ] Join room from second browser
- [ ] Test full race flow
- [ ] Verify WPM calculations
- [ ] Check leaderboard updates
- [ ] All features working

### Enable Auto-Deploy
- [ ] GitHub Actions enabled
- [ ] Commits to `main` auto-deploy
- [ ] Check Deployments tab for history

## Supabase Production Config

### CORS Policy
- [ ] Go to Supabase Settings → API
- [ ] Add CORS origin: `https://your-vercel-url.vercel.app`
- [ ] Save settings

### Backups
- [ ] Navigate to Backups
- [ ] Enable automated backups (daily recommended)
- [ ] Test backup restore procedure

### Monitoring
- [ ] Enable project monitoring
- [ ] Set up usage alerts
- [ ] Note connection limits

### Security
- [ ] Review RLS policies
- [ ] Ensure no sensitive data exposed
- [ ] Test with anonymous user

## Documentation

### README Review
- [ ] All sections present
- [ ] Links working
- [ ] Code examples accurate
- [ ] Deployment steps clear

### DEPLOYMENT.md Completed
- [ ] Steps followed exactly
- [ ] All checks passed
- [ ] Troubleshooting relevant to your setup

### QUICK_START.md Useful
- [ ] File structure clear
- [ ] Components documented
- [ ] Database schema understandable

## Monitoring & Maintenance

### First Week
- [ ] Monitor error rates daily
- [ ] Check Supabase logs
- [ ] Review Vercel analytics
- [ ] Respond to any issues

### Weekly
- [ ] Review performance metrics
- [ ] Check for dependency updates
- [ ] Backup database manually
- [ ] Monitor storage usage

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Run security audit: `npm audit`
- [ ] Review analytics trends
- [ ] Plan new features

## Future Enhancements

### Phase 1 (Week 1-2)
- [ ] Add Supabase Auth
- [ ] User profiles
- [ ] Persistent stats

### Phase 2 (Week 3-4)
- [ ] Game history
- [ ] Friend system
- [ ] Replay mode

### Phase 3 (Month 2)
- [ ] Admin dashboard
- [ ] Text management
- [ ] Advanced stats

### Phase 4 (Month 3)
- [ ] Mobile app
- [ ] API endpoints
- [ ] Social features

## Troubleshooting Checklist

If things break:

### Development Issues
- [ ] Clear `.next` folder
- [ ] Restart dev server
- [ ] Check `.env.local` values
- [ ] Verify Supabase connection
- [ ] Run `npm install` again
- [ ] Check for TypeScript errors

### Database Issues
- [ ] Verify migrations ran
- [ ] Check Supabase logs
- [ ] Test SQL directly in SQL Editor
- [ ] Restore from backup if needed

### Deployment Issues
- [ ] Check build logs in Vercel
- [ ] Verify environment variables
- [ ] Test production build locally
- [ ] Check Vercel status page

### Real-time Issues
- [ ] Verify Realtime enabled in Supabase
- [ ] Check browser console
- [ ] Test connection status
- [ ] Review Supabase logs

## Success Criteria

You'll know it's working when:

✅ Landing page loads  
✅ Can create a room with custom text  
✅ Can join room with code  
✅ Countdown works  
✅ Typing enforces exact matching  
✅ Cars animate on tracks  
✅ WPM calculates correctly  
✅ Leaderboard updates live  
✅ All tests pass  
✅ Deployed to Vercel successfully  
✅ Production works like development  

## Final Sign-Off

- [ ] All checklist items completed
- [ ] No critical errors
- [ ] Ready for users
- [ ] Documentation complete
- [ ] Deployment verified
- [ ] Backups configured
- [ ] Monitoring active

---

**Congratulations! You've successfully deployed Typing Racer! 🎉🏁**

Questions? Check:
1. QUICK_START.md
2. README.md
3. DEPLOYMENT.md
4. IMPLEMENTATION_SUMMARY.md

Need help?
- GitHub Issues
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs

Happy racing! 🚀
