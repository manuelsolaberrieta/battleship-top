import Ship from "./Ship.js";

export default class Gameboard {
  constructor(boardElement, isPc, playerName) {
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
  }

  setEnemy(enemyBoard, enemyName) {
    this.enemyBoard = enemyBoard;
    this.enemyName = enemyName;
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
  /////CHANGE ALL CONSOLE LOGS TO HTML UI WHEN FINISHED
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
          //cambiar cuando termine las pruebas
          if (this.revealShips == true) {
            square.classList.add("ship-square");
          } else {
            square.classList.add("aaaa-square");
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
        console.log(this.enemyName + " turn");
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
      console.log("must place ships first");
      return false;
    }
    if (this.gameOver || this.enemyBoard.gameOver) {
      return false;
    }
    if (this.thisTurn == true) {
      console.log("You can't attack yourself");
      return false;
    }
    let row = coords[0];
    let col = coords[1];
    let touchedShip;
    if (this.grid[row][col].state === "ship") {
      console.log("Hit a ship");
      this.enemyBoard.thisTurn = false;
      this.thisTurn = true;
      console.log(this.playerName + " turn");
      touchedShip = this.grid[row][col].shipIndex;
      this.ships[touchedShip].hit();
      this.grid[row][col].state = "hit";
      this.displayGrid();
      if (this.ships[touchedShip].isSunk()) {
        this.sunk += 1;
        console.log("ship sunk");
        if (this.sunk == this.ships.length) {
          console.log("game over");
          this.gameOver = true;
        }
      }
    } else if (this.grid[row][col].state === "none") {
      console.log("Missed");
      this.thisTurn = true;
      this.enemyBoard.thisTurn = false;
      console.log(this.playerName + " turn");
      this.grid[row][col].state = "miss";
      this.displayGrid();
    } else if (this.grid[row][col].state === "miss") {
      console.log("Hit a miss, should fire again");
      this.thisTurn = false;
      this.enemyBoard.thisTurn = true;
      console.log(this.enemyName + " turn");
      return false;
    } else if (this.grid[row][col].state === "hit") {
      console.log("Already hit, should fire again");
      this.thisTurn = false;
      this.enemyBoard.thisTurn = true;
      console.log(this.enemyName + " turn");
      return false;
    }
    if (this.isPc && this.thisTurn == true) {
      this.enemyBoard.receiveAttack(this.computerAttack());
    }
  }

  computerPlacement(shipNumber) {
    let currentPlacement = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ];
    while (
      this.placeShip(this.ships[shipNumber], [
        currentPlacement[0],
        currentPlacement[1],
      ]) == false
    ) {
      currentPlacement[0] = Math.floor(Math.random() * 10);
      currentPlacement[1] = Math.floor(Math.random() * 10);
    }
    return currentPlacement;
  }
  computerAttack() {
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
    return currentAttack;
  }
}
