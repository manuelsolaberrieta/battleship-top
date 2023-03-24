import Ship from "./Ship.js";
export default class Gameboard {
  constructor(boardElement) {
    this.board = document.querySelector(`${boardElement}`);
    this.grid = this.makeGrid();
    this.ships = this.makeShips();
    this.sunk = 0;
    this.gameOver = false;
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
    const shipsArr = [];
    for (let i = 0; i < sizes.length; i++) {
      let ship = new Ship(sizes[i]);
      ship.index = i;
      shipsArr.push(ship);
    }
    return shipsArr;
  }

  displayGrid(own = false) {
    this.board.replaceChildren();
    this.grid.forEach((arr, i) => {
      arr.forEach((place, j) => {
        const square = document.createElement("div");
        if (own == false) {
          square.addEventListener("click", () => {
            this.receiveAttack([i, j]);
          });
        }
        if (place.state == "ship") {
          //cambiar cuando termine las pruebas
          square.classList.add("aaaaa-square");
        } else if (place.state == "none") {
          square.classList.add("water-square");
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
      if (col + shipLength > 9) {
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
      if (row + shipLength > 9) {
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
      this.displayGrid();
    } else {
      return false;
    }
  }

  receiveAttack(coords) {
    //move gameover to index script
    if (this.gameOver) {
      return false;
    }
    let row = coords[0];
    let col = coords[1];
    let touchedShip;
    if (this.grid[row][col].state === "ship") {
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
    } else if (this.grid[row][col].state === "miss") {
      return false;
    } else if (this.grid[row][col].state === "none") {
      this.grid[row][col].state = "miss";
      this.displayGrid();
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
}
