# Fit Starter — Next.js + Simple Admin CMS

This starter repo provides:
- A Next.js frontend (homepage, workout grid, workout page)
- Minimal API routes (mock data) for workouts and Stripe checkout
- A simple Admin UI under `/admin` to create and list workouts (mock; stores to JSON file)
- Instructions to run locally

## Run locally

1. Install deps:
```
npm install
```

2. Create a `.env.local` file in project root with these variables:
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_YOURKEY
STRIPE_SUCCESS_URL=http://localhost:3000/success
STRIPE_CANCEL_URL=http://localhost:3000/
```

3. Start dev server:
```
npm run dev
```

## Notes
- This is a starter scaffold. Video hosting, secure uploads, signed URLs, and production Stripe webhooks should be implemented before a public launch.
- Admin UI is intentionally simple and writes to a local `data/workouts.json` file for demonstration. Replace with a real DB (Supabase/Postgres) for production.



## Supabase & Deployment Guide

### Required environment variables

For local development create a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=pk.your_anon_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=pk.your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key # keep secret; server-only
STRIPE_SECRET_KEY=sk_test_yourkey
STRIPE_SUCCESS_URL=http://localhost:3000/success
STRIPE_CANCEL_URL=http://localhost:3000/
```

### Using Supabase

1. Create a Supabase project at https://app.supabase.com.
2. Go to the SQL editor and run the migration `supabase/migrations/001_create_workouts_table.sql`.
3. Get your `anon` and `service_role` keys from Project Settings > API.
4. Add the keys to `.env.local` for local testing. Never expose the `service_role` key in client-side code.

### Deploying to Vercel

1. Push the repo to GitHub.
2. Import project in Vercel and link your GitHub repo.
3. Add the environment variables in Vercel dashboard (use secrets for keys).
4. Set up Supabase production DB and run migrations there.

### Notes on security

- Protect `/api/admin/*` routes behind server-side auth or middleware. The example uses the service role key for simplicity — in production you should validate admin sessions and restrict access.
- Use signed URLs for private video streaming (Mux or CloudFront) and never expose raw S3 buckets.
