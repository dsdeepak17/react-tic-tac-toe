import React from 'react';
import TicTacToe from './TicTacToe';
import './style.css';
import './loader/loader.css';
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

  const handleModeChange = (mode) => {
    setMode(gameMode[mode]);
  };

  const showModeMessage = () => {
    if (mode === 'onePlayerMode') {
      return <>vs < br /> Machine</>;
    } else {
      return <>vs < br /> Human</>;
    }
  }

  const handleComputerDifficultyChange = (computerDifficulty) => {
    setComputerDifficulty(difficultyMode[computerDifficulty]);
  }

  const showDifficultyMessage = () => {
    if (computerDifficulty === 'easy') return <>Easy</>;
    return <>Hard</>;
  }

  return (
    <div className="App">
      <h3 className="heading">Tic Tac Toe</h3>
      <TicTacToe gameMode={mode} difficultyMode={computerDifficulty} handleComputerDifficultyChange={handleComputerDifficultyChange} />
      <div className="mode-switch switch">
        <Switch defaultChecked onChange={() => handleModeChange(mode)} />
        <span>{showModeMessage()}</span>
      </div>
      {
        mode === 'onePlayerMode' && (
          <div className="difficulty-switch switch">
            <Switch defaultChecked onChange={() => handleComputerDifficultyChange(computerDifficulty)} />
            <span>{showDifficultyMessage()}</span>
          </div>
        )
      }

    </div>
  );
}
