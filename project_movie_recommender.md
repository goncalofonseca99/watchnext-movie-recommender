---
name: Movie Recommender App
description: Status and remaining work for the WatchNext movie recommender app built in ross-mike-workflows
type: project
---

App is built and running end-to-end. Both servers confirmed working with real API keys.

**Location:** `/Users/Goncalo/Downloads/ross-mike-workflows/`

**Stack:**
- Frontend: React + Vite at `client/` — runs on `http://localhost:5173`
- Backend: Node/Express at `server/` — runs on `http://localhost:3001`

**Start commands:**
- `npm run dev:server` (from root)
- `npm run dev:client` (from root)

**What's built and working:**
- 3-step movie input wizard (one movie per step, back button, progress dots)
- Claude API call (`claude-sonnet-4-6`) returns title, why_it_matches, imdb_score, where_to_watch
- TMDB API fetches movie poster + trailer YouTube key (`/search/movie` → `/movie/{id}/videos`)
- Loading screen: 5 SVG line-drawing characters cycle (Darth Vader, Indiana Jones, Mickey Mouse, Batman, James Bond) with draw animation + fade between each
- Results carousel: one card at a time, swipe on mobile, arrow buttons on desktop, dot indicators
- Each card shows: trailer embed (YouTube iframe) or "No trailer found" fallback, title, IMDb score, why it matches, streaming platform badges

**Remaining tasks (in order):**
1. Error handling — friendlier UI when Claude or TMDB fails
2. Card transition animation — slide or fade between carousel cards
3. General UI polish — anything that feels off
