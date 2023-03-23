import Ship from "./Ship.js";
export default class Player {
  constructor(name = "Player1") {
    this.name = name;
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
