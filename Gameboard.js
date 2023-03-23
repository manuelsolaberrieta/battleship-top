import Ship from "./Ship.js";
export default class Gameboard {
  constructor(boardElement) {
    this.board = document.querySelector(`${boardElement}`);
    this.grid = this.makeGrid();
    this.ships = this.makeShips();
  }

  makeGrid() {
    let grid = [];
    let rows = 10;
    let columns = 10;
    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < columns; j++) {
        grid[i][j] = { coords: [i, j], state: "none" };
      }
    }
    return grid;
  }

  makeShips() {
    const sizes = [5, 4, 3, 3, 2];
    const shipsArr = [];
    for (let i = 0; i < sizes.length; i++) {
      let ship = new Ship(sizes[i]);
      shipsArr.push(ship);
    }
    return shipsArr;
  }

  displayGrid() {
    this.board.replaceChildren();
    this.grid.forEach((arr, i) => {
      arr.forEach((place, j) => {
        const square = document.createElement("div");
        square.addEventListener("click", () => {
          this.receiveAttack([i, j]);
        });
        if (place.state == "ship") {
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

  placementIsValid(ship, coords, HoV = "Horizontal") {
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
    if (this.placementIsValid(ship, coords, (HoV = "Horizontal"))) {
      let row = coords[0];
      let col = coords[1];
      for (let i = 0; i < ship.length; i++) {
        ship.position.push([row, col]);
        this.grid[row][col].state = "ship";
        if (HoV == "Horizontal") {
          col += 1;
        } else {
          row += 1;
        }
      }
      this.displayGrid();
    } else {
      console.log("invalid placement");
      return false;
    }
  }

  receiveAttack(coords) {
    let row = coords[0];
    let col = coords[1];
    let touchedShip;
    let latLon = 0;
    if (this.grid[row][col].state === "ship") {
      for (let i = 0; i < this.ships.length; i++) {
        for (let j = 0; j < this.ships[i].position.length; j++) {
          for (let h = 0; h < this.ships[i].position[j].length; h++) {
            if (this.ships[i].position[j][h] == coords[h]) {
              latLon += 1;
            }
          }
          if (latLon == 2) {
            touchedShip = this.ships[i];
            touchedShip.hit();
          }
        }
      }
      this.grid[row][col].state = "hit";
      this.displayGrid();
      //see if i can move this function to index.js(gameloop)
      if (this.allSunk()) {
        //temporary game over screen
        document.querySelector("body").append("GAME OVER");
      }
    } else if (this.grid[row][col].state === "miss") {
      return false;
    } else if (this.grid[row][col].state === "none") {
      this.grid[row][col].state = "miss";
      this.displayGrid();
    }
  }

  allSunk() {
    let sunked = 0;
    this.ships.forEach((ship) => {
      if (ship.isSunk()) {
        sunked += 1;
      }
    });
    if (sunked === this.ships.length) {
      return true;
    } else {
      return false;
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
