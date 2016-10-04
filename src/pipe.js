"use strict";

module.exports = exports = Pipe;

//This should be an inheritable class...
function Pipe(type) {
  this.type = type;
  this.fillLevel = 0;
  this.maximum = 32;
  this.direction = "";
  this.connections = setConnections(this.type);
}

Pipe.prototype.update = function () {
  this.fillLevel++;
  // if (this.fillLevel == this.maximum / 2) {
  //   switch (this.type) {
  //     case "elbow_ld":
  //       if (this.direction == "left") this.direction = "down";
  //       else this.direction == "left";
  //       break;

  //     case "elbow_lu":
  //       if (this.direction == "left") this.direction = "up";
  //       else this.direction == "left";
  //       break;

  //     case "elbow_rd":
  //       if (this.direction == "right") this.direction = "down";
  //       else this.direction == "right";
  //       break;

  //     case "elbow_ru":
  //       if (this.direction == "right") this.direction = "up";
  //       else this.direction == "right";
  //       break;
  //   }
  // }
  if (this.fillLevel >= this.maximum) return true;
}

function setConnections(type) {
  var connections;
  switch (type) {
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

Pipe.prototype.stupidWaterRenderingCrapThatImTiredOfDealingWith = function () {
  var rect = new Object();
  switch (this.type) {
    case "cross":
    case "vertical":
    case "horizontal":
      switch (this.direction) {
        case "up":
          rect.x = 14;
          rect.y = 32;
          rect.width = 2;
          rect.height = this.fillLevel;
          break;

        case "left":
          rect.x = 32;
          rect.y = 13;
          rect.width = this.fillLevel;
          rect.height = 3;
          break;

        case "down":
          rect.x = 14;
          rect.y = 0;
          rect.width = 2;
          rect.height = this.fillLevel;
          break;

        case "right":
          rect.x = 0;
          rect.y = 13;
          rect.width = this.fillLevel;
          rect.height = 3;
          break;
      }
      break;

    case "elbow_rd":
      switch (instance.direction) {
        case "up":
          rect.x = 14;
          rect.y = 32;
          rect.width = Math.max(2, this.fillLevel - this.fillLevel / 2);
          rect.height = Math.min(18, this.fillLevel);
          break;

        case "left":
          rect.x = 32;
          rect.y = 14;
          rect.width = Math.min(18, this.fillLevel);
          rect.height = Math.max(2, this.fillLevel - this.fillLevel / 2);
          break;
      }
      break;

    case "elbow_ru":
      switch (instance.direction) {
        case "left":
          rect.x = 32;
          rect.y = 14;
          rect.width = Math.min(18, this.fillLevel);
          rect.height = Math.max(2, this.fillLevel - this.fillLevel / 2);
          break;

        case "down":
          rect.x = 14;
          rect.y = 0;
          rect.width = Math.max(2, this.fillLevel - this.fillLevel / 2);
          rect.height = Math.min(18, this.fillLevel);
          break;
      }
      break;

    case "elbow_lu":
      switch (instance.direction) {
        case "right":
          rect.x = 0;
          rect.y = 15;
          rect.width = Math.min(18, this.fillLevel);
          rect.height = Math.max(2, this.fillLevel - this.fillLevel / 2);
          break;

        case "down":
          rect.x = 16;
          rect.y = 0;
          rect.width = Math.max(2, this.fillLevel - this.fillLevel / 2);
          rect.height = Math.min(18, this.fillLevel);
          break;
      }
      break;

    case "elbow_ld":
      switch (instance.direction) {
        case "right":
          rect.x = 0;
          rect.y = 14;
          rect.width = Math.min(18, this.fillLevel);
          rect.height = Math.max(2, this.fillLevel - this.fillLevel / 2);
          break;

        case "up":
          rect.x = 14;
          rect.y = 32;
          rect.width = Math.max(2, this.fillLevel - this.fillLevel / 2);
          rect.height = Math.min(18, this.fillLevel);
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
  return rect;
}
