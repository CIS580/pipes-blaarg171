"use strict";

module.exports = exports = Board;

const Pipe = require('./pipe');
const MS_PER_FRAME = 1000 / 8;

function Board(width, height, tileSize) {
  this.width = width / tileSize;
  this.height = height / tileSize;
  this.tileSize = tileSize;
  this.spritesheet = new Image();
  this.spritesheet.src = encodeURI('assets/pipes.png');
  this.spriteSize = 32;
  this.timer = 0;
  this.pipeSet = { index: 0, num: [8, 12] };
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

Board.prototype.update = function (time) {
  this.timer += time;
  if (this.timer >= MS_PER_FRAME) {
    this.timer = 0;
    if (this.tiles[this.current.x][this.current.y].update()) {
      var next = this.current;
      var connectDir;
      switch (this.current.direction) {
        case "up":
          next.y -= 1;
          connectDir = 2;
          break;

        case "left":
          next.x -= 1;
          connectDir = 3
          break;

        case "down":
          next.y += 1;
          connectDir = 0;
          break;

        case "right":
          next.x += 1;
          connectDir = 1;
          break;
      }
      next = this.tiles[next.x][next.y];
      if (next.connections[connectDir]) {
        this.current = { x: next.x, y: next.y, direction: this.current.direction };
        this.tiles[next.x][next.y].direction = this.current.direction;
      }
      else{
        //lose game
      }
    }
  }
}

Board.prototype.render = function (ctx) {
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      var srcx, srcy;

      if (this.tiles[x][y] == "empty") continue;

      if (this.tiles[x][y].fillLevel > 0) {
        ctx.fillRect((x * this.tileSize) + this.tileSize / 2, (y * this.tileSize) + this.tileSize / 2, 2, 2);
      }

      switch (this.tiles[x][y].type) {
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
      this.tiles[clickPos.x][clickPos.y] = new Pipe(this.nextPipe);
      this.nextPipe = newNextPipe(this.pipeSet.num[this.pipeSet.index]);
      break;

    case "right":
      if (this.tiles[clickPos.x][clickPos.y].fillLevel != 0) return;
      switch (this.tiles[clickPos.x][clickPos.y].type) {
        case "vertical":
          this.tiles[clickPos.x][clickPos.y] = new Pipe("horizontal");
          break;

        case "horizontal":
          this.tiles[clickPos.x][clickPos.y] = new Pipe("vertical");
          break;


        case "elbow_rd":
          this.tiles[clickPos.x][clickPos.y] = new Pipe("elbow_ld");
          break;


        case "elbow_ru":
          this.tiles[clickPos.x][clickPos.y] = new Pipe("elbow_rd");
          break;


        case "elbow_lu":
          this.tiles[clickPos.x][clickPos.y] = new Pipe("elbow_ru");
          break;


        case "elbow_ld":
          this.tiles[clickPos.x][clickPos.y] = new Pipe("elbow_lu");
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

function setStartFinish(instance) {
  var start = new Object();
  var finish = new Object();

  do {
    start.x = rollRandom(1, 7);
    start.y = rollRandom(1, 7);
    finish.x = rollRandom(1, 7);
    finish.y = rollRandom(1, 7);
  } while (start == finish);

  start.direction = randomDirection();
  finish.direction = randomDirection();

  instance.start = start;
  instance.finish = finish;

  instance.tiles[start.x][start.y] = new Pipe("start");
  instance.tiles[finish.x][finish.y] = new Pipe("finish");
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

