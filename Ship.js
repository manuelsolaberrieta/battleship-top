export default class Ship {
  constructor(length) {
    this.length = length;
    this.timesHit = 0;
    this.sunk = false;
    this.position = [];
    this.index = undefined;
  }
  isSunk() {
    if (this.length === this.timesHit) {
      return true;
    } else {
      return false;
    }
  }
  hit() {
    this.timesHit += 1;
    this.sunk = this.isSunk();
  }
}
