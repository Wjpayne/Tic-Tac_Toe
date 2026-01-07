// ------------------------
// Player Factory
// ------------------------
const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
};

// ------------------------
// Gameboard Module
// ------------------------
const Gameboard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const setCell = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const getBoard = () => [...board];

  const reset = () => {
    for (let i = 0; i < board.length; i++) board[i] = "";
  };

  return { setCell, getBoard, reset };
})();

// ------------------------
// Game Module
// ------------------------
const Game = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let gameOver = false;

  const start = (player1Name, player2Name) => {
    players = [Player(player1Name, "X"), Player(player2Name, "O")];
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.reset();
    DisplayController.render();
    DisplayController.updateResult(`${getCurrentPlayer().getName()}'s turn`);
  };

  const getCurrentPlayer = () => players[currentPlayerIndex];

  const playTurn = (index) => {
    // Prevent moves if game not started or over
    if (gameOver || players.length === 0) return;

    const marker = getCurrentPlayer().getMarker();
    if (Gameboard.setCell(index, marker)) {
      if (checkWin(marker)) {
        gameOver = true;
        DisplayController.updateResult(`${getCurrentPlayer().getName()} wins!`);
      } else if (checkTie()) {
        gameOver = true;
        DisplayController.updateResult(`It's a tie!`);
      } else {
        currentPlayerIndex = 1 - currentPlayerIndex;
        DisplayController.updateResult(`${getCurrentPlayer().getName()}'s turn`);
      }
      DisplayController.render();
    }
  };

  const checkWin = (marker) => {
    const b = Gameboard.getBoard();
    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return winPatterns.some(pattern => pattern.every(i => b[i] === marker));
  };

  const checkTie = () => {
    return Gameboard.getBoard().every(cell => cell !== "");
  };

  return { start, getCurrentPlayer, playTurn };
})();

// ------------------------
// Display Controller Module
// ------------------------
const DisplayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const resultDiv = document.getElementById("result");
  const restartBtn = document.getElementById("restart");
  const startBtn = document.getElementById("start");
  const player1Input = document.getElementById("player1");
  const player2Input = document.getElementById("player2");

  let boardActive = false; // Only allow clicks when true

  const render = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, i) => {
      cell.textContent = board[i];
    });
  };

  const updateResult = (message) => {
    resultDiv.textContent = message;
  };

  const bindEvents = () => {
    // Board click events
    cells.forEach((cell, i) => {
      cell.addEventListener("click", () => {
        if (!boardActive) return; // ignore clicks before start
        Game.playTurn(i);
      });
    });

    // Start button
    startBtn.addEventListener("click", () => {
      const p1 = player1Input.value || "Player 1";
      const p2 = player2Input.value || "Player 2";
      Game.start(p1, p2);
      boardActive = true;
    });

    // Restart button
    restartBtn.addEventListener("click", () => {
      const p1 = player1Input.value || "Player 1";
      const p2 = player2Input.value || "Player 2";
      Game.start(p1, p2);
      boardActive = true;
    });
  };

  return { bindEvents, render, updateResult };
})();

// ------------------------
// Initialize the game
// ------------------------
DisplayController.bindEvents();