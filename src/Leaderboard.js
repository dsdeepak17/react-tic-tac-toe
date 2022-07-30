import React from 'react';
import { getScore } from './utils';

const Leaderboard = ({ leaderboard, players, gameMode }) => {
  const [score, setScore] = React.useState({ X: 0, O: 0, Tie: 0 });

  React.useEffect(() => {
    const final = getScore(leaderboard);
    setScore(final);
  }, [leaderboard]);

  React.useEffect(() => {
    setScore({ X: 0, O: 0, Tie: 0 });
  }, [gameMode]);

  return (
    <div className="leaderboard">
      <span className="score-item black-bg">
        <span>{players.player1}:</span>
        <span>{score['X']}</span>
      </span>
      <span className="score-item black-bg">
        <span>{players.player2}:</span>
        <span>{score['O']}</span>
      </span>
      <span className="score-item black-bg">
        <span>Tied: </span>
        <span>{score['Tie']}</span>
      </span>
    </div>
  );
};

export default Leaderboard;
