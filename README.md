# Tic Tac Toe game in React

## Run locally

Install dependencies with `npm install`, then start the API and React app in separate terminals:

```sh
# Copy .env.example to .env and fill in the Turso database URL and auth token.
npm run start:api
npm start
```

The stats API runs on port `5000` by default. Set the `PORT` environment variable to override it.

The Express API stores archived score snapshots in Turso. Configure `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in `.env`; the API creates the `stat_archives` table on startup. When changing the computer difficulty, the app asks for confirmation, archives the current computer name, score, games played, and timestamp (`DD:MM:YY HH:mm`), then resets the scoreboard.

For production, build the React app with `npm run build` and deploy the API separately. Configure the hosting layer to route `/api` requests to the Node server.
