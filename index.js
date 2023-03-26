import Player from "./Player.js";
import Drag from "./Drag.js";

//If I were to do this project again, I would do it very differently.
//But as I do stuff I learn stuff, I am not yet a pro dev. Even then I'd still want to (and should) keep learning

//Get the element where messages will be displayed
const messageScreen = document.querySelector("#message");

//Creating objects
const player = new Player("player", "#player-board", false, messageScreen);
const pc = new Player("computer", "#pc-board", true, messageScreen);

//Setting one against each other
player.board.setEnemy(pc.board, pc.name);
pc.board.setEnemy(player.board, player.name);

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

messageScreen.textContent = "Place your ships";

//Add option to randomize player ships
const rando = document.querySelector("#rando");
rando.addEventListener("click", () => {
  if (player.board.shipsPlaced.length != player.board.ships.length) {
    randomizeShips(player);
    document.querySelectorAll(".ship-frame").forEach((shipframe) => {
      shipframe.remove();
    });
  } else {
    messageScreen.textContent = "you already placed your ships";
  }
});
document.querySelector("#buttons").append(rando);

//Add option to change ship positioning direction
const direction = document.querySelector("#direction");
direction.addEventListener("click", (e) => {
  playerDrag.changeDirection(e.target);
  playerDrag.changeFlex(e.target.getAttribute("dir"));
});

//Add start button so the AI properly starts attacking
function start(player1, pcPlayer) {
  if (player1.board.start == true || pcPlayer.board.start == true) {
    messageScreen.textContent = "Game already started";
    return false;
  } else if (
    player1.board.shipsPlaced.length != player1.board.ships.length ||
    pcPlayer.board.shipsPlaced.length != pcPlayer.board.ships.length
  ) {
    messageScreen.textContent = "All ships must be placed first";
  } else if (
    player1.board.shipsPlaced.length == player1.board.ships.length &&
    pcPlayer.board.shipsPlaced.length == pcPlayer.board.ships.length
  ) {
    messageScreen.textContent = "Pc turn, wait";
    setTimeout(() => {
      player1.board.startBoard(true);
      pcPlayer.board.startBoard(true);
      player1.board.receiveAttack(pcPlayer.board.computerAttack());
    }, 1500);
  }
}
const startBtn = document.querySelector("#start");
startBtn.addEventListener("click", () => {
  start(player, pc);
});
