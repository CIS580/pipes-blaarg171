"use strict";

/* Classes */
const Game = require('./game');
const Board = require('./board');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var board = new Board(canvas.width, canvas.height, 64);

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

  // TODO: Advance the fluid
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "#777777";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  board.render(ctx);
}

window.onkeydown = function (event) {
  switch (event.keyCode) {
    //Space
    case 32:
      event.preventDefault();
      if (game.initialized) game.start(masterLoop);
      break;
  }
}

canvas.onclick = function (event) {
  event.preventDefault();
  // TODO: Place or rotate pipe tile
  var clickPos = new Object();
  var clientRect = canvas.getBoundingClientRect();
  clickPos.x = Math.floor((event.clientX - clientRect.left) / (clientRect.right - clientRect.left) * canvas.width);
  clickPos.y = Math.floor((event.clientY - clientRect.top) / (clientRect.bottom - clientRect.top) * canvas.height);
  clickPos = board.getTileFromClick(clickPos);
  board.tiles[clickPos.x][clickPos.y] = "cross";
}

function rollRandom(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum) + minimum);
}

game.initialize();
