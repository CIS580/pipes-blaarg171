"use strict";

module.exports = exports = Board;

const Pipe = require('./pipe');

function Board(width, height, tileSize, pipeMax) {
  this.width = width / tileSize;
  this.height = height / tileSize;
  this.tileSize = tileSize;
  this.pipeMax = pipeMax;
  this.spritesheet = new Image();
  this.spritesheet.src = encodeURI('assets/pipes.png');
  this.spriteSize = 32;
  this.pipeSet = { index: 0, num: [7, 11] };
  this.nextPipe = newNextPipe(this.pipeSet.num[this.pipeSet.index]);

  this.tiles = new Array(this.width);
  for (var i = 0; i < this.width; i++) {
    this.tiles[i] = new Array(this.height);
    for (var j = 0; j < this.height; j++) {
      this.tiles[i][j] = "empty";
    }
  }

  setStartFinish(this);
  console.log(this.start.direction + " " + this.finish.direction);

  this.current = { x: this.start.x, y: this.start.y, direction: this.start.direction };
}

Board.prototype.update = function () {
  var currPipe = this.tiles[this.current.x][this.current.y];
  if (currPipe.update()) {
    if (currPipe.type == "finish")
      return "win"
    var nextTile = this.current;
    var nextPipe;
    var connectDir;
    switch (currPipe.direction) {
      case "up":
        nextTile.y -= 1;
        connectDir = 2;
        break;

      case "left":
        nextTile.x -= 1;
        connectDir = 3
        break;

      case "down":
        nextTile.y += 1;
        connectDir = 0;
        break;

      case "right":
        nextTile.x += 1;
        connectDir = 1;
        break;
    }
    if (nextTile.x < 0 || nextTile.x > 7 || nextTile.y < 0 || nextTile.y > 7) return "lose";
    nextPipe = this.tiles[nextTile.x][nextTile.y];
    if ((nextPipe != undefined || nextPipe == "empty") && nextPipe.connections[connectDir]) {
      this.current = { x: nextTile.x, y: nextTile.y, direction: currPipe.direction };
      this.tiles[nextTile.x][nextTile.y].direction = this.current.direction;
      return "score";
    }
    else {
      // Lose game
      return "lose";
    }
  };
}

Board.prototype.render = function (ctx) {
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      var next = getSprite(this.nextPipe, this.spriteSize);
      ctx.drawImage(this.spritesheet,
        next.x, next.y, this.spriteSize, this.spriteSize,
        546, 380, this.tileSize, this.tileSize
      );

      if (this.tiles[x][y] == "empty") continue;

      if (this.tiles[x][y].fillLevel > 0) {
        var scale = this.tileSize / this.spriteSize;
        this.tiles[x][y].stupidWaterRenderingCrapThatImTiredOfDealingWith(ctx,
          x * this.tileSize, y * this.tileSize, scale);
      }

      var src = getSprite(this.tiles[x][y].type, this.spriteSize);
      ctx.drawImage(this.spritesheet,
        src.x, src.y, this.spriteSize, this.spriteSize,
        x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize
      );
    }
  }
}

Board.prototype.handleClick = function (position, click) {
  if (position.x > 512) return;
  var clickPos = new Object();
  clickPos.x = Math.floor(position.x / this.tileSize);
  clickPos.y = Math.floor(position.y / this.tileSize);

  switch (click) {
    case "left":
      if (this.tiles[clickPos.x][clickPos.y] != "empty") return;
      this.tiles[clickPos.x][clickPos.y] = new Pipe(this.nextPipe, "", this.pipeMax);
      this.nextPipe = newNextPipe(this.pipeSet.num[this.pipeSet.index]);
      break;

    case "right":
      var thisClickPipe = this.tiles[clickPos.x][clickPos.y];
      if (thisClickPipe.fillLevel != 0) return;
      switch (thisClickPipe.type) {
        case "vertical":
          this.tiles[clickPos.x][clickPos.y] = new Pipe("horizontal", "", thisClickPipe.maximum);
          break;

        case "horizontal":
          this.tiles[clickPos.x][clickPos.y] = new Pipe("vertical", "", thisClickPipe.maximum);
          break;


        case "elbow_rd":
          this.tiles[clickPos.x][clickPos.y] = new Pipe("elbow_ld", "", thisClickPipe.maximum);
          break;


        case "elbow_ru":
          this.tiles[clickPos.x][clickPos.y] = new Pipe("elbow_rd", "", thisClickPipe.maximum);
          break;


        case "elbow_lu":
          this.tiles[clickPos.x][clickPos.y] = new Pipe("elbow_ru", "", thisClickPipe.maximum);
          break;


        case "elbow_ld":
          this.tiles[clickPos.x][clickPos.y] = new Pipe("elbow_lu", "", thisClickPipe.maximum);
          break;


        case "t_d":
          this.tiles[clickPos.x][clickPos.y] = new Pipe("t_l");
          break;


        case "t_r":
          this.tiles[clickPos.x][clickPos.y] = new Pipe("t_d");
          break;


        case "t_u":
          this.tiles[clickPos.x][clickPos.y] = new Pipe("t_r");
          break;


        case "t_l":
          this.tiles[clickPos.x][clickPos.y] = new Pipe("t_u");
          break;

        default:
          return;
      }
      break;
  }
}

function newNextPipe(max) {
  var roll = rollRandom(0, max);
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

function getSprite(type, spriteSize) {
  var src = new Object();
  switch (type) {
    case "start":
      src.x = 3 * spriteSize;
      src.y = 3 * spriteSize;
      break;

    case "finish":
      src.x = 3 * spriteSize;
      src.y = 4 * spriteSize;
      break;

    case "cross":
      src.x = 0 * spriteSize;
      src.y = 0 * spriteSize;
      break;

    case "vertical":
      src.x = 3 * spriteSize;
      src.y = 2 * spriteSize;
      break;

    case "horizontal":
      src.x = 3 * spriteSize;
      src.y = 1 * spriteSize;
      break;

    case "elbow_rd":
      src.x = 1 * spriteSize;
      src.y = 1 * spriteSize;
      break;

    case "elbow_ru":
      src.x = 1 * spriteSize;
      src.y = 2 * spriteSize;
      break;

    case "elbow_lu":
      src.x = 2 * spriteSize;
      src.y = 2 * spriteSize;
      break;

    case "elbow_ld":
      src.x = 2 * spriteSize;
      src.y = 1 * spriteSize;
      break;

    case "t_d":
      src.x = 1 * spriteSize;
      src.y = 3 * spriteSize;
      break;

    case "t_r":
      src.x = 1 * spriteSize;
      src.y = 4 * spriteSize;
      break;

    case "t_u":
      src.x = 2 * spriteSize;
      src.y = 4 * spriteSize;
      break;

    case "t_l":
      src.x = 2 * spriteSize;
      src.y = 3 * spriteSize;
      break;
  }
  return src;
}

function setStartFinish(instance) {
  var start = new Object();
  var finish = new Object();

  do {
    start.x = rollRandom(1, 7);
    start.y = rollRandom(1, 7);
    finish.x = rollRandom(1, 7);
    finish.y = rollRandom(1, 7);
  } while (start.x == finish.x && start.y == finish.y);

  // start.direction = randomDirection();
  // finish.direction = randomDirection();
  start.direction = "down";
  finish.direction = "down";

  instance.start = start;
  instance.finish = finish;

  instance.tiles[start.x][start.y] = new Pipe("start", start.direction, instance.pipeMax);
  instance.tiles[finish.x][finish.y] = new Pipe("finish", finish.direction, instance.pipeMax);
}

function randomDirection() {
  switch (rollRandom(0, 4)) {
    case 0:
      return "up";

    case 1:
      return "left";

    case 2:
      return "down";

    case 3:
      return "right";
  }
}

function rollRandom(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum) + minimum);
}

