import { Grid } from "./grid.js";
import { Tile } from "./tile.js";
// Accept the div-container with id="game-field" where the game field is stored
const gameField = document.getElementById("game-field");
// A class that stores all the cells of the game field with cells 4x4
const grid = new Grid(gameField);
// Each game start, two tiles with random values (from 2 to 4) are created in the grid and binded (bindTile()) to random game field's cells
grid.getRandomEmptyCell().bindTile(new Tile(gameField));
grid.getRandomEmptyCell().bindTile(new Tile(gameField));
setupInputOnce();
// Function to subscribe to push arrows on the keyboard, but once; after that keyInput-function is called
function setupInputOnce() {
  window.addEventListener("keydown", keyInput, { once: true });
}
async function keyInput(event) {
  switch (event.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInputOnce();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInputOnce();
        return;
      }
      await moveDown();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInputOnce();
        return;
      }
      await moveRight();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInputOnce();
        return;
      }
      await moveLeft();
      break;
    default:
      setupInputOnce();
      return;
  }
  // After each tile move, a new tile is created in a random empty cell
  const newTile = new Tile(gameField);
  grid.getRandomEmptyCell().bindTile(newTile);
  // If you cannot move the tiles sideways, the game ends
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    await newTile.waitForEndOfAnimation();
    alert("Try again!");
    window.location.reload();
    return;
  }
  // After a keydown-event or end of game we subscribe to a new keydown-event
  setupInputOnce();
}
async function moveUp() {
  // We're grouping four cells into an array of columns; grouping four colums into a common array; going through the cells to find tiles, and then moving the tiles upward
  await slideTiles(grid.cellsClusteredByColumn);
}
async function moveDown() {
  // Same, but we're reversing the order of the cells in columns
  await slideTiles(grid.cellsClusteredByReversedColumn);
}
async function moveLeft() {
  // Same, but we're grouping four cells into an array of rows
  await slideTiles(grid.cellsClusteredByRow);
}
async function moveRight() {
  // Same, but we're reversing the order of the cells in rows
  await slideTiles(grid.cellsClusteredByReversedRow);
}
// Method to move tiles
async function slideTiles(clusteredCells) {
  // Promises to wait for each moving animations' ends before merging same tiles together
  const promises = [];
  clusteredCells.forEach((group) => slideTilesInCluster(group, promises));
  await Promise.all(promises);
  grid.cells.forEach((cell) => {
    cell.hasTileForUnion() && cell.unionTiles();
  });
}
// Method for clustering tiles
function slideTilesInCluster(group, promises) {
  for (let i = 1; i < group.length; i++) {
    // The cell must be checked for emptiness to bound a tile to it; if the cell is empty, we're aborting the current iteration of the loop and going to the next one
    if (group[i].isEmpty()) {
      continue;
    }
    // If the condition didn't work, we put the cell into the variable cellWithTile
    const cellWithTile = group[i];
    // Our target cell
    let targetCell;
    // We're looping through all cells that are above the target cell
    let j = i - 1;
    // Loop condition: we haven't reached the top and the cell being checked will be able to accept the target tile (it's empty or with the same value as the target tile)
    while (j >= 0 && group[j].canObtain(cellWithTile.boundTile)) {
      targetCell = group[j];
      j--;
    }
    if (!targetCell) {
      continue;
    }
    // If the target cell is found, we adding a promise to the array to wait for the tile moving animation to end
    promises.push(cellWithTile.boundTile.waitForEndOfTransit());
    if (targetCell.isEmpty()) {
      targetCell.bindTile(cellWithTile.boundTile);
    } else {
      targetCell.bindTileForUnion(cellWithTile.boundTile);
    }
    // Clearing the freed cell
    cellWithTile.clearTile();
  }
}
// Similar to slideTiles(), call the canMove-method inside the function together with grid.cellsClusteredByColumn
function canMoveUp() {
  return canMove(grid.cellsClusteredByColumn);
}
function canMoveDown() {
  return canMove(grid.cellsClusteredByReversedColumn);
}
function canMoveRight() {
  return canMove(grid.cellsClusteredByReversedRow);
}
function canMoveLeft() {
  return canMove(grid.cellsClusteredByRow);
}
// Together with method some(), we're checking whether at least one of the columns/rows can move
function canMove(groupedCells) {
  return groupedCells.some((group) => canMoveInGroup(group));
}
// We need to check if a tile can move to neighboring cells
function canMoveInGroup(group) {
  return group.some((cell, index) => {
    // If the tile's index = 0, then this is the outermost cell
    if (index === 0) return false;

    // The target cell is the cell that is next; we just have to check if the next cell can tie a tile from the current cell
    if (cell.isEmpty()) return false;
    const targetCell = group[index - 1];
    return targetCell.canObtain(cell.boundTile);
  });
}
