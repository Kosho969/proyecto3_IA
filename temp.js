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
  console.log(printBoardForHumans(data.board));

  var othello_client = new OthelloClient(3);

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