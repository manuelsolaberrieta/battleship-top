export default class Drag {
  constructor(player) {
    this.player = player;
  }
  setShipDirection(dir) {
    this.direction = dir;
  }
  getShipDirection() {
    return this.direction;
  }
  putShipsUpForGrabbing() {
    const shipsContainer = document.createElement("div");
    shipsContainer.classList.add("ships-container");
    for (let i = 0; i < this.player.board.ships.length; i++) {
      const shipFrame = document.createElement("div");
      shipFrame.classList.add("ship-frame");
      for (let j = 0; j < this.player.board.ships[i].length; j++) {
        const shipPiece = document.createElement("span");
        shipPiece.classList.add("ship-piece");
        shipFrame.append(shipPiece);
      }
      shipFrame.setAttribute("draggable", "true");
      shipFrame.setAttribute("id", `${this.player.board.ships[i].index}`);
      shipFrame.style.flexDirection = "row";
      shipFrame.addEventListener("dragstart", this.dragStart);
      shipsContainer.append(shipFrame);
    }
    return shipsContainer;
  }
  makeDraggable() {
    const waterSquare = document.querySelectorAll(".water-square");
    waterSquare.forEach((box) => {
      box.addEventListener("dragenter", this.dragEnter);
      box.addEventListener("dragover", this.dragOver);
      box.addEventListener("dragleave", this.dragLeave);
      //arrow function "this" is the object that calls it, NOT the element that has the event
      box.addEventListener("drop", (e) => this.drop(e));
    });
  }
  dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
  }

  dragEnter(e) {
    e.preventDefault();
    e.target.classList.add("drag-over");
  }

  dragOver(e) {
    e.preventDefault();
    e.target.classList.add("drag-over");
  }

  dragLeave(e) {
    e.target.classList.remove("drag-over");
  }

  drop(e) {
    e.target.classList.remove("drag-over");
    const id = e.dataTransfer.getData("text/plain");
    if (
      this.player.board.placeShip(
        this.player.board.ships[id],
        [
          parseInt(e.target.getAttribute("row")),
          parseInt(e.target.getAttribute("col")),
        ],
        this.getShipDirection()
      )
    ) {
      //so the ship dissapears from the garage
      const draggable = document.getElementById(id);
      e.target.appendChild(draggable);
    }
    //so the drag events are added again after being overriden by displaygrid()
    this.makeDraggable();
  }
  changeDirection(e) {
    let dir = e.getAttribute("dir");
    dir == "Horizontal"
      ? e.setAttribute("dir", "Vertical")
      : e.setAttribute("dir", "Horizontal");
    this.setShipDirection(dir);
    e.textContent = "Change ship direction";
  }
  changeFlex(flex) {
    flex == "Vertical" ? (flex = "row") : (flex = "column");
    const shipFrames = document.querySelectorAll(".ship-frame");
    shipFrames.forEach((shipFrame) => {
      shipFrame.style.flexDirection = flex;
    });
  }
}
