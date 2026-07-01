# CarMatch - Smart Car Shortlist Builder

A full-stack web app for the CarDekho Group AI-native take-home assignment. It helps a confused buyer move from a rough brief to a ranked, explainable shortlist of Indian-market cars.

## Quick Start

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## What It Does

1. Guided preference wizard for budget, seating, body type, fuel type, and ranking priorities.
2. Plain-English buyer note parsing for quick prompts like "family SUV under 15 lakh with good safety".
3. Backend scoring engine that ranks cars and explains why each match fits.
4. Cookie-backed shortlist with a 5-car limit.
5. Side-by-side comparison for 2-3 saved cars with winner highlights.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 + TypeScript |
| Styling | Tailwind CSS v4 |
| Database | SQLite + Prisma |
| Persistence | HTTP-only cookie session for shortlist |

## API Routes

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/cars` | GET | List seeded cars |
| `/api/recommend` | POST | Normalize preferences, score cars, return ranked matches |
| `/api/shortlist` | GET/POST/DELETE | Manage the user's shortlist |
| `/api/compare` | POST | Compare 2-3 selected cars |

## Product Notes

The assignment is intentionally open-ended, so I scoped for a complete buyer journey instead of a broad catalog clone. The scoring is rule-based rather than LLM-dependent, which keeps the demo deterministic and easy to run without API keys.

## Submission Checklist

- GitHub repo: publish this repository or invite the reviewers.
- Live URL: deploy to Vercel. You do not need to set `DATABASE_URL` — the app auto-creates a SQLite database in `/tmp` on first request and seeds it with car data.
- Screen recording: show the flow from buyer brief to recommendations, shortlist, and comparison.
