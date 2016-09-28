"use strict";

/* Classes */
const Game = require('./game');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var spritesheet = new Image();
spritesheet.src = 'assets/pipes.png';

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

  // TODO: Render the board

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
  var clickPos = { x: event.x, y: event.y };
}

game.initialize();
