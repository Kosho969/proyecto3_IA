'use strict';

class TreeNode
{
    constructor(boardState) {
        this.boardState = boardState;
        this.children = [];
    }

    addChild(treeNode) {

    }

    getChildren() {
        return this.children;
    }

    getBoardState() {
        return this.boardState;
    }
}

module.exports = BoardState;
