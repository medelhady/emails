# LeadRadar — Property Management Lead Generator

A Next.js 15 dashboard that finds US property management companies via Google Maps (Apify), scrapes their websites for emails, and saves everything to Supabase.

---

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Supabase** — PostgreSQL database
- **Apify** — Google Maps Scraper actor
- **Vercel** — deployment

---

## Setup

### 1. Clone & Install

```bash
git clone <your-repo>
cd lead-gen-dashboard
npm install
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-migration.sql`
3. Copy your **Project URL** and **anon key** from Settings → API

### 3. Apify

1. Sign up at [apify.com](https://apify.com)
2. Go to Settings → Integrations → API tokens
3. Copy your API token
4. The actor used is `nwua9Gu5YrADL7ZDj` (Google Maps Scraper) — no extra setup needed

### 4. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
APIFY_API_TOKEN=apify_api_xxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `APIFY_API_TOKEN`

The search API route is configured with a 300-second timeout via `vercel.json` (requires Vercel Pro for >60s).

---

## How It Works

1. **Search Form** — Enter keyword, city, state, and max results
2. **Apify** — Calls Google Maps Scraper actor, waits for results (polls every 5s)
3. **Email Scraper** — Visits each company's homepage, /contact, /about, /team pages and extracts emails with regex
4. **Deduplication** — Checks Supabase for existing emails/websites before inserting
5. **Dashboard** — Displays stats (total leads, emails, companies) and sortable/filterable table
6. **Export** — Downloads all leads as CSV

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── search/route.ts   # Main search + scrape + save
│   │   └── export/route.ts   # CSV export
│   ├── dashboard/page.tsx    # Main UI
│   └── layout.tsx
├── components/
│   ├── SearchForm.tsx
│   ├── LeadsTable.tsx
│   └── StatCard.tsx
├── lib/
│   ├── supabase.ts           # DB helpers
│   ├── apify.ts              # Google Maps scraper
│   └── scraper.ts            # Email extraction
└── types/index.ts
```

---

## Notes

- **Vercel timeout**: The search route can take 2–5 minutes. Vercel's free plan limits functions to 60s. Upgrade to Pro or use background jobs (e.g., Inngest, Trigger.dev) for production.
- **Rate limiting**: Add delays between website requests if you hit blocks.
- **Legal**: Only collect publicly available emails. Respect robots.txt and terms of service.
