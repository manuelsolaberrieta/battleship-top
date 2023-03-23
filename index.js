import Player from "./Player.js";
import Gameboard from "./Gameboard.js";
const playerBoard = new Gameboard("#player-board");
const computerBoard = new Gameboard("#pc-board");
const pc = new Player("computer");
playerBoard.displayGrid();
computerBoard.displayGrid();
playerBoard.placeShip(playerBoard.ships[0], [8, 1]);

for (let i = 0; i < computerBoard.ships.length; i++) {
  computerBoard.computerPlacement(i);
}
