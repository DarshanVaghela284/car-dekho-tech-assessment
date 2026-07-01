# CarMatch — Smart Car Shortlist Builder

A full-stack web app that helps confused car buyers go from *"I don't know what to buy"* to a **confident shortlist** — built for the CarDekho Group AI-Native take-home assignment.

## Quick start (< 2 minutes)

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## What I built and why

**CarMatch** is a guided car finder with three core flows:

1. **Preference wizard** — budget, body type, fuel, seating, and priorities (mileage, safety, value, features, reviews)
2. **Ranked recommendations** — backend scoring engine ranks 35 Indian-market cars and explains *why* each fits
3. **Shortlist + compare** — save up to 5 cars, compare 2–3 side-by-side with winner highlights

**Why this scope:** The assignment brief is deliberately vague. I chose the highest-value path for a confused buyer: narrow options fast, explain the reasoning, and let them compare finalists. A chatbot or full catalog browser would eat the 2–3 hour budget without shipping end-to-end.

### What I deliberately cut

- User authentication (session cookie for shortlist is enough for MVP)
- Real CarDekho API / live pricing
- LLM API dependency (rule-based NL parser instead — works offline, no API keys)
- Pixel-perfect UI polish
- Comprehensive test suite (one scoring util could be added in +30 min)

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 + TypeScript | Full-stack in one repo, fast deploy |
| Styling | Tailwind CSS v4 | Rapid, clean UI |
| Database | SQLite + Prisma | Zero-config persistence, real backend |
| Deploy | Vercel-ready | `git push` → live |

## API routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/cars` | GET | List all cars |
| `/api/recommend` | POST | Score & rank cars by preferences |
| `/api/shortlist` | GET/POST/DELETE | Persist shortlist (cookie session) |
| `/api/compare` | POST | Side-by-side spec comparison |

## AI tools vs manual

| Task | Delegated to AI | Done manually |
|------|-----------------|---------------|
| Project scaffolding & boilerplate | ✅ Cursor | Reviewed structure |
| Car seed dataset | ✅ Generated 35 cars | Verified realistic Indian specs |
| Scoring algorithm design | ✅ Drafted | Reviewed weights & edge cases |
| UI components | ✅ Generated | Tweaked layout & copy |
| Product scoping | Manual | Chose wizard over chatbot |
| Prisma schema | ✅ Drafted | Verified relations |

**Where AI helped most:** Speed on boilerplate, seed data, and repetitive UI components.

**Where AI got in the way:** Initial `create-next-app` conflict with existing PDF; had to scaffold manually. Scoring edge cases (budget overflow, empty filters) needed manual review.

## If I had 4 more hours

- Shareable shortlist URL
- Playwright E2E test for wizard → results flow
- Turso/libSQL for production SQLite on Vercel
- OpenAI integration for richer NL preference parsing
- Re-sort results by price/mileage on results page

## Project structure

```
src/
  app/           # Pages + API routes
  components/    # CarCard, Header
  lib/           # Scoring engine, Prisma, types
prisma/
  schema.prisma  # Car, Shortlist models
  seed.ts        # 35 Indian-market cars
```

## License

MIT — built as a take-home assignment submission.
# car-dekho-tech-assessment
