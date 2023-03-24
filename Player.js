import Gameboard from "./Gameboard.js";
export default class Player {
  constructor(name = "Player1", boardHTML) {
    this.name = name;
    this.board = new Gameboard(boardHTML);
  }
  computerAttack(board) {
    let currentAttack = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ];
    while (
      board[(currentAttack[0], currentAttack[1])].state == ("miss" || "hit")
    ) {
      currentAttack[0] = Math.floor(Math.random() * 10);
      currentAttack[1] = Math.floor(Math.random() * 10);
    }
    return currentAttack;
  }
}
