import { useEffect, useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Confetti from 'react-confetti'

const gameIcons = [
  "🥳",
  "👾",
  "🤖",
  "☠️",
  "👕",
  "👖",
  "👽",
  "🎃",
  "👹",
  "👺",
];

function App() {
  const [pieces, setPieces] = useState([]);
  const [tries, seTries] = useState(6);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const isGameComplted = useMemo(() => {
    if (pieces.length > 0 && pieces.every((piece) => piece.solved)) {
      return true;
    }
  }, [pieces]);

  const startGame = () => {
    if (gameOver) return; // Prevent restarting if game is over

    if (level > 4) {
      setGameOver(true);
      return;
    }
    const selectedNo = level * 2 + 2;

    const levelGameIcon = gameIcons.slice(0, selectedNo);
    console.log(levelGameIcon + "a");

    const dublicateIcons = [...levelGameIcon, ...levelGameIcon];
    console.log(dublicateIcons);
    console.log(dublicateIcons.length);

    const newIcons = [];

    let i = 0;

    while (i < levelGameIcon.length * 2) {
      const random = Math.floor(Math.random() * dublicateIcons.length);
      console.log(random);

      newIcons.push({
        emoji: dublicateIcons[random],
        flipped: false,
        solved: false,
        position: i,
      });

      dublicateIcons.splice(random, 1);

      i++;
    }
    setPieces(newIcons);
  };

  const handleActive = (data) => {
    const flipped = pieces.filter((piece) => piece.flipped && !piece.solved);
    if (flipped.length === 2) return false;

    const newPiece = pieces.map((piece) => {
      if (piece.position === data.position) {
        piece.flipped = !piece.flipped;
      }
      return piece;
    });

    setPieces(newPiece);
  };

  const gameLogic = () => {
    const flippedIcons = pieces.filter((piece) => piece.flipped && !piece.solved);

    if (flippedIcons.length === 2) {
      setTimeout(() => {
        const matched = flippedIcons[0].emoji === flippedIcons[1].emoji;

        if (matched) {
          setPieces(
            pieces.map((piece) => {
              if (
                piece.position === flippedIcons[0].position ||
                piece.position === flippedIcons[1].position
              ) {
                return { ...piece, solved: true };
              }
              return piece;
            })
          );
        } else {
          const newTries = tries - 1;

          if (newTries <= 0) {
            startGame();
            seTries(3);
            return;
          }

          seTries(newTries);

          setPieces(
            pieces.map((piece) => {
              if (
                piece.position === flippedIcons[0].position ||
                piece.position === flippedIcons[1].position
              ) {
                return { ...piece, flipped: false };
              }
              return piece;
            })
          );
        }
      }, 1000);
    }
  };

  useEffect(() => {
    gameLogic();
  }, [pieces]);

  useEffect(() => {
    startGame();
  }, []);

  console.log(pieces);

  useEffect(() => {
    if (gameOver) return; // <-- Prevent level increase and reload if game over

    if (isGameComplted) {
      setLevel(level + 1);

      const timeout = setTimeout(() => {
        window.location.reload();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isGameComplted, gameOver]);

  useEffect(() => {
    startGame();
  }, [level]);

  return (
    <main>
      <h1>Memory Game In React</h1>
      <p className="tries">
        Tries left : {tries} <span>Level {level}</span>{' '}
      </p>
      <div className="container">
        {pieces.map((data, index) => (
          <div
            className={`flip-card ${data.flipped ? 'active' : ''}`}
            key={index}
            onClick={() => handleActive(data)}
          >
            <div className="flip-card-inner">
              <div className="front" />
              <div className="back">{data.emoji}</div>
            </div>
          </div>
        ))}
      </div>
      {gameOver ? (
        <div className="game-completed">
          <h1>Game Completed</h1>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      ) : isGameComplted && (
        <div className="game-completed">
          <h1>YOU WIN!!</h1>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}
    </main>
  );
}

export default App;
