import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';

export const recommendRouter = Router();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

async function fetchTMDBData(title) {
  const key = process.env.TMDB_API_KEY;
  if (!key) return {};

  try {
    // 1. Search for the movie to get its ID
    const searchRes = await fetch(
      `${TMDB_BASE}/search/movie?query=${encodeURIComponent(title)}&api_key=${key}`
    );
    const searchData = await searchRes.json();
    const movie = searchData.results?.[0];
    if (!movie) return {};

    const poster = movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null;

    // 2. Fetch videos for the movie
    const videosRes = await fetch(
      `${TMDB_BASE}/movie/${movie.id}/videos?api_key=${key}`
    );
    const videosData = await videosRes.json();
    const trailerKey = findTrailer(videosData.results);

    return { poster, trailer_key: trailerKey };
  } catch {
    return {};
  }
}

function findTrailer(videos = []) {
  if (!videos.length) return null;
  // Prefer an official YouTube trailer
  const trailer = videos.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  );
  // Fall back to any YouTube teaser or clip
  const fallback = videos.find((v) => v.site === 'YouTube');
  return (trailer ?? fallback)?.key ?? null;
}

recommendRouter.post('/recommend', async (req, res) => {
  const { shows } = req.body;

  if (!Array.isArray(shows) || shows.length === 0) {
    return res.status(400).json({ error: 'Provide an array of show names.' });
  }

  // Sanitize: limit array size, trim strings, reject anything too long
  const MAX_SHOWS = 10;
  const MAX_TITLE_LENGTH = 100;
  const cleaned = shows
    .slice(0, MAX_SHOWS)
    .map((s) => (typeof s === 'string' ? s.trim().slice(0, MAX_TITLE_LENGTH) : ''))
    .filter(Boolean);

  if (cleaned.length === 0) {
    return res.status(400).json({ error: 'Provide at least one valid show name.' });
  }

  const showList = cleaned.join(', ');

  const prompt = `You are a movie expert. A user enjoys these movies: ${showList}.

Recommend exactly 3 movies they would likely enjoy. For each, return a JSON object.

Respond ONLY with a valid JSON array (no markdown, no explanation) in this exact format:
[
  {
    "title": "Movie Title",
    "why_it_matches": "2-3 sentence explanation of why this matches their taste based on the movies they listed",
    "where_to_watch": ["Netflix", "HBO Max"],
    "imdb_score": "8.5/10"
  }
]

Rules:
- Do not recommend any movies the user already listed
- where_to_watch should list 1-3 current major streaming platforms
- imdb_score format: "X.X/10"`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].text.trim();
    const recommendations = JSON.parse(text);

    // Fetch TMDB data (poster + trailer) for all 3 in parallel
    // Each fetch is isolated — one failure won't kill the others
    const enriched = await Promise.all(
      recommendations.map(async (rec) => {
        const tmdb = await fetchTMDBData(rec.title).catch(() => ({}));
        return { ...rec, ...tmdb };
      })
    );

    res.json({ recommendations: enriched });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate recommendations.' });
  }
});
