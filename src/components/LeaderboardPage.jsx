import React from 'react';
import { Button, Spin } from 'antd';

import { getStatArchives } from '../services/statsApi';

const LeaderboardPage = () => {
  const [archives, setArchives] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const requestController = React.useRef(null);

  const loadArchives = React.useCallback(async () => {
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    setIsLoading(true);
    setError('');

    try {
      const savedArchives = await getStatArchives(controller.signal);

      if (!controller.signal.aborted) {
        setArchives(savedArchives);
      }
    } catch (loadError) {
      if (!controller.signal.aborted) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Could not load saved leaderboard results.'
        );
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  React.useEffect(() => {
    loadArchives();

    return () => requestController.current?.abort();
  }, [loadArchives]);

  return (
    <section className="leaderboard-page" aria-labelledby="leaderboard-title">
      <div className="leaderboard-page-heading">
        <div>
          <p className="eyebrow">PAST ROUNDS</p>
          <h2 id="leaderboard-title">Leaderboard</h2>
          <p className="leaderboard-intro">Saved scoreboards ranked by computer wins.</p>
        </div>
      </div>

      {isLoading && (
        <div className="leaderboard-state" role="status">
          <Spin />
          <span>Loading saved scores…</span>
        </div>
      )}

      {!isLoading && error && (
        <div className="leaderboard-state leaderboard-error" role="alert">
          <p>{error}</p>
          <Button onClick={loadArchives}>Try again</Button>
        </div>
      )}

      {!isLoading && !error && archives.length === 0 && (
        <div className="leaderboard-state leaderboard-empty">
          <span className="empty-trophy" aria-hidden="true">✦</span>
          <h3>No saved scores yet</h3>
          <p>Play a few rounds and switch computer difficulty to save a scoreboard here.</p>
        </div>
      )}

      {!isLoading && !error && archives.length > 0 && (
        <ol className="archive-list">
          {[...archives]
            .sort((first, second) => second.scores.O - first.scores.O)
            .map((archive, index) => (
            <li className="archive-card" key={archive.id}>
              <span className="archive-rank" aria-label={`Saved scoreboard ${index + 1}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="archive-details">
                <div className="archive-title-row">
                  <h3>{archive.playerName}</h3>
                  <span className={`difficulty-badge ${archive.difficulty}`}>
                    {archive.difficulty}
                  </span>
                </div>
                <time className="archive-date">{archive.archivedAt}</time>
                <div className="archive-record" aria-label={`${archive.gamesPlayed} games`}>
                  <span><strong>{archive.scores.O}</strong> computer wins</span>
                  <span><strong>{archive.scores.X}</strong> player wins</span>
                  <span><strong>{archive.scores.Tie}</strong> ties</span>
                  <span className="archive-games">{archive.gamesPlayed} games</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

export default LeaderboardPage;
