'use strict';

var BoardState = require('./board-state');

var BLACK = 1;
var WHITE = 2;

class OthelloClient
{
    constructor(k, currentPlayerColor)
    {
        this.k = k;
        this.currentPlayerColor = currentPlayerColor;
    }

    getMovement(boardState, playerTurnId)
    {
        var board = new BoardState(boardState);

        board.printBoardForHumans();

        // var validMoves = board.getValidMovements(playerTurnId)

        // var oneMove = validMoves[0]

        // var movement = board.getIntFromXY(oneMove[0], oneMove[1]);

        // return movement

        // return ;
        var movement = this.getMaxValueMovement(
            board,
            0,
            Number.NEGATIVE_INFINITY,
            Number.POSITIVE_INFINITY,
            null
        );

        console.log('');
        console.log('Returning movement: ' + movement[1] + ' with value ' + movement[0]);

        return movement[1];
    }

    getMaxValueMovement(board, currentDepth, alpha, beta, movement)
    {
        console.log(" ".repeat(currentDepth * 2) + '--- Into MAX value for currentDepth ' + currentDepth + ' and movement ' + movement);

        if (currentDepth === this.k) {
            console.log(" ".repeat(currentDepth * 2) + 'returning h value (max)' + board.h(this.getCurrentPlayerColor()) + ' for movement: ' + movement);

            return [board.h(this.getCurrentPlayerColor()), movement];
        }

        var value = Number.NEGATIVE_INFINITY;
        var arista = null;
        var validMovements = board.getValidMovements(this.currentPlayerColor);

        if (validMovements.length === 0) {
            console.log(" ".repeat(currentDepth * 2) + 'No movements found');
            //board.printBoardForHumans();
            console.log(board.state);
        }

        for (var i = 0; i < validMovements.length; i++) {
            var possibleMovement = validMovements[i];

            console.log(" ".repeat(currentDepth * 2) + '------------------------');
            console.log(" ".repeat(currentDepth * 2) + 'Possible movement for ' + this.getCurrentPlayerColorLabel() + ': ' + possibleMovement);

            var movementResultBoard = board.getBoardForMovement(
                this.currentPlayerColor,
                possibleMovement[0],
                possibleMovement[1]
            );

            //movementResultBoard.printBoardForHumans();

            var tuple = this.getMinValueMovement(
                movementResultBoard,
                currentDepth + 1,
                alpha,
                beta,
                possibleMovement
            );

            // Si el valor de la tupla min es mayor que value,
            // actualizar value y el movimiento
            if (tuple[0] > value) {
                value = tuple[0];
                movement = possibleMovement;
            }

            if (tuple[0] >= beta) {
                console.log(" ".repeat(currentDepth * 2) + 'Returning because value ' + tuple[0] + ' >= beta');
                return [value, movement];
            }

            if (tuple[0] > alpha) {
                alpha = tuple[0];
            }
        }

        console.log(" ".repeat(currentDepth * 2) + 'Returning because end for');
        return [value, movement];
    }

    getMinValueMovement(board, currentDepth, alpha, beta, movement)
    {
        console.log(" ".repeat(currentDepth * 2) + '--- Into MIN value for currentDepth ' + currentDepth + ' and movement ' + movement);

        if (currentDepth === this.k) {
            console.log(" ".repeat(currentDepth * 2) + 'returning h value (min)' + board.h(this.getCurrentPlayerColor()) + ' for movement: ' + movement);

            return [board.h(this.getCurrentPlayerColor()), movement];
        }

        var value = Number.POSITIVE_INFINITY;
        var movement = movement;
        var validMovements = board.getValidMovements(this.getOpponentPlayerColor());

        if (validMovements.length === 0) {
            console.log(" ".repeat(currentDepth * 2) + 'No movements found');
            //board.printBoardForHumans();
            console.log(board.state);
        }

        for (var i = 0; i < validMovements.length; i++) {
            var possibleMovement = validMovements[i];

            console.log(" ".repeat(currentDepth * 2) + '------------------------');
            console.log(" ".repeat(currentDepth * 2) + 'Possible movement for ' + this.getOpponentPlayerColorLabel() + ': ' + possibleMovement);

            var movementResultBoard = board.getBoardForMovement(
                this.getOpponentPlayerColor(),
                possibleMovement[0],
                possibleMovement[1]
            );

            //movementResultBoard.printBoardForHumans();

            var tuple = this.getMaxValueMovement(
                movementResultBoard,
                currentDepth + 1,
                alpha,
                beta,
                possibleMovement
            );

            // Si el valor de la tupla min es mayor que value,
            // actualizar value y el movimiento
            if (tuple[0] < value) {
                value = tuple[0];
                movement = possibleMovement;
            }

            if (tuple[0] <= alpha) {
                console.log(" ".repeat(currentDepth * 2) + 'Returning because value ' + tuple[0] + ' <= alpha');
                return [value, movement];
            }

            if (tuple[0] < beta) {
                beta = tuple[0];
            }
        }

        console.log(" ".repeat(currentDepth * 2) + 'Returning because end for');
        return [value, movement];
    }

    getOpponentPlayerColor()
    {
        return this.currentPlayerColor === BLACK ? WHITE : BLACK;
    }

    getCurrentPlayerColorLabel()
    {
        return this.currentPlayerColor === BLACK ? 'BLACK' : 'WHITE';
    }

    getOpponentPlayerColorLabel()
    {
        return this.currentPlayerColor === BLACK ? 'WHITE' : 'BLACK';
    }

    getCurrentPlayerColor()
    {
        return this.currentPlayerColor;
    }
}

module.exports = OthelloClient;
