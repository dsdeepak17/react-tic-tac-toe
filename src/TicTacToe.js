import React from 'react';
import Tile from './Tile';
import { isGameOver, capitalize, newBoardAfterEasyMove, newBoardAfterDifficultMove } from './utils';
import Leaderboard from './Leaderboard';

const board = Array.from({ length: 9 }, (v, i) => i);
const turnComplement = {
  player1: 'player2',
  player2: 'player1',
};
const symbol = {
  player1: 'X',
  player2: 'O',
};
const p = {
  X: 'player1',
  O: 'player2',
  Tie: 'Tie',
};

const TicTacToe = ({ gameMode, difficultyMode }) => {
  const [turn, setTurn] = React.useState('player1');
  const [tilesVal, setTilesVal] = React.useState(board);
  const [winner, setWinner] = React.useState('');
  const [winPos, setWinPos] = React.useState([]);
  const [players, setPlayers] = React.useState({
    player1: 'Player1',
    player2: 'Player2',
  });
  const [leaderboard, setLeaderboard] = React.useState([]);
  const [gamePaused, setGamePaused] = React.useState(false);

  React.useEffect(() => {
    setTilesVal(board);
    if (gameMode === 'onePlayerMode')
      setPlayers((players) => ({
        ...players,
        player2: 'Dumb Computer',
      }));
    if (gameMode === 'twoPlayerMode')
      setPlayers((players) => ({
        ...players,
        player2: 'Player2',
      }));
  }, [gameMode]);

  React.useEffect(() => {
    if (gameMode === 'onePlayerMode' && turn === 'player2' && difficultyMode === 'easy' && !gamePaused) {
      const newBoard = newBoardAfterEasyMove(tilesVal, 'O');
      // console.log(turn, newBoard);
      if (!isGameOver(tilesVal)) {
        setTilesVal(newBoard);
        setTurn('player1');
      }
    }

    if (gameMode === 'onePlayerMode' && turn === 'player2' && difficultyMode === 'hard' && !gamePaused) {
      const newBoard = newBoardAfterDifficultMove(tilesVal, 'O');
      // console.log(turn, newBoard);
      if (!isGameOver(tilesVal)) {
        setTilesVal(newBoard);
        setTurn('player1');
      }
    }

    const { winner: gameWinner, winPos: winningPositions } = isGameOver(tilesVal) || { winner: '', winPos: [] };

    setWinPos(winningPositions);

    gameWinner === 'Tie'
      ? setWinner(gameWinner)
      : setWinner(players[p[gameWinner]]);
    if (gameWinner) {
      setGamePaused(true);
    }
  }, [tilesVal]);

  React.useEffect(() => {
    const { winner: gameWinner } = isGameOver(tilesVal) || { winner: '' };
    if (gameWinner) setLeaderboard((l) => [...l, gameWinner]);
  }, [gamePaused]);

  const handleTurn = () => {
    if (gamePaused) return;
    setTurn(turnComplement[turn]);
  };

  const handleTileVal = (pos, turn) => {
    if (gamePaused) return;
    const board = [...tilesVal];
    board[pos] = symbol[turn];
    setTilesVal(board);
  };

  const handleNameChange = (e) => {
    const { name, value } = e.target;

    setPlayers((players) => ({
      ...players,
      [name]: capitalize(value),
    }));
  };

  return (
    <div className="center">
      <h3 className="heading">Tic Tac Toe</h3>
      <Leaderboard leaderboard={leaderboard} players={players} />
      <div className="player-names">
        <input
          type="text"
          className={
            turn === 'player1'
              ? 'player-name-input active'
              : 'player-name-input'
          }
          name="player1"
          value={players.player1}
          onChange={handleNameChange}
        />
        <input
          type="text"
          className={
            turn === 'player2'
              ? 'player-name-input active'
              : 'player-name-input'
          }
          name="player2"
          value={players.player2}
          onChange={handleNameChange}
          disabled={gameMode === 'onePlayerMode'}
        />
      </div>

      <div className="game">
        <div className={winner ? 'board game-over' : 'board'}>
          {tilesVal.map((v, i) => {
            return (
              <Tile
                key={i}
                val={v}
                index={i}
                turn={turn}
                winPos={winPos}
                handleTurn={handleTurn}
                handleTileVal={handleTileVal}
              />
            );
          })}
        </div>
      </div>
      <p>{winner && winner !== 'Tie' && `Winner: ${winner}`}</p>
      <p>{winner && winner === 'Tie' && 'The Game is Tied!'}</p>
      {gamePaused && (
        <button
          className="reset-btn"
          onClick={() => {
            setTilesVal(board);
            setGamePaused(false);
          }}
        >
          Reset Board
        </button>
      )}
    </div>
  );
};

export default TicTacToe;
