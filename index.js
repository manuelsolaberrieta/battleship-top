import Player from "./Player.js";
import Drag from "./Drag.js";

//Creating objects
const player = new Player("player", "#player-board", false);
const pc = new Player("computer", "#pc-board", true);

//Setting one against each other
player.board.setEnemy(pc.board, pc.name);
pc.board.setEnemy(player.board, player.name);

//AGREGAR VERTICAL, AGREGAR IMAGENES
let HoV = "Horizontal";

//Displaying grid for first time manually and making player ships visible
player.board.displayGrid();
pc.board.displayGrid();
player.board.showOrHideShips();

//Handling dragging
const playerDrag = new Drag(player);
document.querySelector(".garage").append(playerDrag.putShipsUpForGrabbing());
playerDrag.makeDraggable();

//Prepare game for playing against pc
pc.board.thisTurn = true;
function randomizeShips(player) {
  for (let i = 0; i < player.board.ships.length; i++) {
    if (player.board.shipsPlaced.indexOf(i) >= 0) {
      continue;
    } else {
      player.board.computerPlacement(i);
    }
  }
}
randomizeShips(pc);

//Add option to randomize ships to player
const rando = document.createElement("button");
rando.textContent = "Randomize your ships";
rando.addEventListener("click", () => {
  if (player.board.shipsPlaced.length != player.board.ships.length) {
    randomizeShips(player);
    document.querySelectorAll(".ship-frame").forEach((shipframe) => {
      shipframe.remove();
    });
  } else {
    console.log("you already placed your ships");
  }
});
document.querySelector("#buttons").append(rando);
