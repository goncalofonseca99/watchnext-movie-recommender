# TV Show Recommender - PRD

## Overview
An app where users enter 3 TV shows they've enjoyed, and receive 3 personalised recommendations powered by Claude AI.

---

## Feature 1: Show Input Wizard
- 3-step wizard flow — user enters one show per step
- Free text input (no autocomplete needed — Claude interprets the name)
- Progress indicator showing Step 1 / 2 / 3
- Back button to edit previous entries
- If Claude doesn't recognise a show, it proceeds with the ones it does recognise
- Test: User can complete all 3 steps and reach results in under 5 clicks

## Feature 2: AI Recommendations
- On submit, call Claude API with the 3 shows as context
- Claude returns exactly 3 TV show recommendations
- Each recommendation includes:
  - Show title
  - Why it matches (short explanation based on their 3 picks)
  - Where to watch (streaming platforms e.g. Netflix, HBO, Disney+)
  - Ratings (IMDb score + Rotten Tomatoes score)
  - Genre tags
  - Poster image (fetched from TMDB API by show title)
- Test: Recommendations load within 5 seconds, all 4 info fields present for each result

## Feature 3: Results Screen
- 3 recommendation cards displayed in a vertical or grid layout
- Each card shows: poster, title, genre tags, ratings, streaming platforms, and "why it matches" blurb
- "Start over" button to reset and try different shows
- Test: All 3 cards render correctly, start over resets all inputs

---

## UI Decisions
- Dark, cinematic theme — deep dark background, rich accent colors (think Netflix)
- Clean card-based layout for results
- Step-by-step wizard for input (not a single form)
- Mobile-responsive

---

## Technical Decisions
- React frontend (Vite)
- Node/Express backend
- Claude API for generating recommendations (claude-sonnet-4-6 or latest)
- TMDB API for fetching poster images by show title
- No database, no auth — stateless, session-based
- No user accounts or saved history

---

## Prompt Design (Claude API)
Send Claude a structured prompt with the 3 shows and ask it to return JSON with:
- `title`
- `why_it_matches`
- `where_to_watch` (array of platforms)
- `imdb_score`
- `rt_score`
- `genres` (array)

---

## Out of Scope (for now)
- User accounts / saved history
- More than 3 recommendations
- Autocomplete / show search
- Social sharing
