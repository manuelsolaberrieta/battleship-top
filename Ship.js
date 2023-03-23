export default class Ship {
  constructor(length) {
    this.length = length;
    this.timesHit = 0;
    this.sunk = this.isSunk();
    this.position = [];
  }
  hit() {
    this.timesHit += 1;
  }
  isSunk() {
    if (this.length === this.timesHit) {
      return true;
    } else {
      return false;
    }
  }
}
