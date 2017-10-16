(function(root, undefined) {

  // define vector constants
  const VECTOR = {};
  VECTOR.DIRECTION = {
    UP: {rowIncrement: -1, columnIncrement: 0},
    DOWN: {rowIncrement: 1, columnIncrement: 0},
    LEFT: {rowIncrement: 0, columnIncrement: -1},
    RIGHT: {rowIncrement: 0, columnIncrement: 1},
    NONE: {rowIncrement: 0, columnIncrement: 0}
  };

  function Vector(row, column, direction) {

    if (direction !== undefined) {
      this.direction = direction;
    } else {
      this.direction = VECTOR.DIRECTION.NONE;
    }
    this.position = {row: parseInt(row, 10), column: parseInt(column, 10)};

  };

  Vector.prototype.move = function() {
    try {
      var rowInc = this.direction.rowIncrement;
      var columnInc = this.direction.columnIncrement;
      if (
        Number.isInteger(rowInc) &&
        Number.isInteger(columnInc) &&
        rowInc >= -1 &&
        rowInc <= 1 &&
        columnInc >= -1 &&
        columnInc <= 1
      ) {
        paramIsValid = true;
        this.position.row += rowInc;
        this.position.column += columnInc;
      }
    } catch (e) {
      throw("The vector direction was not a valid direction.");
    }
  };

  Vector.prototype.setPosition = function(row, column) {
    this.position.row = row;
    this.position.column = column;
  };

  // Export to root (window in browser)
  if (typeof define === 'function' && define.amd) {
    // requireJS
    // define(VECTOR);
    // define(Vector);
  } else if (typeof exports === 'object') {
    // Node.js
    module.exports.VECTOR = VECTOR;
    module.exports.Vector = Vector;
  } else {
    // in the browser
    root = root || {};
    root.BLACKBOX = root.BLACKBOX || {};
    root.BLACKBOX.VECTOR = VECTOR;
  	root.BLACKBOX.Vector = Vector;
  }

})(this);
