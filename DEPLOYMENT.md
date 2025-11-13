# Deployment Guide

Complete guide for deploying Typing Racer to production.

## Prerequisites

- GitHub account with the repository
- Supabase account (https://supabase.com)
- Vercel account (https://vercel.com)
- Node.js 18+ installed locally

## Step 1: Supabase Setup

### Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New project"
3. Fill in project details:
   - Name: `typing-racer` (or your preference)
   - Database Password: Create a strong password
   - Region: Choose closest to your users
4. Wait for database to initialize (~2 minutes)

### Get API Keys

1. Navigate to Project Settings → API
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** (public) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

### Run Database Migrations

1. Go to SQL Editor in Supabase
2. Click "New query"
3. Copy entire contents of `scripts/migrations.sql`
4. Paste into SQL editor
5. Click "Run"
6. Verify all tables created successfully

### Enable Realtime

1. Go to Realtime in Supabase dashboard
2. Click "Manage publications"
3. Enable replication for tables:
   - `rooms`
   - `room_players`
   - `matches_history`
4. Ensure Realtime is active in project settings

## Step 2: GitHub Setup

### Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `typing-racer`
3. Description: "Multiplayer typing racing game"
4. Choose Public or Private
5. Skip initializing with README (you have one)
6. Click "Create repository"

### Push Code to GitHub

```bash
cd /path/to/typing-racer
git init
git add .
git commit -m "Initial commit: Typing Racer MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/typing-racer.git
git push -u origin main
```

## Step 3: Vercel Deployment

### Import Project to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import GitHub repository
   - Select your `typing-racer` repo
   - Click "Import"

### Configure Environment Variables

After clicking "Import", you'll see environment variables form:

Add these variables:
```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_service_role_key
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
```

**Important**: 
- Replace values with your actual Supabase credentials
- Keep `NEXT_PUBLIC_` prefix for client-side variables
- Service role key should NOT have `NEXT_PUBLIC_` (server-only)

### Deploy

1. Click "Deploy"
2. Wait for build to complete (~3-5 minutes)
3. Once deployed, you'll get a live URL

### Verify Deployment

- Click the deployment URL
- Test landing page loads
- Try creating a room
- Check browser console for errors

## Step 4: Supabase Production Configuration

### Set CORS Policy

1. In Supabase, go to Settings → API
2. Under "CORS", add your Vercel domain:
   ```
   https://your-domain.vercel.app
   ```

### Update RLS Policies (Optional)

For MVP, basic policies are in place. For production, consider:

1. Implement Supabase Auth
2. Tighten RLS policies to user ownership
3. Add rate limiting

Example restricted policy:
```sql
CREATE POLICY "Only authenticated users can insert" 
ON room_players 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);
```

### Set Up Database Backups

1. Go to Project Settings → Backups
2. Configure automated backups (recommended daily)

## Step 5: Custom Domain (Optional)

### Connect Custom Domain

1. In Vercel, go to Settings → Domains
2. Add your custom domain (e.g., `typing-racer.com`)
3. Follow DNS configuration instructions
4. Update Supabase CORS to include your domain

### Enable HTTPS

Vercel automatically provides SSL certificates for:
- `your-domain.vercel.app` (automatic)
- Custom domains (automatic after DNS setup)

## Step 6: Monitoring & Maintenance

### Set Up Error Tracking

```bash
npm install @sentry/nextjs
```

Configure Sentry for error tracking:
1. Create account at https://sentry.io
2. Add `SENTRY_AUTH_TOKEN` to Vercel environment
3. Initialize in `app/layout.tsx`

### Monitor Database Performance

1. In Supabase, go to Reports
2. Monitor:
   - Active connections
   - Query performance
   - Storage usage

### View Logs

**Vercel Logs**:
- Function logs: Vercel Dashboard → Logs
- Real-time: `vercel logs` CLI

**Supabase Logs**:
- Go to Logs in Supabase dashboard
- Filter by function/table

## Scaling Considerations

### For 1,000+ Concurrent Users

1. **Database Connection Pooling**
   - Supabase: Go to Database settings → Connection pooling
   - Set to "Transaction" mode for Next.js

2. **Enable Caching**
   - Configure Vercel Edge Caching
   - Cache text library queries

3. **Rate Limiting**
   - Implement with Vercel middleware
   - Limit room creates to 10/minute per IP

4. **CDN Optimization**
   - Enable Image Optimization (Vercel)
   - Compress static assets

### Database Optimization

```sql
-- Add these indexes for large datasets
CREATE INDEX idx_room_players_finished ON room_players(finished_at);
CREATE INDEX idx_room_players_wpm ON room_players(wpm DESC);
CREATE INDEX idx_matches_created ON matches_history(created_at DESC);
```

## Troubleshooting

### Environment Variables Not Loading

1. Check Vercel Settings → Environment Variables
2. Redeploy after adding variables
3. Verify no typos in variable names

### Database Connection Errors

```
"Error: Permission denied"
→ Check CORS policy in Supabase
→ Verify service role key is correct
```

### Realtime Not Working

```
"Channel subscription failed"
→ Go to Supabase Realtime tab
→ Enable replication for tables
→ Check CORS origin matches your domain
```

### WPM Calculations Off

1. Run `npm run test` locally
2. Verify elapsed time calculation
3. Check timezone handling

## Security Checklist

- ✅ Never commit `.env.local` (use `.env.example`)
- ✅ Rotate API keys regularly
- ✅ Keep dependencies updated: `npm audit fix`
- ✅ Enable HTTPS everywhere
- ✅ Implement rate limiting
- ✅ Sanitize user inputs (already done in `utils.ts`)
- ✅ Use Supabase RLS policies
- ✅ Enable 2FA on Supabase/Vercel accounts

## Continuous Deployment

### Auto-Deploy on GitHub Push

Already configured! When you push to `main`:

1. GitHub webhook triggers Vercel
2. Vercel runs build process
3. Deployment runs automatically
4. URL stays the same

### Preview Deployments

Pull requests automatically get preview URLs:
1. Create PR on GitHub
2. Vercel builds and comments preview URL
3. Test before merging to main

## Rollback

If deployment has issues:

**Vercel Rollback**:
1. Go to Deployments
2. Find previous good deployment
3. Click "..." → "Redeploy"

**Database Rollback**:
1. Use Supabase backup from Settings → Backups
2. Request restore from specific point in time

## Performance Targets

Aim for:
- ⚡ Lighthouse score: 90+
- 🚀 Time to First Byte: <500ms
- 📊 Database query time: <100ms
- 🏁 Real-time latency: <200ms

Monitor with:
- Vercel Analytics (automatic)
- Lighthouse: `npm run build && npm run start`

## Next Deployment Steps

After initial launch:

1. **Week 1**: Monitor error rates
2. **Week 2**: Analyze performance metrics
3. **Week 3**: Release v0.2 with auth
4. **Month 2**: Add game statistics
5. **Month 3**: Mobile app launch

## Support

For deployment issues:
- 📖 Vercel Docs: https://vercel.com/docs
- 📖 Supabase Docs: https://supabase.com/docs
- 💬 GitHub Issues: Submit details with error logs

---

**Happy deploying! 🚀**
