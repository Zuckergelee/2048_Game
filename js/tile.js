export class Tile {
  constructor(gridEl) {
    // The constructor accepts a game grid's cell to create within it a new tile with random value from 2 to 4
    this.tileEl = document.createElement("div"); // Creating a new div-container through document.createElement() and saving it in tileEl
    // Inserting a new class = "tile" through classList.add() inside the div-container
    this.tileEl.classList.add("tile");
    // Any tile must have a value from 2 to 4; so if random method's value > 0.5 then tile's value = 2 otherwise tile's value = 4
    this.setValue(Math.random() > 0.5 ? 2 : 4);
    // Inserting a new element inside <div class="game-field">
    gridEl.append(this.tileEl);
  }
  // Method to change tile's coordinates to new ones and variable values --x and --y in style.css
  setXY(x, y) {
    this.x = x;
    this.y = y;
    this.tileEl.style.setProperty("--x", x);
    this.tileEl.style.setProperty("--y", y);
  }
  // Method to change tile's values and lightness
  setValue(value) {
    this.value = value;
    // Adding the received value inside the <div class="tile"> as text
    this.tileEl.textContent = value;
    const bgLightness = 100 - Math.log2(value) * 9;
    this.tileEl.style.setProperty("--bg-lightness", `${bgLightness}%`);
  }
  // Method to remove tile from the game field after merging identical tiles
  removeFromPR() {
    this.tileEl.remove();
  }
  // A method to return a promis that will end when the tile movement animation ends
  waitForEndOfTransit() {
    return new Promise((resolve) => {
      this.tileEl.addEventListener("transitionend", resolve, { once: true });
    });
  }
  // Similarly with waiting for new tile appearance animation ends
  waitForEndOfAnimation() {
    return new Promise((resolve) => {
      this.tileEl.addEventListener("animationend", resolve, { once: true });
    });
  }
}
