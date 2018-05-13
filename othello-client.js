'use strict';

var BoardState = require('./board-state');

class OthelloClient
{
    constructor(k, currentPlayerColor)
    {
        this.k = k;
        this.currentPlayerColor = currentPlayerColor;
    }

    getMovement(boardState)
    {
        var board = new BoardState(boardState);

        // var validMoves = board.getValidMovements(playerTurnId)

        // var oneMove = validMoves[0]

        // var movement = board.getIntFromXY(oneMove[0], oneMove[1]);

        // return movement

        return this.getMaxValueMovement(
            board,
            0,
            Number.NEGATIVE_INFINITY,
            Number.POSITIVE_INFINITY
        )[1];
    }

    getMaxValueMovement(board, currentDepth, alpha, beta)
    {
        var value = Number.NEGATIVE_INFINITY;
        var movement = null;

        var that = this;
        board
            .getValidMovements(this.currentPlayerColor)
            .forEach(function(possibleMovement) {
                console.log('Possible movement for ' + this.currentPlayerColor + ': ' + possibleMovement);

                var movementResultBoard = board.getBoardForMovement(
                    that.currentPlayerColor,
                    possibleMovement[0],
                    possibleMovement[1]
                );

                var tuple = that.getMinValueMovement(
                    movementResultBoard,
                    currentDepth + 1,
                    alpha,
                    beta
                );
            });

        // for possibleMovement in boardState.getValdMovemts():
        //     tuple = getMinValueMovement(
        //         boardState.getBoardForMovement(possibleMovement),
        //         depth + 1,
        //         alpha,
        //         beta
        //     );

        //     if (tuple[0] > value) {
        //         value = tuple[0]
        //         movement = tuple[1]
        //     }

        //     value = max(
        //         value,
                
        //     )

        //     if value >= beta: return (value, possibleMovement)

        //     alpha = max(alpha, value)

        // return [value, movement];
        return [10, 10];
    }

    getMinValueMovement(board, currentDepth, alpha, beta)
    {
        var value = Number.POSITIVE_INFINITY;
        var movement = null;

        var that = this;
        board
            .getValidMovements(this.getOpponentPlyerColor())
            .forEach(function(possibleMovement) {
                console.log('------------------------');
                console.log('Possible movement for ' + this.getOpponentPlyerColor() + ': ' + possibleMovement);

                var movementResultBoard = board.getBoardForMovement(
                    that.currentPlayerColor,
                    possibleMovement[0],
                    possibleMovement[1]
                );

                var tuple = that.getMaxValueMovement(
                    movementResultBoard,
                    currentDepth + 1,
                    alpha,
                    beta
                );
            });
    }

    getOpponentPlyerColor()
    {
        return this.currentPlayerColor === BLACK ? WHITE : BLACK;
    }
}

module.exports = OthelloClient;
