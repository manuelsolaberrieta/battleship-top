import Ship from "./Ship.js";
import Gameboard from "./Gameboard.js";
const ship1 = new Ship(4);
test("testing ship functions", () => {
  expect(ship1.hit()).toBe(1);
});
const Gameboard1 = new Gameboard();
let playerGrid = Gameboard1.makeGrid();
Gameboard1.placeShip(ship1, [0, 0], playerGrid);
test("testing gameboard", () => {
  //expect(playerGrid).toBe(1);
  expect(ship1.position).toBe(234);
});
