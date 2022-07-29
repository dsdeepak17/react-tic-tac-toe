import React from 'react';
import TicTacToe from './TicTacToe';
import './style.css';
import { Switch } from 'antd';
import { getWordsFromCamelCase } from './utils';

const gameMode = {
  onePlayerMode: 'twoPlayerMode',
  twoPlayerMode: 'onePlayerMode',
};

export default function App() {
  const [mode, setMode] = React.useState('twoPlayerMode');

  const handleModeChange = () => {
    setMode(gameMode[mode]);
  };
  return (
    <div className="App">
      <div className="mode-switch">
        <Switch defaultChecked onChange={handleModeChange} />
        <span>{getWordsFromCamelCase(mode)}</span>
      </div>

      <TicTacToe gameMode={mode} />
    </div>
  );
}
