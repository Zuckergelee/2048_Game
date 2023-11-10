export class Cell {
  constructor(gridEl, x, y) {
    // Accept the div-container with class="cell" and add it inside <div id="game-field">
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gridEl.append(cell);
    // Save coordinates of cell inside the class
    this.x = x;
    this.y = y;
  }
  // Method to set tile coordinates using setXY() and save the tile inside the cell
  bindTile(tile) {
    tile.setXY(this.x, this.y);
    this.boundTile = tile;
  }
  // Method to clear the current cell from a tile that has taken a new position
  clearTile() {
    this.boundTile = null;
  }
  // Method to return false or true depending on whether the cell has a bound tile
  isEmpty() {
    return !this.boundTile;
  }
  // Method to combine a tile with another tile
  bindTileForUnion(tile) {
    tile.setXY(this.x, this.y);
    this.boundTileForUnion = tile;
  }
  // Method to unbind a tile from the cell where it used to be before moving it and combining it with another tile
  unbindTileforUnion() {
    this.boundTileForUnion = null;
  }
  // Method to check if a tile is ready to be combined with the current tile
  hasTileForUnion() {
    return !!this.boundTileForUnion;
  }
  // A method to test whether tiles can be combined
  canObtain(newTile) {
    return (
      this.isEmpty() ||
      (!this.hasTileForUnion() && this.boundTile.value === newTile.value)
    );
  }
  // When we combine two tiles with the same values, we change the value of the bound tile by their sum
  unionTiles() {
    this.boundTile.setValue(
      this.boundTile.value + this.boundTileForUnion.value
    );
    // Removing the second tile from the layout
    this.boundTileForUnion.removeFromPR();
    // Unbinding the first tile from the cell where it was before
    this.unbindTileforUnion();
  }
}
