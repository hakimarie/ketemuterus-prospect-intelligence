# KetemuTerus Prospect Intelligence

Multi-client, multi-outlet intelligence workspace for discovering local ecosystems, evidence signals, partnership opportunities, and prospect pipelines.

## MVP

- Next.js + TypeScript
- Tailwind CSS
- Supabase-ready client
- Six Hands — PIM 3 pilot dashboard
- Mock prospect data for UI development
- Prospect database filtering
- Customer acquisition vs. brand partnership potential

## Product flow

**Discovery → Evidence → Opportunity → Pipeline**

The current UI intentionally uses mock data. Production discovery and enrichment will be connected to the dedicated Supabase project after the dashboard foundation is validated.

## Local setup

```bash
npm install
npm run dev
```

Optional environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
