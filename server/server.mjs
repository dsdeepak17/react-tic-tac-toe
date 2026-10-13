import 'dotenv/config';

import { randomUUID } from 'node:crypto';

import { createClient } from '@libsql/client';
import express from 'express';

const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env;
const port = Number(process.env.PORT) || 5000;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be configured.');
}

const database = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});
const app = express();

await database.execute(`
  CREATE TABLE IF NOT EXISTS stat_archives (
    id TEXT PRIMARY KEY,
    player_name TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'hard')),
    score_x INTEGER NOT NULL CHECK (score_x >= 0),
    score_o INTEGER NOT NULL CHECK (score_o >= 0),
    score_tie INTEGER NOT NULL CHECK (score_tie >= 0),
    games_played INTEGER NOT NULL CHECK (games_played >= 0),
    archived_at TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )
`);

app.use(express.json({ limit: '10kb' }));

app.get('/api/stat-archives', async (_request, response) => {
  try {
    const result = await database.execute(
      'SELECT id, player_name, difficulty, score_x, score_o, score_tie, games_played, archived_at FROM stat_archives ORDER BY created_at DESC'
    );
    const archives = result.rows.map((row) => ({
      id: row.id,
      playerName: row.player_name,
      difficulty: row.difficulty,
      scores: {
        X: row.score_x,
        O: row.score_o,
        Tie: row.score_tie,
      },
      gamesPlayed: row.games_played,
      archivedAt: row.archived_at,
    }));

    response.json(archives);
  } catch (error) {
    console.error('Failed to load stats archives:', error);
    response.status(500).json({ error: 'Unable to load stats archives.' });
  }
});

app.post('/api/stat-archives', async (request, response) => {
  const { playerName, difficulty, scores, gamesPlayed } = request.body ?? {};
  const validScores =
    scores &&
    ['X', 'O', 'Tie'].every(
      (result) => Number.isInteger(scores[result]) && scores[result] >= 0
    );

  if (
    typeof playerName !== 'string' ||
    !playerName.trim() ||
    playerName.trim().length > 50 ||
    !['easy', 'hard'].includes(difficulty) ||
    !validScores ||
    !Number.isInteger(gamesPlayed) ||
    gamesPlayed < 0 ||
    scores.X + scores.O + scores.Tie !== gamesPlayed
  ) {
    response.status(400).json({ error: 'Invalid stats archive.' });
    return;
  }

  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  const archivedAt = [
    pad(now.getDate()),
    pad(now.getMonth() + 1),
    pad(now.getFullYear() % 100),
  ].join(':') + ` ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const archive = {
    id: randomUUID(),
    playerName: playerName.trim(),
    difficulty,
    scores: {
      X: scores.X,
      O: scores.O,
      Tie: scores.Tie,
    },
    gamesPlayed,
    archivedAt,
  };

  try {
    await database.execute({
      sql: `
        INSERT INTO stat_archives (
          id, player_name, difficulty, score_x, score_o, score_tie,
          games_played, archived_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        archive.id,
        archive.playerName,
        archive.difficulty,
        archive.scores.X,
        archive.scores.O,
        archive.scores.Tie,
        archive.gamesPlayed,
        archive.archivedAt,
        now.getTime(),
      ],
    });

    response.status(201).json(archive);
  } catch (error) {
    console.error('Failed to persist stats archive:', error);
    response.status(500).json({ error: 'Unable to save the stats archive.' });
  }
});

app.listen(port, () => {
  console.log(`Stats API listening on http://localhost:${port}`);
});
