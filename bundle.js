(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* Classes */
const Game = require('./game');
const Board = require('./board');
const SFX = require('./sfx');

const MS_PER_FRAME = 1000 / 16;

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var board = new Board(512, 512, 64, 32);
var sfx = new SFX();
var mainTimer = 0;
var mainState = "initializing";
var prepTimer = 0;
var data = {
  timer: 30,
  timerBase: 15,
  score: 0,
  // hiScore: 0,
  level: 1
};

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function (timestamp) {
  if (game.gameOver) { game.end(); return; }
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  switch (mainState) {
    case "prep":
      prepTimer += elapsedTime;
      if (prepTimer >= 1000) {
        prepTimer -= 1000;
        data.timer--;
        if (data.timer <= 0) {
          sfx.play("stream");
          mainState = "running";
          data.timer = 0;
        }
      }
      break;

    case "running":
      mainTimer += elapsedTime;
      if (mainTimer >= MS_PER_FRAME) {
        mainTimer -= MS_PER_FRAME;
        var asdf = board.update();
        switch (asdf) {
          case "lose":
            sfx.play("gameOver");
            game.pause(true);
            game.gameOver = true;
            break;

          case "score":
            data.score++;
            // data.score += Math.max(1, data.timer * 1);
            break;

          case "win":
            sfx.play("levelUp");
            data.score += data.timer + data.level;
            data.level++;
            board = new Board(512, 512, 64, (data.level > 5) ? ((data.level > 10) ? 8 : 16) : 32);
            mainState = "initializing";
            // data.timer = Math.max(data.timerBase - ((data.level - 1) * 5), 5);
            data.timer = (data.level > 5) ? (data.level > 15) ? Math.max(5, data.timerBase - (data.level - 15) * 5) : data.timerBase : data.timerBase * 2;
            // data.timer = data.timerBase;
            break;
        }
      }
      break;
  }
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  // background
  ctx.fillStyle = "#777777";
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = "black";
  ctx.fillRect(512, 0, 2, 512);
  ctx.fillStyle = "#B2B2B2";
  ctx.fillRect(514, 0, 128, 512);

  // UI
  ctx.fillStyle = "black"
  ctx.font = "20px Verdana";
  ctx.fillText("Level:", 578, 20);
  ctx.fillText(data.level, 578, 40);
  ctx.fillText("Score:", 578, 80);
  ctx.fillText(data.score, 578, 100);
  ctx.fillText("Timer:", 578, 140);
  ctx.fillText(data.timer, 578, 160);
  ctx.fillText("Next Pipe:", 578, 360);
  ctx.fillStyle = "black";
  ctx.fillRect(544, 378, 68, 68);
  ctx.fillStyle = "#777777";
  ctx.fillRect(546, 380, 64, 64);

  // board
  board.render(ctx);
}

window.onkeydown = function (event) {
  switch (event.keyCode) {
    //Space
    case 32:
      event.preventDefault();
      switch (mainState) {
        case "prep":
          sfx.play("stream");
          mainState = "running";
          break;

        case "initializing":
          mainState = "prep";
          if (game.initialized) game.start(masterLoop);
          break;
      }
  }
}

canvas.onclick = function (event) {
  event.preventDefault();
  if (game.paused || game.gameOver || game.initialized) return;
  var clickPos = new Object();
  var clientRect = canvas.getBoundingClientRect();
  clickPos.x = Math.floor((event.clientX - clientRect.left) / (clientRect.right - clientRect.left) * canvas.width);
  clickPos.y = Math.floor((event.clientY - clientRect.top) / (clientRect.bottom - clientRect.top) * canvas.height);

  if (board.handleClick(clickPos, "left", event.ctrlKey)) sfx.play("place");
  if (mainState == "initializing") mainState = "prep";
}

canvas.oncontextmenu = function (event) {
  event.preventDefault();
  if (game.paused || game.gameOver || game.initialized) return;
  var clickPos = new Object();
  var clientRect = canvas.getBoundingClientRect();
  clickPos.x = Math.floor((event.clientX - clientRect.left) / (clientRect.right - clientRect.left) * canvas.width);
  clickPos.y = Math.floor((event.clientY - clientRect.top) / (clientRect.bottom - clientRect.top) * canvas.height);

  if (board.handleClick(clickPos, "right")) sfx.play("rotate");
  if (mainState == "initializing") mainState = "prep";
}

game.initialize();

},{"./board":2,"./game":3,"./sfx":5}],2:[function(require,module,exports){
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
  this.current = { x: this.start.x, y: this.start.y, direction: this.start.direction };
}

Board.prototype.update = function () {
  var currPipe = this.tiles[this.current.x][this.current.y];
  if (currPipe.update()) {
    if (currPipe.type == "finish") return "win";
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
    if (nextPipe != undefined && nextPipe != "empty" && nextPipe.connections[connectDir]) {
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

Board.prototype.handleClick = function (position, click, ctrl) {
  if (position.x > 512) return;
  var clickPos = new Object();
  clickPos.x = Math.floor(position.x / this.tileSize);
  clickPos.y = Math.floor(position.y / this.tileSize);

  switch (click) {
    case "left":
      var thisClickPipe = this.tiles[clickPos.x][clickPos.y];
      if (!ctrl && thisClickPipe != "empty") return;
      if (thisClickPipe.type == "start" || thisClickPipe.type == "finish" ||
        thisClickPipe.fillLevel > 0) return;
      this.tiles[clickPos.x][clickPos.y] = new Pipe(this.nextPipe, "", this.pipeMax);
      this.nextPipe = newNextPipe(this.pipeSet.num[this.pipeSet.index]);
      return 1;

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
      return 1;
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


},{"./pipe":4}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  this.paused = false;
  this.gameOver = true;
  this.initialized = false;

  // Start the game loop
  this.oldTime = performance.now();
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function (flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function (newTime) {
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if (elapsedTime >= 1000) elapsedTime = 500;

  if (!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

Game.prototype.initialize = function () {
  this.frontCtx.fillStyle = "white";
  this.frontCtx.fillRect(0, 0, this.backBuffer.width, this.backBuffer.height);
  this.frontCtx.fillStyle = "black";
  this.frontCtx.font = "bold 40px Verdana";
  this.frontCtx.textAlign = "center";
  this.frontCtx.textBaseline = "middle";
  this.frontCtx.fillText("Press Space to start!", this.backBuffer.width / 2, this.backBuffer.height / 2);



  this.initialized = true;
  this.gameOver = false;
}

Game.prototype.start = function (loop) {
  this.initialized = false;
  window.requestAnimationFrame(loop);
}

Game.prototype.end = function () {
  this.frontCtx.fillStyle = "black";
  this.frontCtx.font = "bold 60px Verdana";
  this.frontCtx.fillText("GAME OVER", 256, 256);
}


},{}],4:[function(require,module,exports){
"use strict";

module.exports = exports = Pipe;

//This should be an inheritable class...
function Pipe(type, direction, max) {
  this.type = type;
  this.fillLevel = 0;
  this.maximum = max;
  this.direction = direction;
  this.connections = setConnections(this.type);
}

Pipe.prototype.update = function () {
  this.fillLevel++;
  if (this.fillLevel == this.maximum / 2) {
    switch (this.type) {
      case "elbow_ru":
        if (this.direction == "left") this.direction = "up";
        else if (this.direction == "down") this.direction = "right";
        break;

      case "elbow_rd":
        if (this.direction == "left") this.direction = "down";
        else if (this.direction == "up") this.direction = "right";
        break;

      case "elbow_ld":
        if (this.direction == "right") this.direction = "down";
        else if (this.direction == "up") this.direction = "left";
        break;

      case "elbow_lu":
        if (this.direction == "right") this.direction = "up";
        else if (this.direction == "down") this.direction = "left";
        break;
    }
  }
  if (this.fillLevel >= this.maximum) return 1;
}

Pipe.prototype.stupidWaterRenderingCrapThatImTiredOfDealingWith = function (ctx, x, y, scale) {
  var index = Math.floor(this.fillLevel / (this.maximum / 4));
  var rects;
  switch (this.type) {
    case "start":
      rects = [
        { x: 14, y: 15, w: 2, h: 3 },
        { x: 14, y: 18, w: 2, h: 3 },
        { x: 14, y: 21, w: 2, h: 3 },
        { x: 14, y: 24, w: 2, h: 3 }
      ];
      break;

    case "finish":
      rects = [
        { x: 14, y: 5, w: 2, h: 3 },
        { x: 14, y: 8, w: 2, h: 3 },
        { x: 14, y: 11, w: 2, h: 3 },
        { x: 14, y: 14, w: 2, h: 3 }
      ];
      break;

    case "cross":
    case "vertical":
    case "horizontal":
      switch (this.direction) {
        case "up":
          rects = [
            { x: 14, y: 22, w: 2, h: 5 },
            { x: 14, y: 17, w: 2, h: 5 },
            { x: 14, y: 12, w: 2, h: 5 },
            { x: 14, y: 7, w: 2, h: 5 }
          ];
          break;

        case "left":
          rects = [
            { x: 20, y: 13, w: 5, h: 3 },
            { x: 15, y: 13, w: 5, h: 3 },
            { x: 10, y: 13, w: 5, h: 3 },
            { x: 5, y: 13, w: 5, h: 3 }
          ];
          break;

        case "down":
          rects = [
            { x: 14, y: 7, w: 2, h: 5 },
            { x: 14, y: 12, w: 2, h: 5 },
            { x: 14, y: 17, w: 2, h: 5 },
            { x: 14, y: 22, w: 2, h: 5 }
          ];
          break;

        case "right":
          rects = [
            { x: 5, y: 13, w: 5, h: 3 },
            { x: 10, y: 13, w: 5, h: 3 },
            { x: 15, y: 13, w: 5, h: 3 },
            { x: 20, y: 13, w: 5, h: 3 }
          ];
          break;
      }
      break;

    case "elbow_rd":
      switch (this.direction) {
        case "up":
        case "right":
          rects = [
            { x: 14, y: 22, w: 3, h: 4 },
            { x: 14, y: 17, w: 3, h: 5 },
            { x: 17, y: 14, w: 5, h: 3 },
            { x: 22, y: 14, w: 4, h: 3 }
          ];
          break;

        case "left":
        case "down":
          rects = [
            { x: 22, y: 14, w: 4, h: 3 },
            { x: 17, y: 14, w: 5, h: 3 },
            { x: 14, y: 17, w: 3, h: 5 },
            { x: 14, y: 22, w: 3, h: 4 }
          ];
          break;
      }
      break;

    case "elbow_ru":
      switch (this.direction) {
        case "left":
        case "up":
          rects = [
            { x: 22, y: 13, w: 3, h: 2 },
            { x: 18, y: 13, w: 4, h: 2 },
            { x: 16, y: 12, w: 2, h: 2 },
            { x: 14, y: 7, w: 2, h: 4 }
          ];
          break;

        case "down":
        case "right":
          rects = [
            { x: 14, y: 7, w: 2, h: 4 },
            { x: 16, y: 12, w: 2, h: 2 },
            { x: 18, y: 13, w: 4, h: 2 },
            { x: 22, y: 13, w: 3, h: 2 }
          ];
          break;
      }
      break;

    case "elbow_lu":
      switch (this.direction) {
        case "right":
        case "up":
          rects = [
            { x: 5, y: 14, w: 4, h: 2 },
            { x: 9, y: 13, w: 4, h: 3 },
            { x: 13, y: 10, w: 2, h: 2 },
            { x: 15, y: 7, w: 2, h: 3 }
          ];
          break;

        case "down":
        case "left":
          rects = [
            { x: 15, y: 7, w: 2, h: 3 },
            { x: 13, y: 10, w: 2, h: 2 },
            { x: 9, y: 13, w: 4, h: 3 },
            { x: 5, y: 14, w: 4, h: 2 }
          ];
          break;
      }
      break;

    case "elbow_ld":
      switch (this.direction) {
        case "right":
        case "down":
          rects = [
            { x: 4, y: 13, w: 6, h: 2 },
            { x: 11, y: 15, w: 2, h: 2 },
            { x: 13, y: 20, w: 2, h: 2 },
            { x: 14, y: 23, w: 2, h: 6 }
          ];
          break;

        case "up":
        case "left":
          rects = [
            { x: 14, y: 23, w: 2, h: 6 },
            { x: 13, y: 20, w: 2, h: 2 },
            { x: 11, y: 15, w: 2, h: 2 },
            { x: 4, y: 13, w: 6, h: 2 }
          ];
          break;
      }
      break;

    case "t_d":

      break;

    case "t_r":

      break;

    case "t_u":

      break;

    case "t_l":

      break;
  }

  ctx.fillStyle = "#00FFFF";
  for (var i = 0; i < index; i++) {
    ctx.fillRect(x + rects[i].x * scale, y + rects[i].y * scale,
      rects[i].w * scale, rects[i].h * scale);
  }
}

function setConnections(type) {
  var connections;
  switch (type) {
    case "start":
      connections = [false, false, true, false];
      break;

    case "finish":
      connections = [true, false, false, false];
      break;

    case "cross":
      connections = [true, true, true, true];
      break;

    case "vertical":
      connections = [true, false, true, false];
      break;

    case "horizontal":
      connections = [false, true, false, true];
      break;

    case "elbow_rd":
      connections = [false, false, true, true];
      break;

    case "elbow_ru":
      connections = [true, false, false, true];
      break;

    case "elbow_lu":
      connections = [true, true, false, false];
      break;

    case "elbow_ld":
      connections = [false, true, true, false];
      break;

    case "t_d":
      connections = [false, true, true, true];
      break;

    case "t_r":
      connections = [true, false, true, true];
      break;

    case "t_u":
      connections = [true, true, false, true];
      break;

    case "t_l":
      connections = [true, true, true, false];
      break;
  }
  return connections;
}


},{}],5:[function(require,module,exports){
"use strict;"

module.exports = exports = SFX;

var place = new Audio();
var rotate = new Audio();
var levelUp = new Audio();
var gameOver = new Audio();
var background = new Audio();
var stream = new Audio();

function SFX() {
  place.src = encodeURI("assets/place.wav");
  rotate.src = encodeURI("assets/rotate.wav");
  levelUp.src = encodeURI("assets/levelUp.wav");
  gameOver.src = encodeURI("assets/gameOver.wav");
  background.src = encodeURI("assets/Steamtech-Mayhem_Looping.mp3");
  background.loop = true;
  // background.play();
  stream.src = encodeURI("assets/stream.wav");
}

SFX.prototype.play = function (sound) {
  switch (sound) {
    case "place":
      place.play();
      break;

    case "rotate":
      rotate.play();
      break;

    case "levelUp":
      levelUp.play();
      break;

    case "gameOver":
      gameOver.play();
      break;

    case "stream":
      stream.play();
      break;
  }
}

},{}]},{},[1]);
