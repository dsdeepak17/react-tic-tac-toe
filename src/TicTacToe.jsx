import React from 'react';
import Tile from './Tile';
import { isGameOver, capitalize, newBoardAfterEasyMove, newBoardAfterDifficultMove, debounce, LoadingSpinner } from './utils';
import Leaderboard from './Leaderboard';
import Loader from './loader';

import { board, turnComplement, symbol, p, COMPUTER_WAIT_TIME } from './constants';

const TicTacToe = ({ gameMode, difficultyMode, handleComputerDifficultyChange }) => {
  const [gameStart, setGameStart] = React.useState(false);
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
  const [machineIsPlaying, setMachineIsPlaying] = React.useState(false);

  // console.log('state: ', { turn, tilesVal, winner, winPos, players, leaderboard, gamePaused });

  React.useEffect(() => {
    if (turn === 'player2' && gameMode === 'computer') {
      setMachineIsPlaying(true);
    } else setMachineIsPlaying(false);
  }, [turn]);

  React.useEffect(() => {
    const tilesEmpty = tilesVal.filter((val) => typeof val === 'number').length === 9;
    if (gamePaused === false && tilesEmpty) {
      setGameStart(true);
    } else {
      setGameStart(false);
    }
  }, [gamePaused]);

  React.useEffect(() => {
    setTilesVal(board);
    if (gameMode === 'onePlayerMode')
      switch (difficultyMode) {
        case 'easy':
          setPlayers((players) => ({
            ...players,
            player2: 'Dumb Computer',
          }));
          break;
        case 'hard':
          setPlayers((players) => ({
            ...players,
            player2: 'Smart Computer',
          }));
          break;
        default:
          break;
      }
    if (gameMode === 'twoPlayerMode')
      setPlayers((players) => ({
        ...players,
        player2: 'Player2',
      }));
    setTurn('player1');
    setTilesVal(board);
    setGamePaused(false);
  }, [gameMode, difficultyMode]);

  React.useEffect(() => {
    handleComputerDifficultyChange('hard'); //set difficulty to easy when game mode resets
  }, [gameMode]);

  React.useEffect(() => {

    if (gameMode === 'onePlayerMode' && turn === 'player2') {
      setTimeout(() => {

        if (difficultyMode === 'easy' && !gamePaused) {
          //get random number between 1 and 10
          const randomNumber = Math.floor(Math.random() * 10) + 1;
          let newBoard = [];

          //run easy algo and hard algo half the time
          if (randomNumber <= 5) newBoard = newBoardAfterEasyMove(tilesVal, 'O');
          else newBoard = newBoardAfterDifficultMove(tilesVal, 'O');


          if (!isGameOver(tilesVal)) {
            setTilesVal(newBoard);
            setTurn('player1');
          }
        }

        if (difficultyMode === 'hard' && !gamePaused) {
          const newBoard = newBoardAfterDifficultMove(tilesVal, 'O');
          if (!isGameOver(tilesVal)) {
            setTilesVal(newBoard);
            setTurn('player1');
          }
        }


      }, tilesVal.filter(tile => typeof tile === 'number').length * COMPUTER_WAIT_TIME[difficultyMode]);
    }

    const { winner: gameWinner, winPos: winningPositions } = isGameOver(tilesVal) || { winner: '', winPos: [] };

    setWinPos(winningPositions);

    gameWinner === 'Tie'
      ? setWinner(gameWinner)
      : setWinner(players[p[gameWinner]]);
    if (gameWinner) {
      setGamePaused(true);
    }
  }, [tilesVal, gameStart]);

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

  const handleReset = () => {
    setTilesVal(board);
    debounce(setGamePaused(false), 0);
  }

  return (
    <div className="center">
      <Leaderboard leaderboard={leaderboard} players={players} gameMode={gameMode} />
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
                gameMode={gameMode}
                handleTurn={handleTurn}
                handleTileVal={handleTileVal}
              />
            );
          })}
        </div>
      </div>
      {
        winner && (
          <div className="game-over-message">
            {winner !== 'Tie' && <p>{`Winner: ${winner}`}</p>}
            {winner === 'Tie' && <p>{`The Game is Tied!`}</p>}
          </div>
        )
      }
      {
        !gamePaused && gameMode === 'onePlayerMode' && turn === 'player2' && (
          <div className="spinner-container">
            <span className="spinner-text">Calculating Move...</span>
            {/* <LoadingSpinner /> */}
            <Loader />
          </div>
        )
      }
      {gamePaused && (
        <button
          className="reset-btn"
          onClick={() => handleReset()}
        >
          Reset Board
        </button>
      )}
    </div>
  );
};

export default TicTacToe;
