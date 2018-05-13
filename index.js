var OthelloClient = require('./othello-client');
var BoardState = require('./board-state');

var coordinatorURL = 'http://192.168.43.108:3000';
var tournamentID = 12;

function randInt(a, b) {
  return parseInt(Math.floor(Math.random() * (b - a) + b));
}

var tileRep = ['_', 'X', 'O'],
  N = 8;

function humanBoard(board) {

  var result = '    A  B  C  D  E  F  G  H';

  for(var i = 0; i < board.length; i++){
    if(i % N === 0){
      result += '\n\n ' + (parseInt(Math.floor(i / N)) + 1) + ' ';
    }

    result += ' ' + tileRep[board[i]] + ' ';
  }

  return result;
}

var othello_client = new OthelloClient(3, 1);
var movement = othello_client.getMovement(
  [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 2, 1, 0, 0, 0,
    0, 0, 0, 1, 2, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
  ]
);

console.log('Movement: ' + movement);
