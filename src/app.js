"use strict";

/* Classes */
const Game = require('./game');
const Board = require('./board');
// const UI = require('./ui');

const MS_PER_FRAME = 1000 / 8;

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var board = new Board(512, 512, 64);
// var ui = new UI({ x: 514, y: 0, width: 128, height: 512 }, { timer: });
var mainTimer = 0;
var mainState = "initializing";
var prepTimer = 0;
var data = {
  timer: 30,
  score: 0,
  level: 1
};

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function (timestamp) {
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
            game.pause(true);
            break;

          case "score":
            data.score++;
            break;

          case "win":
            data.score += data.timer;
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
  // UI.render(ctx);
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
  if (game.paused || game.gameOver || game.initialized) return;
  event.preventDefault();
  var clickPos = new Object();
  var clientRect = canvas.getBoundingClientRect();
  clickPos.x = Math.floor((event.clientX - clientRect.left) / (clientRect.right - clientRect.left) * canvas.width);
  clickPos.y = Math.floor((event.clientY - clientRect.top) / (clientRect.bottom - clientRect.top) * canvas.height);

  board.handleClick(clickPos, "left");
}

canvas.oncontextmenu = function (event) {
  event.preventDefault();
  var clickPos = new Object();
  var clientRect = canvas.getBoundingClientRect();
  clickPos.x = Math.floor((event.clientX - clientRect.left) / (clientRect.right - clientRect.left) * canvas.width);
  clickPos.y = Math.floor((event.clientY - clientRect.top) / (clientRect.bottom - clientRect.top) * canvas.height);

  board.handleClick(clickPos, "right");
}

game.initialize();
