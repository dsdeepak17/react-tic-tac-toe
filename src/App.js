import React from 'react';
import TicTacToe from './TicTacToe';
import './style.css';
import { Switch } from 'antd';
import { getWordsFromCamelCase } from './utils';

const gameMode = {
  onePlayerMode: 'twoPlayerMode',
  twoPlayerMode: 'onePlayerMode',
};
const difficultyMode = {
  easy: 'hard',
  hard: 'easy',
};

export default function App() {
  const [mode, setMode] = React.useState('twoPlayerMode');
  const [computerDifficulty, setComputerDifficulty] = React.useState('easy'); // easy, hard

  const handleModeChange = () => {
    setMode(gameMode[mode]);
  };

  const showModeMessage = () => {
    if (mode === 'onePlayerMode') {
      return <>vs < br /> Machine</>;
    } else {
      return <>vs < br /> Human</>;
    }
  }

  const handleComputerDifficultyChange = () => {
    setComputerDifficulty(difficultyMode[computerDifficulty]);
  }

  const showDifficultyMessage = () => {
    if (computerDifficulty === 'easy') return <>Easy</>;
    return <>Hard</>;
  }

  return (
    <div className="App">
      <TicTacToe gameMode={mode} difficultyMode={computerDifficulty} />
      <div className="mode-switch switch">
        <Switch defaultChecked onChange={handleModeChange} />
        <span>{showModeMessage()}</span>
      </div>
      {
        mode === 'onePlayerMode' && (
          <div className="difficulty-switch switch">
            <Switch defaultChecked onChange={handleComputerDifficultyChange} />
            <span>{showDifficultyMessage()}</span>
          </div>
        )
      }

    </div>
  );
}
