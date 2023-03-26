import Gameboard from "./Gameboard.js";
export default class Player {
  constructor(name = "Player1", boardHTML, isPc, screen) {
    this.name = name;
    this.board = new Gameboard(boardHTML, isPc, this.name, screen);
  }
}
