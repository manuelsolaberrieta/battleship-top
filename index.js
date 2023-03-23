import Ship from "./Ship.js";
import Player from "./Player.js";
import Gameboard from "./Gameboard.js";
const playerBoard = new Gameboard();
const pc = new Player("computer");
playerBoard.displayGrid();
playerBoard.placeShip(playerBoard.ships[0], [8, 1]);
for (let i = 0; i < 5; i++) {
  playerBoard.receiveAttack(pc.computerAttack(playerBoard));
}
