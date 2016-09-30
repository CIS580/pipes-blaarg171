"use strict";

module.exports = exports = Pipe;

function Pipe(type) {
  this.type = type;
  this.spritesheet = new Image();
  this.spritesheet.src = encodeURI('assets/pipes.png');
}