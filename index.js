import Player from "./Player.js";
const player = new Player("player", "#player-board");
const pc = new Player("computer", "#pc-board");
player.board.displayGrid(true);
pc.board.displayGrid();
for (let i = 0; i < pc.board.ships.length; i++) {
  pc.board.computerPlacement(i);
}
