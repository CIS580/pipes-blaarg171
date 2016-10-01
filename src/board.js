"use strict";

module.exports = exports = Board;

function Board(width, height, tileSize) {
  this.width = width / tileSize;
  this.height = height / tileSize;
  this.tileSize = tileSize;
  this.spritesheet = new Image();
  this.spritesheet.src = encodeURI('assets/pipes.png');
  this.spriteSize = 32;
  this.nextPipe = newNextPipe();

  this.tiles = new Array(this.width);
  for (var i = 0; i < this.width; i++) {
    this.tiles[i] = new Array(this.height);
    for (var j = 0; j < this.height; j++) {
      this.tiles[i][j] = "empty";
    }
  }

  // TODO > fix duplicate rolls
  this.tiles[rollRandom(1, 7)][rollRandom(1, 7)] = "start";
  this.tiles[rollRandom(1, 7)][rollRandom(1, 7)] = "finish";
}

Board.prototype.render = function (ctx) {
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      var srcx, srcy;

      switch (this.tiles[x][y]) {
        case "empty":
          continue;

        case "start":
          srcx = 3 * this.spriteSize;
          srcy = 3 * this.spriteSize;
          break;

        case "finish":
          srcx = 3 * this.spriteSize;
          srcy = 4 * this.spriteSize;
          break;

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

Board.prototype.handleClick = function (position, click) {
  var clickPos = new Object();
  clickPos.x = Math.floor(position.x / this.tileSize);
  clickPos.y = Math.floor(position.y / this.tileSize);

  switch (click) {
    case "left":
      if (this.tiles[clickPos.x][clickPos.y] != "empty") return;
      this.tiles[clickPos.x][clickPos.y] = this.nextPipe;
      this.nextPipe = newNextPipe();
      break;

    case "right":
      switch (this.tiles[clickPos.x][clickPos.y]) {
        case "vertical":
          this.tiles[clickPos.x][clickPos.y] = "horizontal";
          break;

        case "horizontal":
          this.tiles[clickPos.x][clickPos.y] = "vertical";
          break;


        case "elbow_rd":
          this.tiles[clickPos.x][clickPos.y] = "elbow_ld";
          break;


        case "elbow_ru":
          this.tiles[clickPos.x][clickPos.y] = "elbow_rd";
          break;


        case "elbow_lu":
          this.tiles[clickPos.x][clickPos.y] = "elbow_ru";
          break;


        case "elbow_ld":
          this.tiles[clickPos.x][clickPos.y] = "elbow_lu";
          break;


        case "t_d":
          this.tiles[clickPos.x][clickPos.y] = "t_l";
          break;


        case "t_r":
          this.tiles[clickPos.x][clickPos.y] = "t_d";
          break;


        case "t_u":
          this.tiles[clickPos.x][clickPos.y] = "t_r";
          break;


        case "t_l":
          this.tiles[clickPos.x][clickPos.y] = "t_u";
          break;


      }
      break;
  }
}

function newNextPipe() {
  var roll = rollRandom(0, 12);
  switch (roll) {
    case 0:
      return "cross";

    case 1:
      return "vertical";

    case 2:
      return "horizontal";

    case 3:
      return "elbow_rd";

    case 4:
      return "elbow_ru";

    case 5:
      return "elbow_lu";

    case 6:
      return "elbow_ld";

    case 7:
      return "t_d";

    case 8:
      return "t_r";

    case 9:
      return "t_u";

    case 10:
      return "t_l";
  }
}

function rollRandom(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum) + minimum);
}

