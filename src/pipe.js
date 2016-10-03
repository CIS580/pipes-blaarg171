"use strict";

module.exports = exports = Pipe;

//This should be an inheritable class...
function Pipe(type) {
  this.type = type;
  this.percentFilled = 0;
}

Pipe.prototype.update = function () {

}

Pipe.prototype.render = function (ctx) {

}