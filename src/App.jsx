import React, { useState, useEffect, useRef } from 'react';
    import useSound from 'use-sound';

    const initialBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    function App() {
      const [board, setBoard] = useState(initialBoard);
      const [score, setScore] = useState(0);
      const [time, setTime] = useState(0);
      const [isRunning, setIsRunning] = useState(false);
      const timerRef = useRef(null);
      const [playMerge] = useSound('/merge.mp3');

      useEffect(() => {
        if (isRunning) {
          timerRef.current = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
          }, 1000);
        } else {
          clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
      }, [isRunning]);

      useEffect(() => {
        if (!board.flat().some(cell => cell === 0)) {
          if (!canMove(board)) {
            setIsRunning(false);
            alert("Game Over!");
          }
        }
      }, [board]);

      const canMove = (board) => {
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) return true;
            if (i < 3 && board[i][j] === board[i + 1][j]) return true;
            if (j < 3 && board[i][j] === board[i][j + 1]) return true;
          }
        }
        return false;
      };

      const startNewGame = () => {
        setBoard(initialBoard);
        setScore(0);
        setTime(0);
        setIsRunning(true);
        const newBoard = addRandomTile(initialBoard);
        addRandomTile(newBoard);
      };

      const stopGame = () => {
        setIsRunning(false);
      };

      const addRandomTile = (currentBoard) => {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if (currentBoard[i][j] === 0) {
              emptyCells.push({ row: i, col: j });
            }
          }
        }
        if (emptyCells.length > 0) {
          const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
          const newBoard = currentBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) =>
              rowIndex === randomCell.row && colIndex === randomCell.col ? (Math.random() < 0.9 ? 2 : 4) : cell
            )
          );
          setBoard(newBoard);
          return newBoard;
        }
        return currentBoard;
      };

      const moveTiles = (direction) => {
        if (!isRunning) return;
        let newBoard = board.map(row => [...row]);
        let moved = false;

        if (direction === 'up') {
          for (let j = 0; j < 4; j++) {
            let col = [];
            for (let i = 0; i < 4; i++) {
              if (newBoard[i][j] !== 0) col.push(newBoard[i][j]);
            }
            const mergedCol = mergeTiles(col);
            for (let i = 0; i < 4; i++) {
              newBoard[i][j] = mergedCol[i] || 0;
            }
          }
        } else if (direction === 'down') {
          for (let j = 0; j < 4; j++) {
            let col = [];
            for (let i = 3; i >= 0; i--) {
              if (newBoard[i][j] !== 0) col.push(newBoard[i][j]);
            }
            const mergedCol = mergeTiles(col);
             for (let i = 3; i >= 0; i--) {
              newBoard[i][j] = mergedCol[3 - i] || 0;
            }
          }
        } else if (direction === 'left') {
          for (let i = 0; i < 4; i++) {
            let row = newBoard[i].filter(cell => cell !== 0);
            const mergedRow = mergeTiles(row);
            for (let j = 0; j < 4; j++) {
              newBoard[i][j] = mergedRow[j] || 0;
            }
          }
        } else if (direction === 'right') {
          for (let i = 0; i < 4; i++) {
            let row = newBoard[i].filter(cell => cell !== 0).reverse();
            const mergedRow = mergeTiles(row);
            for (let j = 3; j >= 0; j--) {
              newBoard[i][j] = mergedRow[3 - j] || 0;
            }
          }
        }

        if (JSON.stringify(board) !== JSON.stringify(newBoard)) {
          const newBoardWithRandom = addRandomTile(newBoard);
          setBoard(newBoardWithRandom);
          moved = true;
        }
      };


      const mergeTiles = (line) => {
        let newLine = [];
        for (let i = 0; i < line.length; i++) {
          if (line[i] === line[i + 1]) {
            playMerge();
            newLine.push(line[i] * 2);
            setScore(prevScore => prevScore + line[i] * 2);
            i++;
          } else {
            newLine.push(line[i]);
          }
        }
        while (newLine.length < 4) {
          newLine.push(0);
        }
        return newLine;
      };

      const handleKeyDown = (event) => {
        switch (event.key) {
          case 'ArrowUp':
            moveTiles('up');
            break;
          case 'ArrowDown':
            moveTiles('down');
            break;
          case 'ArrowLeft':
            moveTiles('left');
            break;
          case 'ArrowRight':
            moveTiles('right');
            break;
          default:
            break;
        }
      };

      useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }, [board, isRunning]);

      const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      };

      return (
        <div className="game-container">
          <div className="game-header">
            <div className="timer">Time: {formatTime(time)}</div>
            <div className="score">Score: {2048 - score > 0 ? 2048 - score : 0}</div>
          </div>
          <div className="game-board">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className={`tile tile-${cell}`}>
                  {cell !== 0 ? cell : ''}
                </div>
              ))
            )}
          </div>
          <div className="controls">
            <button onClick={startNewGame} disabled={isRunning}>Start</button>
            <button onClick={stopGame} disabled={!isRunning}>Stop</button>
          </div>
          <div className="rules">
            <h3>How to Play:</h3>
            <p>Use the arrow keys to move the tiles. Tiles with the same number merge when they collide. The goal is to create a tile with the value of 2048.</p>
          </div>
        </div>
      );
    }

    export default App;
