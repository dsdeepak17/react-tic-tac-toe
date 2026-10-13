import React from 'react';

import { getScoreSummary } from '../game/gameLogic';

const Leaderboard = ({ leaderboard, players }) => {
  const score = getScoreSummary(leaderboard);

  return (
    <div className="leaderboard">
      <span className="score-item black-bg">
        <span>{players.player1}:</span>
        <span>{score.X}</span>
      </span>
      <span className="score-item black-bg">
        <span>{players.player2}:</span>
        <span>{score.O}</span>
      </span>
      <span className="score-item black-bg">
        <span>Tied:</span>
        <span>{score.Tie}</span>
      </span>
    </div>
  );
};

export default Leaderboard;
