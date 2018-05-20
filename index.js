
var OthelloClient = require('./othello-client');
var BoardState = require('./board-state');
// [
//   0, 0, 0, 0, 0, 0, 0, 0,
//   0, 0, 0, 0, 0, 0, 0, 0,
//   0, 0, 0, 0, 0, 0, 0, 0,
//   0, 0, 0, 2, 1, 0, 0, 0,
//   0, 0, 0, 1, 2, 0, 0, 0,
//   0, 0, 0, 0, 0, 0, 0, 0,
//   0, 0, 0, 0, 0, 0, 0, 0,
//   0, 0, 0, 0, 0, 0, 0, 0
// ]

var othello_client = new OthelloClient(2, 1);
var movement = othello_client.getMovement(
  [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 2, 0, 0, 0,
    0, 0, 1, 1, 2, 0, 0, 0,
    0, 0, 0, 1, 2, 1, 0, 0,
    0, 0, 0, 0, 2, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
  ]
);

// var board = new BoardState([
//   0, 0, 0, 0, 0, 0, 0, 0,
//   0, 0, 0, 0, 0, 0, 0, 0,
//   0, 0, 2, 0, 0, 0, 0, 0,
//   0, 0, 1, 2, 1, 0, 0, 0,
//   0, 0, 0, 1, 1, 0, 0, 0,
//   0, 0, 0, 0, 1, 0, 0, 0,
//   0, 0, 0, 0, 0, 0, 0, 0,
//   0, 0, 0, 0, 0, 0, 0, 0
// ]);

// console.log(board.getValidMovements(2));

console.log('Movement: ' + movement);
