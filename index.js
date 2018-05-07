var BoardState = require('./board-state');
var OthelloClient = require('./othello-client')

var initState =
[
0, 0, 0, 0, 0, 0, 0, 0,
0, 0, 0, 0, 0, 0, 0, 0,
0, 0, 0, 0, 0, 0, 0, 0,
0, 0, 0, 2, 1, 0, 0, 0,
0, 0, 0, 1, 2, 0, 0, 0,
0, 0, 0, 0, 0, 0, 0, 0,
0, 0, 0, 0, 0, 0, 0, 0,
0, 0, 0, 0, 0, 0, 0, 0
];



// console.log(boardState.getValidMovements(1));

//boardState.getBoardForMovement(2, 5, 3)

// boardState.getValidMovements(2).forEach(function (movement) {
//   console.log(movement);
// });

// for (position in ) {
//   console.log(position);
// }








var prompt = require('prompt-sync')();
console.log(getRndInteger(0,63))

var tileRep = ['_', 'X', 'O'],
    N = 8;

function randInt(a, b) {
  return parseInt(Math.floor(Math.random() * (b - a) + b));
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function ix(row, col) {
  console.log(row);
  console.log(col);
  console.log('abcdefgh'.indexOf(col));
  return (row - 1) * N + 'abcdefgh'.indexOf(col);
}

function printBoardForHumans(board) {

  var result = '    A  B  C  D  E  F  G  H';

  for(var i = 0; i < board.length; i++){
    if(i % N === 0){
      result += '\n\n ' + (parseInt(Math.floor(i / N)) + 1) + ' ';
    }

    result += ' ' + tileRep[board[i]] + ' ';
  }

  return result;
}

function validateHumanPosition(position) {
  var validated = position.length === 2;

  if (validated){
    var row = parseInt(position[0]),
        col = position[1].toLowerCase();

    return (1 <= row && row <= N) && ('abcdefgh'.indexOf(col) >= 0);
  }

  return false;
}

console.log('Attempting connect');

var socketClient = require('socket.io-client')('http://localhost:3000'),
    userName = 'Koch'+ randInt(0, 63),
    tournamentID = 12;

socketClient.on('connect', function() {

  // Client has connected
  console.log("Conectado: " + userName);

  // Signing signal
  socketClient.emit('signin', {
    user_name: userName,
    tournament_id: tournamentID,  // 142857
    user_role: 'player'
  });
});

socketClient.on('ok_signin', function() {
  console.log('Ok signin signal received');
});

socketClient.on('ready', function(data) {

  // Client is about to move
  console.log("About to move. Board:\n");
  console.log(printBoardForHumans(data.board));
  console.log(data.board)
  console.log(data);
  console.log("\nRequesting move...");
  var othello_client = new OthelloClient();
  

  // data.player_turn_id: 1 (negro), 2 (blanco)

  var movement = othello_client.getMovement(data.board, data.player_turn_id)
  console.log ('Client Works!!')
  console.log('move: '+movement)

  // while (!validateHumanPosition(movement)){
  //   //movement = prompt("Insert your next move (1A - 8G):");
  // }

  socketClient.emit('play', {
    player_turn_id: data.player_turn_id,
    tournament_id: tournamentID,
    game_id: data.game_id,
    movement: movement
  });
});

socketClient.on('finish', function(data) {
  // The game has finished
  console.log("Game " + data.game_id + " has finished");

  // Inform my students that there is no rematch attribute
  console.log("Ready to play again!");

  // Start again!

  socketClient.emit('player_ready', {
    tournament_id: tournamentID,
    game_id: data.game_id,
    player_turn_id: data.player_turn_id
  });
});
