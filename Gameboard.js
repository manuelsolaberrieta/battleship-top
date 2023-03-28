import Ship from "./Ship.js";
import Sound from "./Sound.js";

export default class Gameboard {
  constructor(boardElement, isPc, playerName, screen) {
    this.board = document.querySelector(`${boardElement}`);
    this.grid = this.makeGrid();
    this.ships = this.makeShips();
    this.sunk = 0;
    this.gameOver = false;
    this.revealShips = false;
    this.thisTurn = false;
    this.shipsPlaced = [];
    this.isPc = isPc;
    this.playerName = playerName;
    this.screen = screen;
    this.lastAttack = undefined;
    this.lastAttackThatHit = undefined;
    this.pcTries = 0;
    this.hitSound = new Sound("sounds/hit-ship.mp3");
    this.sunkSound = new Sound("sounds/ship-sunk.mp3");
    this.missSound = new Sound("sounds/miss-ship.mp3");
  }

  setEnemy(enemyBoard, enemyName) {
    this.enemyBoard = enemyBoard;
    this.enemyName = enemyName;
  }

  startBoard(start) {
    this.start = start;
  }

  makeGrid() {
    let grid = [];
    let rows = 10;
    let columns = 10;
    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < columns; j++) {
        grid[i][j] = { coords: [i, j], state: "none", shipIndex: undefined };
      }
    }
    return grid;
  }

  makeShips() {
    const sizes = [5, 4, 3, 3, 2];
    const names = [
      "Carrier",
      "Battleship",
      "Cruiser",
      "Submarine",
      "Destroyer",
    ];
    const shipsArr = [];
    for (let i = 0; i < sizes.length; i++) {
      let ship = new Ship(sizes[i]);
      ship.index = i;
      ship.name = names[i];
      shipsArr.push(ship);
    }
    return shipsArr;
  }

  displayGrid() {
    this.board.replaceChildren();
    this.grid.forEach((arr, i) => {
      arr.forEach((place, j) => {
        const square = document.createElement("div");
        square.setAttribute("row", `${this.grid[i][j].coords[0]}`);
        square.setAttribute("col", `${this.grid[i][j].coords[1]}`);
        square.addEventListener("click", () => {
          this.receiveAttack([i, j]);
        });
        if (place.state == "ship") {
          if (this.revealShips == true) {
            square.classList.add("ship-square");
          } else {
            square.classList.add("pc-water-square");
          }
        } else if (place.state == "none") {
          if (this.isPc) {
            square.classList.add("pc-water-square");
          } else {
            square.classList.add("water-square");
          }
        } else if (place.state == "miss") {
          square.classList.add("missed-square");
        } else if (place.state == "hit") {
          square.classList.add("hit-square");
        }
        this.board.append(square);
      });
    });
  }

  placementIsValid(ship, coords, HoV) {
    const shipLength = ship.length;
    let row = coords[0];
    let col = coords[1];
    if (HoV == "Horizontal") {
      if (col + shipLength - 1 > 9) {
        return false;
      } else {
        for (let i = 0; i < ship.length; i++) {
          if (this.grid[row][col].state == "ship") {
            return false;
          } else {
            col += 1;
          }
        }
        return true;
      }
    } else if (HoV == "Vertical") {
      if (row + shipLength - 1 > 9) {
        return false;
      } else {
        for (let i = 0; i < ship.length; i++) {
          if (this.grid[row][col].state == "ship") {
            return false;
          } else {
            row += 1;
          }
        }
        return true;
      }
    }
  }

  placeShip(ship, coords, HoV = "Horizontal") {
    if (this.placementIsValid(ship, coords, HoV)) {
      let row = coords[0];
      let col = coords[1];
      for (let i = 0; i < ship.length; i++) {
        ship.position.push([row, col]);
        this.grid[row][col].state = "ship";
        this.grid[row][col].shipIndex = ship.index;
        if (HoV == "Horizontal") {
          col += 1;
        } else {
          row += 1;
        }
      }
      this.shipsPlaced.push(ship.index);
      this.displayGrid();
      if (this.shipsPlaced.length == this.ships.length) {
        this.thisTurn = false;
        this.enemyBoard.thisTurn = true;
        this.screen.textContent = "Press start when all ships are placed";
        return true;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  showOrHideShips() {
    this.revealShips == true
      ? (this.revealShips = false)
      : (this.revealShips = true);
    this.displayGrid();
  }

  receiveAttack(coords) {
    if (this.enemyBoard.shipsPlaced.length != this.enemyBoard.ships.length) {
      this.screen.textContent = "All ships must be placed first";
      return false;
    }
    if (this.shipsPlaced.length != this.ships.length) {
      this.screen.textContent = "All ships must be placed first";
      return false;
    }
    if (!this.start) {
      this.screen.textContent = "Click Start button to commence";
      return false;
    }
    if (this.gameOver || this.enemyBoard.gameOver) {
      return false;
    }
    if (this.thisTurn == true) {
      return false;
    }
    let row = coords[0];
    let col = coords[1];
    let touchedShip;
    if (this.grid[row][col].state === "ship") {
      //play hit sound here
      this.hitSound.play();
      this.screen.textContent =
        this.enemyName + " hits a ship, " + this.playerName + " turn";
      this.enemyBoard.thisTurn = false;
      this.thisTurn = true;
      touchedShip = this.grid[row][col].shipIndex;
      this.ships[touchedShip].hit();
      this.grid[row][col].state = "hit";
      this.displayGrid();
      if (this.ships[touchedShip].isSunk()) {
        //play sunk sound here
        this.sunkSound.play();
        this.sunk += 1;
        this.screen.textContent =
          this.enemyName + " sinks a ship, " + this.playerName + " turn";
        if (this.sunk == this.ships.length) {
          //play game over sound here
          this.screen.textContent = "Game Over!";
          this.gameOver = true;
        }
      }
    } else if (this.grid[row][col].state === "none") {
      //play miss sound here
      this.missSound.play();
      this.screen.textContent =
        this.enemyName + " misses, " + this.playerName + " turn";
      this.thisTurn = true;
      this.enemyBoard.thisTurn = false;
      this.grid[row][col].state = "miss";
      this.displayGrid();
    } else if (this.grid[row][col].state === "miss") {
      this.screen.textContent = "Already shot there, fire again";
      this.thisTurn = false;
      this.enemyBoard.thisTurn = true;
      return false;
    } else if (this.grid[row][col].state === "hit") {
      this.screen.textContent = "Already shot there, fire again";
      this.thisTurn = false;
      this.enemyBoard.thisTurn = true;
      return false;
    }
    if (this.isPc && this.thisTurn == true) {
      setTimeout(() => {
        this.enemyBoard.receiveAttack(this.computerAttack());
      }, 1500);
    }
  }

  computerPlacement(shipNumber) {
    let currentPlacement = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ];
    let HoV = Math.floor(Math.random() * 2);
    if (HoV < 1) {
      HoV = "Horizontal";
    } else {
      HoV = "Vertical";
    }
    while (
      this.placeShip(
        this.ships[shipNumber],
        [currentPlacement[0], currentPlacement[1]],
        HoV
      ) == false
    ) {
      currentPlacement[0] = Math.floor(Math.random() * 10);
      currentPlacement[1] = Math.floor(Math.random() * 10);
    }
    return currentPlacement;
  }
  computerAttackFollowUp() {
    if (this.lastAttackThatHit == undefined) {
      return false;
    }
    if (this.pcTries > 3) {
      this.pcTries = 0;
      return false;
    }
    let baseAttack;
    if (this.lastAttack.state == "hit") {
      this.pcTries = 0;
      baseAttack = this.lastAttack;
    } else {
      this.pcTries += 1;
      baseAttack = this.lastAttackThatHit;
    }
    const coords = baseAttack.coords;
    const row = coords[0];
    const col = coords[1];
    const possibleGuess = [
      [row + 1, col],
      [row - 1, col],
      [row, col + 1],
      [row, col - 1],
    ];
    let nextAttack;
    for (let i = 0; i < possibleGuess.length; i++) {
      nextAttack = possibleGuess[i];
      if (nextAttack[0] < 10 && nextAttack[1] < 10) {
        if (
          this.enemyBoard.grid[nextAttack[0]][nextAttack[1]].state != "miss" &&
          this.enemyBoard.grid[nextAttack[0]][nextAttack[1]].state != "hit"
        ) {
          if (
            this.enemyBoard.grid[nextAttack[0]][nextAttack[1]].state == "ship"
          ) {
            this.lastAttackThatHit =
              this.enemyBoard.grid[nextAttack[0]][nextAttack[1]];
            this.lastAttack =
              this.enemyBoard.grid[nextAttack[0]][nextAttack[1]];
          } else {
            this.lastAttack =
              this.enemyBoard.grid[nextAttack[0]][nextAttack[1]];
          }
          return nextAttack;
        }
      } else {
        continue;
      }
    }
    return false;
  }
  computerAttack() {
    let nextAttack = this.computerAttackFollowUp();
    if (nextAttack != false) {
      return nextAttack;
    }
    let currentAttack = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ];
    while (
      this.enemyBoard.grid[currentAttack[0]][currentAttack[1]].state ==
        "miss" ||
      this.enemyBoard.grid[currentAttack[0]][currentAttack[1]].state == "hit"
    ) {
      currentAttack[0] = Math.floor(Math.random() * 10);
      currentAttack[1] = Math.floor(Math.random() * 10);
    }
    if (
      this.enemyBoard.grid[currentAttack[0]][currentAttack[1]].state == "ship"
    ) {
      this.lastAttackThatHit =
        this.enemyBoard.grid[currentAttack[0]][currentAttack[1]];
      this.lastAttack =
        this.enemyBoard.grid[currentAttack[0]][currentAttack[1]];
    } else if (
      this.enemyBoard.grid[currentAttack[0]][currentAttack[1]].state == "none"
    ) {
      this.lastAttack =
        this.enemyBoard.grid[currentAttack[0]][currentAttack[1]];
    }
    return currentAttack;
  }
}
