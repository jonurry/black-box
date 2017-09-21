var direction = {
  UP: {rowIncrement: -1, columnIncrement: 0},
  DOWN: {rowIncrement: 1, columnIncrement: 0},
  LEFT: {rowIncrement: 0, columnIncrement: -1},
  RIGHT: {rowIncrement: 0, columnIncrement: 1}
};

function Point(row, column) {
  this.position = {row: row, column: column};
  this.move = function(/*direction*/direction) {
    try {
      var rowInc = direction.rowIncrement;
      var columnInc = direction.columnIncrement;
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
      throw("The specified direction parameter was not a valid direction.");
    }
    return this;
  },
  this.getPosition = function() {
    return {row: this.position.row, column: this.position.column};
  },
  this.setPosition = function(row, column) {
    this.position.row = row;
    this.position.column = column;
  }
};
