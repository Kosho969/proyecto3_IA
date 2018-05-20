var OthelloClient = require('./othello-client');
var BoardState = require('./board-state');

var coordinatorURL = 'http://192.168.0.101:4000';
var tournamentID = 142857;

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

console.log('Attempting to connect');

var socketClient = require('socket.io-client')(coordinatorURL),
    userName = 'Koch'+ randInt(0, 63);

socketClient.on('connect', function() {

  // Client has connected
  console.log('Conectado: ' + userName);

  // Signing signal
  socketClient.emit('signin', {
    user_name: userName,
    tournament_id: tournamentID,  // 142857
    user_role: 'player'
  });
});

socketClient.on('finish', function(data) {
  // The game has finished
  console.log('Game ' + data.game_id + ' has finished');

  // Inform my students that there is no rematch attribute
  console.log('Ready to play again!');

  // Start again!
  socketClient.emit('player_ready', {
    tournament_id: tournamentID,
    game_id: data.game_id,
    player_turn_id: data.player_turn_id
  });
});

function play(data) {
  // Client is about to move

  // Player color: data.player_turn_id: 1 (negro), 2 (blanco)
  console.log('Current player color: ' + data.player_turn_id);
  console.log('Current board: \n');
  console.log(humanBoard(data.board));

  var othello_client = new OthelloClient(3, data.player_turn_id);

  var movement = othello_client.getMovement(data.board, data.player_turn_id);

  console.log('Sending move: ' + movement)

  socketClient.emit('play', {
    player_turn_id: data.player_turn_id,
    tournament_id: tournamentID,
    game_id: data.game_id,
    movement: movement
  });
}

socketClient.on('ready', play);

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

// var othello_client = new OthelloClient(3, 1);
// var movement = othello_client.getMovement(
//   [
//     0, 0, 0, 0, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0, 0, 0,
//     0, 0, 0, 2, 1, 0, 0, 0,
//     0, 0, 0, 1, 2, 0, 0, 0,
//     0, 0, 0, 0, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0, 0, 0
//   ]
// );

// // var board = new BoardState([
// //   0, 0, 0, 0, 0, 0, 0, 0,
// //   0, 0, 0, 0, 0, 0, 0, 0,
// //   0, 0, 2, 0, 0, 0, 0, 0,
// //   0, 0, 1, 2, 1, 0, 0, 0,
// //   0, 0, 0, 1, 1, 0, 0, 0,
// //   0, 0, 0, 0, 1, 0, 0, 0,
// //   0, 0, 0, 0, 0, 0, 0, 0,
// //   0, 0, 0, 0, 0, 0, 0, 0
// // ]);

// // console.log(board.getValidMovements(2));

// console.log('Movement: ' + movement);
