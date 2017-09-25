var DIRECTION = {
  UP: {rowIncrement: -1, columnIncrement: 0},
  DOWN: {rowIncrement: 1, columnIncrement: 0},
  LEFT: {rowIncrement: 0, columnIncrement: -1},
  RIGHT: {rowIncrement: 0, columnIncrement: 1},
  NONE: {rowIncrement: 0, columnIncrement: 0}
};

function Vector(row, column, direction = DIRECTION.NONE) {
  this.direction = direction;
  this.position = {row: row, column: column};
  this.move = function() {
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
    return this;
  },
  this.getPosition = function() {
    return this.position;
  },
  this.setPosition = function(row, column) {
    this.position.row = row;
    this.position.column = column;
  }
};
