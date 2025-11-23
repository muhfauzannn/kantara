# Kantara - Deployment Guide

## Prerequisites

- Vercel account
- PostgreSQL database (Neon, Supabase, or Vercel Postgres)
- Gemini API key

## Deployment Steps

### 1. Setup Database

Choose one of these options:

- **Neon** (Recommended): https://neon.tech
- **Supabase**: https://supabase.com
- **Vercel Postgres**: https://vercel.com/storage/postgres

### 2. Get Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
DATABASE_URL="postgresql://..." # For Prisma with connection pooling
DIRECT_URL="postgresql://..."    # For migrations (direct connection)
GEMINI_API_KEY="your-key"
```

### 3. Deploy to Vercel

#### Option A: Via Vercel CLI

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

#### Option B: Via Vercel Dashboard

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `GEMINI_API_KEY`
4. Deploy

### 4. Run Migrations

After deployment, run migrations in Vercel dashboard terminal or locally:

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy

# Seed database (optional)
pnpm db:seed
```

## Important Notes

- **Prisma**: Client is generated automatically on build (`postinstall` script)
- **Database**: Use connection pooling URL for `DATABASE_URL`
- **Environment**: Never commit `.env` file
- **API Keys**: Add all keys in Vercel project settings

## Environment Variables Required

| Variable         | Description                                   | Required |
| ---------------- | --------------------------------------------- | -------- |
| `DATABASE_URL`   | PostgreSQL connection string with pooling     | Yes      |
| `DIRECT_URL`     | Direct PostgreSQL connection (for migrations) | Yes      |
| `GEMINI_API_KEY` | Google Gemini API key                         | Yes      |

## Support

For issues during deployment:

1. Check Vercel build logs
2. Verify environment variables
3. Test database connection
4. Check Prisma generation logs
