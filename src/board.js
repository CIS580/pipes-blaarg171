"use strict";

module.exports = exports = Board;

function Board(width, height, tileSize) {
  this.width = width / tileSize;
  this.height = height / tileSize;
  this.tileSize = tileSize;
  this.spritesheet = new Image();
  this.spritesheet.src = encodeURI('assets/pipes.png');

  this.tiles = new Array(this.width);
  for (var i = 0; i < this.width; i++) {
    this.tiles[i] = new Array(this.height);
    for (var j = 0; j < this.height; j++) {
      this.tiles[i][j] = "empty";
    }
  }
}

Board.prototype.render = function (ctx) {
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      switch (this.tiles[x][y]) {

      }
    }
  }
}

Board.prototype.handleClick = function (position) {

}
