"use strict";

module.exports = exports = Board;

function Board(width, height, tileSize) {
  this.width = width / tileSize;
  this.height = height / tileSize;
  this.tileSize = tileSize;
  this.spritesheet = new Image();
  this.spritesheet.src = encodeURI('assets/pipes.png');
  this.spriteSize = 32;
  this.nextPipe = "";

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
      var srcx, srcy;

      switch (this.tiles[x][y]) {
        case "empty":
          continue;

        case "cross":
          srcx = 0 * this.spriteSize;
          srcy = 0 * this.spriteSize;
          break;

        case "vertical":
          srcx = 3 * this.spriteSize;
          srcy = 2 * this.spriteSize;
          break;

        case "horizontal":
          srcx = 3 * this.spriteSize;
          srcy = 1 * this.spriteSize;
          break;


        case "elbow_rd":
          srcx = 1 * this.spriteSize;
          srcy = 1 * this.spriteSize;
          break;


        case "elbow_ru":
          srcx = 1 * this.spriteSize;
          srcy = 2 * this.spriteSize;
          break;


        case "elbow_lu":
          srcx = 2 * this.spriteSize;
          srcy = 2 * this.spriteSize;
          break;


        case "elbow_ld":
          srcx = 2 * this.spriteSize;
          srcy = 1 * this.spriteSize;
          break;


        case "t_d":
          srcx = 1 * this.spriteSize;
          srcy = 3 * this.spriteSize;
          break;


        case "t_r":
          srcx = 1 * this.spriteSize;
          srcy = 4 * this.spriteSize;
          break;


        case "t_u":
          srcx = 2 * this.spriteSize;
          srcy = 4 * this.spriteSize;
          break;


        case "t_l":
          srcx = 2 * this.spriteSize;
          srcy = 3 * this.spriteSize;
          break;

      }
      ctx.drawImage(this.spritesheet,
        srcx, srcy, this.spriteSize, this.spriteSize,
        x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize
      );
    }
  }
}

Board.prototype.handleClick = function (position) {
  var clickPos = new Object();
  clickPos.x = Math.floor(position.x / this.tileSize);
  clickPos.y = Math.floor(position.y / this.tileSize);

  if (this.tiles[clickPos.x][clickPos.y] != "empty") return;
  this.tiles[clickPos.x][clickPos.y] = this.nextPipe;
  newNextPipe();
}

function newNextPipe() {
  var roll = rollRandom(0, 12);
  switch (roll) {
    case 0:
      this.nextPipe = "cross";
      break;

    case 1:
      this.nextPipe = "vertical";
      break;

    case 2:
      this.nextPipe = "horizontal";
      break;

    case 3:
      this.nextPipe = "elbow_rd";
      break;

    case 4:
      this.nextPipe = "elbow_ru";
      break;

    case 5:
      this.nextPipe = "elbow_lu";
      break;

    case 6:
      this.nextPipe = "elbow_ld";
      break;

    case 7:
      this.nextPipe = "t_d";
      break;

    case 8:
      this.nextPipe = "t_r";
      break;

    case 9:
      this.nextPipe = "t_u";
      break;

    case 10:
      this.nextPipe = "t_l";
      break;
  }
}

function rollRandom(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum) + minimum);
}

