const gridSize = 4;
let grid;
let score = 0;

// Initialize the game
function initializeGame() {
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  score = 0;
  updateScore();
  addRandomTile();
  addRandomTile();
  renderGrid();
}

// Add a random tile (2 or 4) to an empty cell
function addRandomTile() {
  const emptyCells = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === 0) {
        emptyCells.push({ i, j });
      }
    }
  }
  if (emptyCells.length > 0) {
    const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[i][j] = Math.random() < 0.9 ? 2 : 4;
  }
}

// Render the grid
function renderGrid() {
  const gridElement = document.querySelector(".grid");
  gridElement.innerHTML = "";
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.textContent = grid[i][j] !== 0 ? grid[i][j] : "";
      tile.setAttribute("data-value", grid[i][j]);
      gridElement.appendChild(tile);
    }
  }
}

// Merge tiles in a row or column
function merge(line) {
  let merged = line.filter(num => num !== 0);
  for (let i = 0; i < merged.length - 1; i++) {
    if (merged[i] === merged[i + 1]) {
      merged[i] *= 2;
      score += merged[i]; // Update score
      merged[i + 1] = 0;
    }
  }
  merged = merged.filter(num => num !== 0);
  while (merged.length < gridSize) {
    merged.push(0);
  }
  return merged;
}

// Move tiles in a direction
function move(direction) {
  let moved = false;
  const newGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

  if (direction === "left") {
    for (let i = 0; i < gridSize; i++) {
      const merged = merge(grid[i]);
      newGrid[i] = merged;
      if (merged.toString() !== grid[i].toString()) moved = true;
    }
  } else if (direction === "right") {
    for (let i = 0; i < gridSize; i++) {
      const merged = merge(grid[i].slice().reverse()).reverse();
      newGrid[i] = merged;
      if (merged.toString() !== grid[i].toString()) moved = true;
    }
  } else if (direction === "up") {
    for (let j = 0; j < gridSize; j++) {
      const column = grid.map(row => row[j]);
      const merged = merge(column);
      for (let i = 0; i < gridSize; i++) {
        newGrid[i][j] = merged[i];
      }
      if (merged.toString() !== column.toString()) moved = true;
    }
  } else if (direction === "down") {
    for (let j = 0; j < gridSize; j++) {
      const column = grid.map(row => row[j]).reverse();
      const merged = merge(column).reverse();
      for (let i = 0; i < gridSize; i++) {
        newGrid[i][j] = merged[i];
      }
      if (merged.toString() !== column.toString()) moved = true;
    }
  }

  if (moved) {
    grid = newGrid;
    addRandomTile();
    renderGrid();
    updateScore();
    if (isGameOver()) {
      alert("Game Over! Your score: " + score);
    }
  }
}

// Check if the game is over
function isGameOver() {
  // Check if there are any empty tiles
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === 0) {
        return false; // Game is not over if there's an empty tile
      }
    }
  }

  // Check for possible merges in rows and columns
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize - 1; j++) {
      if (grid[i][j] === grid[i][j + 1]) {
        return false; // Game is not over if horizontal merge is possible
      }
    }
  }

  for (let j = 0; j < gridSize; j++) {
    for (let i = 0; i < gridSize - 1; i++) {
      if (grid[i][j] === grid[i + 1][j]) {
        return false; // Game is not over if vertical merge is possible
      }
    }
  }

  // If no empty tiles and no possible merges, game is over
  return true;
}

// Update the score display
function updateScore() {
  document.getElementById("score").textContent = score;
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") move("left");
  else if (e.key === "ArrowRight") move("right");
  else if (e.key === "ArrowUp") move("up");
  else if (e.key === "ArrowDown") move("down");
});

// Reset the game
document.getElementById("reset-button").addEventListener("click", () => {
  initializeGame();
});

// Start the game
initializeGame();