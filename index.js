import Player from "./Player.js";
import Drag from "./Drag.js";

const player = new Player("player", "#player-board", false);
const pc = new Player("computer", "#pc-board", true);
player.board.setEnemy(pc.board, pc.name);
pc.board.setEnemy(player.board, player.name);
const playerDrag = new Drag(player);

let HoV = "Horizontal";

player.board.displayGrid();
pc.board.displayGrid();
player.board.showOrHideShips();

//Populating pc board...
pc.board.thisTurn = true;
for (let i = 0; i < pc.board.ships.length; i++) {
  pc.board.computerPlacement(i);
}

//Handling dragging...
document.querySelector(".garage").append(playerDrag.putShipsUpForGrabbing());
playerDrag.makeDraggable();

//Game loop for playing against pc
