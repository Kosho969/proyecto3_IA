'use strict';

var EMPTY = 0;
var BLACK = 1;
var WHITE = 2;
var tileRep = ['_', 'X', 'O'];

function randInt(a, b) {
  return parseInt(Math.floor(Math.random() * (b - a) + b));
}

class BoardState
{
    constructor(initialState)
    {
        this.state = initialState;
        this.N = 8;
    }

    getValidMovements(playerColor)
    {
        var validMoves = [];
        for (var x = 0; x < this.N; x++) {
            for (var y = 0; y < this.N; y++) {
                if (
                    this
                        .getTilePositionsToFlip(playerColor, [x, y])
                        .length > 0
                ) {
                    validMoves.push([x, y]);
                }
            }
        }

        return validMoves;
    }

    printBoardForHumans()
    {
        var result = '    A  B  C  D  E  F  G  H';

        for (var i = 0; i < this.state.length; i++){
            if (i % this.N === 0){
                result += '\n\n ' + (parseInt(Math.floor(i / this.N)) + 1) + ' ';
            }

            result += ' ' + tileRep[this.state[i]] + ' ';
        }

        console.log(result);
    }

    getBoardForMovement(playerColor, playX, playY)
    {
        var newState = this.state.slice();

        var positionsToFlip = this.getTilePositionsToFlip(playerColor, [playX, playY]);

        var that = this;

        // Aplicar cambios al estado
        newState[that.getIntFromXY(playX, playY)] = playerColor;
        positionsToFlip.forEach(function(positionArray) {
            var positionInt = that.getIntFromXY(positionArray[0], positionArray[1]);
            newState[positionInt] = playerColor;
        });

        var newBoard = new BoardState(newState);

        return newBoard;
    }

    getTilePositionValue(x, y) {
        return this.state[y * this.N + x];
    }

    getCoordinatesFromInt(positionInt) {
        return [
            positionInt % this.N,
            parseInt(Math.floor(positionInt / this.N))
        ];
    }

    isOnBoard(x, y) {
        var position = this.getIntFromXY(x, y);

        return position >= 0 && position < Math.pow(this.N, 2);
    }

    getIntFromXY(x, y) {
        return y * this.N + x;
    }

    getOpponentTileColor(playerColor) {
        return playerColor === BLACK ? WHITE : BLACK;
    }

    isValidBoard() {
        return this.state.length === Math.pow(this.N, 2);
    }

    getTilePositionsToFlip(playerColor, play) {
        // Core validations
        var playX = play[0];
        var playY = play[1];

        // If it's not a balid board, or is not a valid play or is not
        // an empty poisition, return
        if (
            !this.isValidBoard()
                || !this.isOnBoard(playX, playY)
                || this.getTilePositionValue(playX, playY) !== EMPTY
        ) {
            return [];
        }

        // Get oponent tile color
        var oponentPlayerColor = this.getOpponentTileColor(playerColor);

        // Possible move directions
        var deltaDirections = {
            down: this.getIntFromXY(0, 1), // Down
            right_down: this.getIntFromXY(1, 1), // Right down
            right: this.getIntFromXY(1, 0), // Right
            right_up: this.getIntFromXY(1, -1), // Right up
            up: this.getIntFromXY(0, -1), // Up
            left_up: this.getIntFromXY(-1, -1), // Left up
            left: this.getIntFromXY(-1, 0), // Left
            left_down: this.getIntFromXY(-1, 1) // Left down
        };

        // Auxiliar movement directions
        var lefts = [
            deltaDirections.left,
            deltaDirections.left_down,
            deltaDirections.left_up
        ],
        rights = [
            deltaDirections.right,
            deltaDirections.right_down,
            deltaDirections.right_up
        ];

        // Calculate which tiles to flip
        var tilePositionsToFlip = [];

        var playInt = this.getIntFromXY(playX, playY);

        // For each movement direction
        var that = this;
        Object.keys(deltaDirections).forEach(function(movementKey) {
            // Movement delta
            var movementDelta = deltaDirections[movementKey];

            // Play test tracker
            var playTrackerInt = playInt;

            // Tiles positions captured on this movement
            var positionsToFlip = [];

            // Flag indicating if there are tiles to capture on this movement
            var shouldCaptureInThisDirection = false;

            // While play test tracker is on board
            var playTrackerArray = that.getCoordinatesFromInt(playTrackerInt);

            while (that.isOnBoard(playTrackerArray[0], playTrackerArray[1])) {
                // Avoid logic on first tile
                if (playTrackerInt !== playInt) {
                    // If in this new position is an opponent tile
                    if (
                        that.getTilePositionValue(
                            playTrackerArray[0], playTrackerArray[1]
                        ) === oponentPlayerColor
                    ) {
                        positionsToFlip.push(playTrackerInt);
                    } else {
                        // If the current play position tracker contains an empty tile, means that we didn't
                        // reach a tile of the same color, therefore shouldn't flip any coin in
                        // this direction. Else, if the current position holds a tile with the
                        // same color of the playing turn, we should mark our findings to turn
                        shouldCaptureInThisDirection =
                            that.getTilePositionValue(
                                playTrackerArray[0], playTrackerArray[1]
                            ) !== EMPTY;

                        break;
                    }
                }

                // Check if the next movement is going to wrap a row

                // Off board
                if (
                    (
                        playTrackerInt % that.N === 0
                            && lefts.indexOf(movementDelta) > -1
                    )
                        || (
                            (playTrackerInt % that.N === that.N - 1)
                                && rights.indexOf(movementDelta) > -1
                        )
                ) {
                    break;
                }

                // Move
                playTrackerInt += movementDelta;
                playTrackerArray = that.getCoordinatesFromInt(playTrackerInt);
            }

            // If we should capture
            if (shouldCaptureInThisDirection) {
                for (var i = 0; i < positionsToFlip.length; i++) {
                    tilePositionsToFlip.push(
                        that.getCoordinatesFromInt(positionsToFlip[i])
                    );
                }
            }
        });

        return tilePositionsToFlip;
    }

    /**
     * Devuelve el porcentaje de piezas de playerColor con respecto al total.
     *
     * Mientras más grande el porcentaje, mejor.
     */
    getPieceDifference(playerColor) {
        var blacksCount = this.state
            .filter(function(element) { return element === BLACK; })
            .length;

        var whitesCount = this.state
            .filter(function(element) { return element === WHITE; })
            .length;

        var currentPlayerCount = playerColor === BLACK ? blacksCount : whitesCount;
        var opponentPlayerCount = playerColor === BLACK ? whitesCount : blacksCount;

        var p = 0;

        if (currentPlayerCount > opponentPlayerCount) {
            p = (100.0 * currentPlayerCount)
                / (currentPlayerCount + opponentPlayerCount);
        } else if (currentPlayerCount < opponentPlayerCount) {
            p = - (100.0 * opponentPlayerCount)
                / (currentPlayerCount + opponentPlayerCount);
        } else {
            p = 0;
        }

        return p;
        // return 100.0 * currentPlayerCount / (blacksCount + whitesCount);
    }

    /**
     * Devuelve el porcentaje de posibles movimientos de playerColor con
     * respecto al total de posibles movimientos de ambos jugadores.
     *
     */
    getMobility(playerColor) {
        var opponentPlayerColor = this.getOpponentTileColor(playerColor);

        var currentPlayerMovements = this.getValidMovements(playerColor).length;
        var opponentPlayerMovements = this.getValidMovements(opponentPlayerColor).length;

        var m = 0;

        if (currentPlayerMovements > opponentPlayerMovements) {
            m = (100.0 * currentPlayerMovements)
                / (currentPlayerMovements + opponentPlayerMovements);
        } else if (currentPlayerMovements < opponentPlayerMovements)
            m = - (100.0 * opponentPlayerMovements)
                /(currentPlayerMovements + opponentPlayerMovements);
        else {
            m = 0;
        }

        return m;

        // if (
        //     this.getValidMovements(playerColor).length === 0
        //         && this.getValidMovements(opponentPlayerColor).length === 0
        // ) {
        //     return 100;
        // }

        // return 100
        //     * this.getValidMovements(playerColor).length
        //     / (
        //         this.getValidMovements(playerColor).length
        //             + this.getValidMovements(oponentPlayerColor).length
        //     );
    }

    /**
     * Devuelve el porcentaje de esquinas apropiadas por playerColor
     * con respecto al total de esquinas (4).
     *
     */
    getCornerOccupancy(playerColor) {
        var oponentPlayerColor = this.getOpponentTileColor(playerColor);
        var my_tiles = 0;
        var opp_tiles = 0;

        if (this.getTilePositionValue(0, 0) === playerColor) {
            my_tiles = my_tiles + 1;
        } else if (this.getTilePositionValue(0, 0) === oponentPlayerColor){
            opp_tiles = opp_tiles + 1;
        }

        if (this.getTilePositionValue(0, 7) === playerColor) {
            my_tiles = my_tiles + 1;
        } else if (this.getTilePositionValue(0, 7) === oponentPlayerColor){
            opp_tiles = opp_tiles + 1;
        }

        if (this.getTilePositionValue(7, 0) === playerColor) {
            my_tiles = my_tiles + 1;
        } else if (this.getTilePositionValue(7, 0) === oponentPlayerColor){
            opp_tiles = opp_tiles + 1;
        }

        if (this.getTilePositionValue(7, 7) === playerColor) {
            my_tiles = my_tiles + 1;
        } else if (this.getTilePositionValue(7, 7) === oponentPlayerColor){
            opp_tiles = opp_tiles + 1;
        }

        return 25 * (my_tiles - opp_tiles);
    }

    getCornerCloseness(playerColor) {
        var oponentPlayerColor = this.getOpponentTileColor(playerColor);
        var my_tiles = 0;
        var opp_tiles = 0;

        if (this.getTilePositionValue(0, 0) == 0) {
            if (this.getTilePositionValue(0, 1) == playerColor) {
                my_tiles = my_tiles + 1;
            } else if (this.getTilePositionValue(0, 1) == oponentPlayerColor){
                opp_tiles = opp_tiles + 1;
            }

            if (this.getTilePositionValue(1, 1) == playerColor) {
                my_tiles = my_tiles + 1;
            } else if (this.getTilePositionValue(1, 1) == oponentPlayerColor){
                opp_tiles = opp_tiles + 1;
            }

            if (this.getTilePositionValue(1, 0) == playerColor) {
                my_tiles = my_tiles + 1;
            } else if (this.getTilePositionValue(1, 0) == oponentPlayerColor){
                opp_tiles = opp_tiles + 1;
            }
        }

        if (this.getTilePositionValue(0, 7) == 0) {
            if (this.getTilePositionValue(0, 6) == playerColor) {
                my_tiles = my_tiles + 1;
            } else if (this.getTilePositionValue(0, 6) == oponentPlayerColor){
                opp_tiles = opp_tiles + 1;
            }

            if (this.getTilePositionValue(1, 6) == playerColor) {
                my_tiles = my_tiles + 1;
            } else if (this.getTilePositionValue(1, 6) == oponentPlayerColor){
                opp_tiles = opp_tiles + 1;
            }

            if (this.getTilePositionValue(1, 7) == playerColor) {
                my_tiles = my_tiles + 1;
            } else if (this.getTilePositionValue(1, 7) == oponentPlayerColor){
                opp_tiles = opp_tiles + 1;
            }
        }

        if (this.getTilePositionValue(7, 0) == 0) {
            if (this.getTilePositionValue(7, 1) == playerColor) {
                my_tiles = my_tiles + 1;
            } else if (this.getTilePositionValue(7, 1) == oponentPlayerColor){
                opp_tiles = opp_tiles + 1;
            }

            if (this.getTilePositionValue(6, 1) == playerColor) {
                my_tiles = my_tiles +1;
            } else if (this.getTilePositionValue(6, 1) == oponentPlayerColor){
                opp_tiles = opp_tiles +1;
            }

            if (this.getTilePositionValue(6, 0) == playerColor) {
                my_tiles = my_tiles +1;
            } else if (this.getTilePositionValue(6, 0) == oponentPlayerColor){
                opp_tiles = opp_tiles +1;
            }
        }

        if (this.getTilePositionValue(7, 7) == 0) {
            if (this.getTilePositionValue(6, 7) == playerColor) {
                my_tiles = my_tiles + 1;
            } else if (this.getTilePositionValue(6, 7) == oponentPlayerColor){
                opp_tiles = opp_tiles + 1;
            }

            if (this.getTilePositionValue(6, 6) == playerColor) {
                my_tiles = my_tiles + 1;
            } else if (this.getTilePositionValue(6, 6) == oponentPlayerColor){
                opp_tiles = opp_tiles + 1;
            }

            if (this.getTilePositionValue(7, 6) == playerColor) {
                my_tiles = my_tiles + 1;
            } else if (this.getTilePositionValue(7, 6) == oponentPlayerColor){
                opp_tiles = opp_tiles + 1;
            }
        }

        return -12.5 * (my_tiles - opp_tiles);
    }

    getFrontierDiscsCount(playerColor)
    {
        var X1 = [0, 1, 1, 1, 0, -1, -1, -1];
        var Y1 = [-1, -1, 0, 1, 1, 1, 0, -1];

        var currentFrontTileCount = 0;
        var opponentFrontTileCount = 0;

        for (var i=0; i<8; i++) {
            for (var j=0; j<8; j++) {
                if (this.getTilePositionValue(i, j) != 0) {
                    for (var k=0; k<8; k++) {
                        var x = i + X1[k];
                        var y = j + Y1[k];

                        if (x >= 0 && x < 8 && y >= 0 && y < 8 && this.getTilePositionValue(x, y) == 0) {
                            if (this.getTilePositionValue(i, j) == playerColor)
                                currentFrontTileCount++;
                            else
                                opponentFrontTileCount++;
                            break;
                        }
                    }
                }
            }
        }

        if (currentFrontTileCount > opponentFrontTileCount) {
            return - (100.0 * currentFrontTileCount)
                /(currentFrontTileCount + opponentFrontTileCount);
        } else if (currentFrontTileCount < opponentFrontTileCount) {
            return (100.0 * opponentFrontTileCount)
                /(currentFrontTileCount + opponentFrontTileCount);
        } else {
            return 0;
        }
    }

    /**
     *
     *
     */
    h(playerColor) {
        // double score =
            // (10 * p)
            // + (801.724 * c)
            // + (382.026 * l)
            // + (78.922 * m)
            // + (74.396 * f)
            // + (10 * d);

        // De acuerdo con los datos experimentales, corner closeness
        // conviene cuando yo soy el negro
        // TODO: Validar e implementar

        var score = 0;
        if (playerColor === BLACK){
            score = score + (3.0 * this.getCornerCloseness(playerColor))
                + (0.1 * this.getPieceDifference(playerColor))
            + (8.0 * this.getCornerOccupancy(playerColor))
            + (0.7 * this.getMobility(playerColor))
        }
        else{
        score = score + (0.1 * this.getPieceDifference(playerColor))
            + (8.0 * this.getCornerOccupancy(playerColor))
            + (0.7 * this.getMobility(playerColor))
            + (0.7 * this.getFrontierDiscsCount(playerColor))
            ;
        }
        return score;
    }
}

module.exports = BoardState;
