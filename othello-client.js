'use strict';

var BoardState = require('./board-state');
class OthelloClient {
    constructor()
    {
    }

    getMovement(boardState, playerTurnId)
    {
        var board = new BoardState(boardState);
        var validMoves = board.getValidMovements(playerTurnId)
        var oneMove = validMoves[0]
        var movement = board.getIntFromXY(oneMove[0], oneMove[1]);
        return movement
    }
}

module.exports = OthelloClient;
