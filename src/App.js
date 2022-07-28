import React from 'react';
import TicTacToe from './TicTacToe';
import './style.css';
import { Switch } from 'antd';
import { getWordsFromCamelCase } from './utils';

const gameMode = {
  onePlayer: 'twoPlayer',
  twoPlayer: 'onePlayer',
};

export default function App() {
  const [mode, setMode] = React.useState('twoPlayer');

  const handleModeChange = () => {
    setMode(gameMode[mode]);
  };
  return (
    <div className="App">
      <div className="mode-switch">
        <span>{getWordsFromCamelCase(mode)}</span>
        <Switch defaultChecked onChange={handleModeChange} />
      </div>

      <TicTacToe gameMode={mode} />
    </div>
  );
}
