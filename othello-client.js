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

        console.time('concatenation');

        var movement = this.getMaxValueMovement(
            board,
            0,
            Number.NEGATIVE_INFINITY,
            Number.POSITIVE_INFINITY,
            null
        );

        console.timeEnd("concatenation");
        console.log('');

        console.log(
            'Returning movement: '
                + movement[1]
                + ' with value '
                + movement[0]
        );

        var move =  board.getIntFromXY(movement[1][0], movement[1][1]);

        return move;
    }

    getMaxValueMovement(board, currentDepth, alpha, beta, movement)
    {
        if (currentDepth === this.k) {
            return [board.h(this.getCurrentPlayerColor()), movement];
        }

        var value = Number.NEGATIVE_INFINITY;
        var arista = null;
        var validMovements = board.getValidMovements(this.getCurrentPlayerColor());

        if (validMovements.length === 0) {
            var validMovementsOpponent = board.getValidMovements(this.getOpponentPlayerColor());
            // End game solver
            // TODO: Si el otro jugador tampoco tiene movidas disponibles,
            // devolver piece difference en lugar de heurística
            if(validMovementsOpponent.length === 0 ){
                return [board.getPieceDifference(this.getCurrentPlayerColor()), movement];
            }


            return [board.h(this.getCurrentPlayerColor()), movement];
        }

        for (var i = 0; i < validMovements.length; i++) {
            var possibleMovement = validMovements[i];

            var movementResultBoard = board.getBoardForMovement(
                this.currentPlayerColor,
                possibleMovement[0],
                possibleMovement[1]
            );

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
                // console.log(" ".repeat(currentDepth * 2) + 'Returning because value ' + tuple[0] + ' >= beta');
                return [value, movement];
            }

            if (tuple[0] > alpha) {
                alpha = tuple[0];
            }
        }

        // console.log(" ".repeat(currentDepth * 2) + 'Returning because end for');
        return [value, movement];
    }

    getMinValueMovement(board, currentDepth, alpha, beta, movement)
    {
        if (currentDepth === this.k) {
            return [board.h(this.getCurrentPlayerColor()), movement];
        }

        var value = Number.POSITIVE_INFINITY;
        var validMovements = board.getValidMovements(this.getOpponentPlayerColor());

        if (validMovements.length === 0) {
            var validMovementsOpponent = board.getValidMovements(this.getCurrentPlayerColor());
            // End game solver
            // TODO: Si el otro jugador tampoco tiene movidas disponibles,
            // devolver piece difference en lugar de heurística
            if(validMovementsOpponent.length === 0 ){
                return [board.getPieceDifference(this.getCurrentPlayerColor()), movement];
            }


            return [board.h(this.getCurrentPlayerColor()), movement];
        }

        for (var i = 0; i < validMovements.length; i++) {
            var possibleMovement = validMovements[i];

            // console.log(" ".repeat(currentDepth * 2) + '------------------------');
            // console.log(" ".repeat(currentDepth * 2) + 'Possible movement for ' + this.getOpponentPlayerColorLabel() + ': ' + possibleMovement);

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
                // console.log(" ".repeat(currentDepth * 2) + 'Returning because value ' + tuple[0] + ' <= alpha');
                return [value, movement];
            }

            if (tuple[0] < beta) {
                beta = tuple[0];
            }
        }

        // console.log(" ".repeat(currentDepth * 2) + 'Returning because end for');
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
