import { Cell } from "./cell.js";
const sizeGrid = 4;
// The amount of cells is 4 * 4 = 16 cells
const cellsAmount = sizeGrid * sizeGrid;
export class Grid {
  constructor(gridEl) {
    this.cells = [];
    for (let i = 0; i < cellsAmount; i++) {
      // At each iteration of loop we adding a new cell with push()
      this.cells.push(new Cell(gridEl, i % sizeGrid, Math.floor(i / sizeGrid))); // A new cell is an instance of a class Cell with three arguments: gridEl for adding a new cell inside the <din id="game-field">
      // and its coordinates x / y
    }
    // Realization of cell movements to the top, where cells are grouped by columns
    this.cellsClusteredByColumn = this.clusterCellsByColumn();
    // Realization of cell movements to the bottom, where cells are grouped by columns
    this.cellsClusteredByReversedColumn = this.cellsClusteredByColumn.map(
      (column) => [...column].reverse()
    );
    // Realization of cell movements to the left, where they are grouped into rows
    this.cellsClusteredByRow = this.ClusteredCellsByRow();
    // Realization of cell movements to the right, where they are grouped into rows
    this.cellsClusteredByReversedRow = this.cellsClusteredByRow.map((row) =>
      [...row].reverse()
    );
  }
  // Method to find all empty cells
  getRandomEmptyCell() {
    // Method isEmpty() checks for empty cells
    const emptyCells = this.cells.filter((cell) => cell.isEmpty());
    // We get a random cell among all empty cells by multiplying Math.random() by the array's length and get a random number from 0 to the array's length without the last number of the array
    const rndmIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[rndmIndex];
  }
  // Method of creating an array from a column
  clusterCellsByColumn() {
    return this.cells.reduce((clusteredCells, cell) => {
      // clusteredCells is a method's accumulator with initial value as an empty array; cell is another cell in the array this.cells
      clusteredCells[cell.x] = clusteredCells[cell.x] || []; // cell.x is a column's number
      // After enumerating the elements, we will fill all columns and in each column all positions; as a result, we will get a new array of columns with cells
      clusteredCells[cell.x][cell.y] = cell;
      return clusteredCells;
    }, []);
  }
  // Method of creating an array from a row
  ClusteredCellsByRow() {
    return this.cells.reduce((clusteredCells, cell) => {
      // Now we use Y to create an array of items from a row instead of a column
      clusteredCells[cell.y] = clusteredCells[cell.y] || [];
      clusteredCells[cell.y][cell.x] = cell;
      return clusteredCells;
    }, []);
  }
}
