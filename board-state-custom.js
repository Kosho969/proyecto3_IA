'use strict';

class BoardStateCustom
{
    h(playerColor) {
        // double score =
            // (10 * p)
            // + (801.724 * c)
            // + (382.026 * l)
            // + (78.922 * m)
            // + (74.396 * f)
            // + (10 * d);

        return (0.1 * this.getPieceDifference(playerColor))
            + (8.01724 * this.getCornerOccupancy(playerColor))
            + (3.82026 * this.getCornerCloseness(playerColor))
            + (0.78922 * this.getMobility(playerColor));
    }
}