import Player from "./Player.js";

const player = new Player("player", "#player-board");
const pc = new Player("computer", "#pc-board");

player.board.displayGrid();
pc.board.displayGrid();

//Populate pc board
for (let i = 0; i < pc.board.ships.length; i++) {
  pc.board.computerPlacement(i);
}

//Add player ships before dragging events
function putShipsUpForGrabbing() {
  const shipsContainer = document.createElement("div");
  shipsContainer.classList.add("ships-container");
  for (let i = 0; i < player.board.ships.length; i++) {
    const shipFrame = document.createElement("div");
    shipFrame.classList.add("ship-frame");
    for (let j = 0; j < player.board.ships[i].length; j++) {
      const shipPiece = document.createElement("span");
      shipPiece.classList.add("ship-piece");
      shipFrame.append(shipPiece);
    }
    shipFrame.setAttribute("draggable", "true");
    shipFrame.setAttribute("id", `${player.board.ships[i].index}`);
    shipFrame.addEventListener("dragstart", dragStart);
    shipsContainer.append(shipFrame);
  }
  return shipsContainer;
}

//Handle dragging
document.querySelector(".garage").append(putShipsUpForGrabbing());

function makeDraggable() {
  const waterSquare = document.querySelectorAll(".water-square");
  waterSquare.forEach((box) => {
    box.addEventListener("dragenter", dragEnter);
    box.addEventListener("dragover", dragOver);
    box.addEventListener("dragleave", dragLeave);
    box.addEventListener("drop", drop);
  });
}

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
}

function dragEnter(e) {
  e.preventDefault();
  e.target.classList.add("drag-over");
}

function dragOver(e) {
  e.preventDefault();
  e.target.classList.add("drag-over");
}

function dragLeave(e) {
  e.target.classList.remove("drag-over");
}

function drop(e) {
  e.target.classList.remove("drag-over");
  const id = e.dataTransfer.getData("text/plain");
  if (
    player.board.placeShip(player.board.ships[id], [
      parseInt(e.target.getAttribute("row")),
      parseInt(e.target.getAttribute("col")),
    ])
  ) {
    //so the ship dissapears from the garage
    const draggable = document.getElementById(id);
    e.target.appendChild(draggable);
  }
  //so the drag events are added again after being overriden by displaygrid()
  makeDraggable();
}

makeDraggable();
