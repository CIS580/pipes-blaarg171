"use strict;"

module.exports = exports = SFX;

var place = new Audio();
var rotate = new Audio();
var levelUp = new Audio();
var gameOver = new Audio();
var background = new Audio();
var stream = new Audio();

function SFX() {
  place.src = "assets/place.wav";
  rotate.src = "assets/rotate.wav";
  levelUp.src = "assets/levelUp.wav";
  gameOver.src = "assets/gameOver.wav";
  background.src = "assets/Steamtech-Mayhem_Looping.mp3";
  background.loop = true;
  // background.play();
  stream.src = "assets/stream.wav";
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
