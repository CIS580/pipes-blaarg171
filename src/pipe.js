"use strict";

module.exports = exports = Pipe;

//This should be an inheritable class...
function Pipe(type, direction, max) {
  this.type = type;
  this.fillLevel = 0;
  this.maximum = Math.max(max, 8);
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
  console.log(this.fillLevel + " / " + this.maximum);
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

