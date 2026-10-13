import React from 'react';
import { Button, Modal, Switch } from 'antd';

import Board from './components/Board';
import LeaderboardPage from './components/LeaderboardPage';
import { DIFFICULTIES, GAME_MODES } from './game/gameLogic';
import { archiveStats } from './services/statsApi';
import './style.css';

export default function App() {
  const [activePage, setActivePage] = React.useState('game');
  const [gameMode, setGameMode] = React.useState(GAME_MODES.TWO_PLAYER);
  const [difficulty, setDifficulty] = React.useState(DIFFICULTIES.EASY);
  const [pendingDifficulty, setPendingDifficulty] = React.useState(null);
  const [statsSnapshot, setStatsSnapshot] = React.useState({
    playerName: 'Dumb Computer',
    difficulty: DIFFICULTIES.EASY,
    scores: { X: 0, O: 0, Tie: 0 },
    gamesPlayed: 0,
  });
  const [isArchivingStats, setIsArchivingStats] = React.useState(false);
  const [archiveMessage, setArchiveMessage] = React.useState('');
  const [archiveFailed, setArchiveFailed] = React.useState(false);
  const archiveRequestInProgress = React.useRef(false);

  const handleModeChange = (checked) => {
    setGameMode(checked ? GAME_MODES.ONE_PLAYER : GAME_MODES.TWO_PLAYER);
  };

  const handleDifficultyChange = (checked) => {
    const nextDifficulty = checked ? DIFFICULTIES.HARD : DIFFICULTIES.EASY;

    if (nextDifficulty === difficulty || archiveRequestInProgress.current) {
      return;
    }

    const hasRecordedGames = Object.values(statsSnapshot.scores).some((score) => score > 0);

    if (!hasRecordedGames) {
      setDifficulty(nextDifficulty);
      setArchiveMessage('');
      setArchiveFailed(false);
      return;
    }

    setPendingDifficulty(nextDifficulty);
    setArchiveMessage('');
    setArchiveFailed(false);
  };

  const confirmDifficultyChange = async () => {
    if (!pendingDifficulty || archiveRequestInProgress.current) {
      return;
    }

    archiveRequestInProgress.current = true;
    setIsArchivingStats(true);
    setArchiveMessage('');
    setArchiveFailed(false);

    try {
      const archive = await archiveStats(statsSnapshot);
      setDifficulty(pendingDifficulty);
      setPendingDifficulty(null);
      setArchiveMessage(
        `${archive.playerName}'s stats saved at ${archive.archivedAt}. New scoreboard started.`
      );
    } catch (error) {
      setArchiveFailed(true);
      setArchiveMessage(
        error instanceof Error ? error.message : 'Could not archive the current stats.'
      );
    } finally {
      archiveRequestInProgress.current = false;
      setIsArchivingStats(false);
    }
  };

  const showModeMessage =
    gameMode === GAME_MODES.ONE_PLAYER ? (
      'Solo'
    ) : (
      '2 players'
    );

  return (
    <div className="App">
      <main className={activePage === 'leaderboard' ? 'game-shell leaderboard-shell' : 'game-shell'}>
        <header className="game-header">
          <div className="brand-mark" aria-hidden="true">T</div>
          <div>
            <p className="eyebrow">A little friendly rivalry</p>
            <h1 className="heading">{activePage === 'leaderboard' ? 'Leaderboard' : 'Tic Tac Toe'}</h1>
          </div>
          <Button
            className="page-nav-button"
            onClick={() => setActivePage(activePage === 'game' ? 'leaderboard' : 'game')}
            aria-label={activePage === 'game' ? 'Open leaderboard' : 'Return to game'}
          >
            {activePage === 'game' ? 'Scores ↗' : '← Game'}
          </Button>
        </header>

        <div hidden={activePage !== 'game'}>
          <section className="game-settings" aria-label="Game settings">
            <div className="setting">
              <span className="setting-label">Game mode</span>
              <div className="setting-control">
                <span>{showModeMessage}</span>
                <Switch
                  checked={gameMode === GAME_MODES.ONE_PLAYER}
                  onChange={handleModeChange}
                  disabled={isArchivingStats}
                  aria-label="Play against the computer"
                />
              </div>
            </div>

            {gameMode === GAME_MODES.ONE_PLAYER && (
              <div className="setting">
                <span className="setting-label">Computer level</span>
                <div className="setting-control">
                  <span>{difficulty === DIFFICULTIES.HARD ? 'Hard' : 'Easy'}</span>
                  <Switch
                    checked={difficulty === DIFFICULTIES.HARD}
                    onChange={handleDifficultyChange}
                    disabled={isArchivingStats}
                    aria-label="Use hard computer difficulty"
                  />
                </div>
              </div>
            )}
          </section>

          <Board
            gameMode={gameMode}
            difficulty={difficulty}
            onStatsChange={setStatsSnapshot}
          />

          {archiveMessage && (
            <p className={archiveFailed ? 'archive-status error' : 'archive-status'} role={archiveFailed ? 'alert' : 'status'}>
              {archiveMessage}
            </p>
          )}

          <footer className="game-footer">
            <span>X</span> and <span>O</span> take turns. Get three in a row to win.
          </footer>
        </div>

        {activePage === 'leaderboard' && <LeaderboardPage />}
      </main>

      <Modal
        visible={pendingDifficulty !== null}
        title={null}
        centered
        closable={!isArchivingStats}
        maskClosable={!isArchivingStats}
        keyboard={!isArchivingStats}
        onCancel={() => {
          if (!isArchivingStats) {
            setPendingDifficulty(null);
            setArchiveMessage('');
          }
        }}
        footer={[
          <Button
            key="cancel"
            className="archive-cancel-button"
            disabled={isArchivingStats}
            onClick={() => {
              setPendingDifficulty(null);
              setArchiveMessage('');
            }}
          >
            Keep playing
          </Button>,
          <Button
            key="confirm"
            type="primary"
            className="archive-confirm-button"
            loading={isArchivingStats}
            onClick={confirmDifficultyChange}
          >
            Archive &amp; switch
          </Button>,
        ]}
      >
        <div className="archive-dialog">
          <div className="archive-dialog-icon" aria-hidden="true">↗</div>
          <p className="archive-dialog-eyebrow">NEW CHALLENGE</p>
          <h2>Switch to {pendingDifficulty === DIFFICULTIES.HARD ? 'Smart Computer' : 'Dumb Computer'}?</h2>
          <p className="archive-dialog-copy">
            Your current scoreboard will be saved, then reset for the new difficulty.
          </p>

          <div className="archive-summary">
            <span className="archive-summary-name">{statsSnapshot.playerName}</span>
            <span>{statsSnapshot.scores.O} computer wins</span>
            <span>{statsSnapshot.scores.X} player wins</span>
            <span>{statsSnapshot.scores.Tie} ties</span>
          </div>

          {archiveFailed && archiveMessage && (
            <p className="archive-dialog-error" role="alert">{archiveMessage}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
