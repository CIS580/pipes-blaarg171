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
