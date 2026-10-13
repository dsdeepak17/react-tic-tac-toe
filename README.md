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

## Deploy to Render and Turso

The [render.yaml](./render.yaml) Blueprint deploys the React app and Express API as one Render web service. The API serves the built React app, so browser API requests stay same-origin and need no separate CORS configuration.

1. Create a Turso database and generate a database auth token.
2. Push this repository to GitHub, then in Render choose **New + → Blueprint** and select the repository.
3. In the Blueprint's environment settings, provide `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`. Keep the auth token private; do not commit it.
4. Deploy. Render builds the React app and starts Express on Render's assigned `PORT`; the service creates the Turso table at startup.

The free Render web service may spin down when idle, so its first request after inactivity can take longer. Game archives are stored in Turso rather than the service's ephemeral filesystem.
