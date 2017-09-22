var locationType = {
  CORNER: 'corner',
  GRID: 'grid',
  OUTSIDE: 'outside',
  RIM: 'rim'
};

function BlackBox(gridSize = 8, numberOfMarbles = 4) {
  this.grid = [];
  this.gridSize = gridSize;
  this.guesses= [];
  this.numberOfMarbles = numberOfMarbles;
  this.numberOfRays = 0;
  this.createGrid = function() {
    //first row. 2 extra slots to record ray outcomes at either end
    this.grid = new Array(this.gridSize + 2);
    for (i = 0; i < this.grid.length; i++) {
      this.grid[i] = new Array(this.gridSize + 2);
    }
  };
  this.getLocationType = function(position) {
    var gridUpperBound = this.gridSize + 1;
    var row = position.row;
    var col = position.column;
    var returnLocationType;
    // check if position is inside the grid
    if (row > 0 && col > 0 && row < gridUpperBound && col < gridUpperBound) {
      returnLocationType = locationType.GRID;
    } else if
      // check if position is at a corner of the grid
      ((row === 0 && col === 0) ||
      (row === 0 && col === gridUpperBound) ||
      (row === gridUpperBound && col === 0) ||
      (row === gridUpperBound && col === gridUpperBound)) {
        returnLocationType = locationType.CORNER;
    } else if
      // check if position is on the rim (i.e. a valid place to shoot a ray)
      (((row === 0 || row === this.gridSize + 1) && (col >= 1 && col <= this.gridSize)) ||
      ((col === 0 || col === this.gridSize + 1) && (row >= 1 && row <= this.gridSize))) {
        returnLocationType = locationType.RIM;
    } else {
      // otherwise, position must be outside the black box
      returnLocationType = locationType.OUTSIDE;
    }
    return returnLocationType;
  }
  this.guess = function(newGuess) {
    var removeGuess = -1;
    for (var i = 0, guess; guess = this.guesses[i]; i++) {
      if (guess.row === newGuess.row && guess.column === newGuess.column) {
        // that guess has already been made so remove guess
        removeGuess = i;
      }
    }
    if (removeGuess > -1) {
      this.guesses.splice(removeGuess, 1);
    } else if (this.guesses.length < this.numberOfMarbles) {
      this.guesses.push(newGuess);
    }
  };
  this.initialiseGrid = function() {
    for (i = 0; i < this.grid.length; i++) {
      for (j = 0; j < this.grid.length; j++) {
        this.grid[i][j] = 0;
      }
    }
  };
  this.placeMarblesRandomlyOnGrid = function() {
    for (i = 0; i < this.numberOfMarbles; i++) {
      do {
        var x = util.getRandomIntInclusive(1, this.gridSize);
        var y = util.getRandomIntInclusive(1, this.gridSize);
      } while (this.grid[x][y] === 1);
      this.grid[x][y] = 1;
    }
  };
  this.renderGrid = function() {
    var gridLine;
    for (i = 0; i < this.grid.length; i++) {
      gridLine = '';
      for (j = 0; j < this.grid.length; j++) {
        gridLine += String(this.grid[i][j]) + '\t';
      }
      console.log(gridLine + '\t' + String(i));
      //console.log(this.grid[i][0], this.grid[i][1], this.grid[i][2], this.grid[i][3], this.grid[i][4], this.grid[i][5], this.grid[i][6], this.grid[i][7], this.grid[i][8], this.grid[i][9]);
    }
  };
  this.shootRay = function(x, y) {

    // initialise ray position
    var xPos = x;
    var yPos = y;
    var gridUpperBound = this.gridSize + 1;

    // ignore shots from corners of the grid
    if ((x === 0 && y === 0) ||
        (x === 0 && y === gridUpperBound) ||
        (x === gridUpperBound && y === 0) ||
        (x === gridUpperBound && y === gridUpperBound)) {
      console.log('corner');
      return;
    }

    // guess marble location inside the grid
    if (x > 0 && y > 0 && x < gridUpperBound && y < gridUpperBound) {
      this.guess(x , y);
      console.log(this.guesses);
      return;
    }

    // ignore duplicate rim shots
    if (this.grid[x][y] !== 0) {
      console.log('duplicate shot');
      return;
    }

    // get direction of travel
    var xDir = 0;
    var yDir = 0;
    if (x === 0) {
      xDir = 1;
    } else if (x === (gridUpperBound)) {
      xDir = -1;
    }
    if (y === 0) {
      yDir = 1;
    } else if (y === (gridUpperBound)) {
      yDir = -1;
    }

    do {

      var probe1, probe2;

      // set next ray position
      xPos = xPos + xDir;
      yPos = yPos + yDir;

      console.log('position:', xPos, yPos);
      console.log('direction:', xDir, yDir);

      //test for a direct hit
      if (this.grid[xPos][yPos] === 1) {
        console.log('hit');
        this.grid[x][y] = 'a';
        this.renderGrid();
        return;
      }

      // test if edge of grid has been reached
      if (xPos === 0 || yPos === 0 || xPos === gridUpperBound || yPos === gridUpperBound) {
        console.log('progogation');
        this.numberOfRays += 1;
        this.grid[x][y] = this.numberOfRays;
        this.grid[xPos][yPos] = this.numberOfRays;
        this.renderGrid();
        return;
      }

      //test for reflection
      if (xDir === 0) {
        //ray is travelling in the y-axis so test for marble presence in the adjacent x-axis locations
        // ignore case where first propogated ray is encoutered at edge
        if(xPos + 1 === gridUpperBound) {
          probe1 = 0;
        } else {
          probe1 = this.grid[xPos + 1][yPos];
        }
        if(xPos - 1 === 0) {
          probe2 = 0;
        } else {
          probe2 = this.grid[xPos - 1][yPos];
        }
        if (probe1 === 1 && probe2 === 1) {
          //two adjacent marbles so ray is reflected
          console.log('reflection');
          this.grid[x][y] = 'r';
          this.renderGrid();
          return;
        } else if (probe1 === 1) {
          // one adjacent marble so change position and direction
          yPos -= yDir;
          xDir = -1;
          yDir = 0;
        } else if (probe2 === 1) {
          // one adjacent marble so change position and direction
          yPos -= yDir;
          xDir = 1;
          yDir = 0;
        }
      } else if (yDir === 0) {
        //ray is travelling in the x-axis so test for marble presence in the adjacent y-axis locations
        // ignore case where first propogated ray is encoutered at edge
        if(yPos + 1 === gridUpperBound) {
          probe1 = 0;
        } else {
          probe1 = this.grid[xPos][yPos + 1];
        }
        if(yPos - 1 === 0) {
          probe2 = 0;
        } else {
          probe2 = this.grid[xPos][yPos - 1];
        }
        if (probe1 === 1 && probe2 === 1) {
          //two adjacent marbles so ray is reflected
          console.log('reflection');
          this.grid[x][y] = 'r';
          this.renderGrid();
          return;
        } else if (probe1 === 1) {
          // one adjacent marble so change position and direction
          xPos -= xDir;
          xDir = 0;
          yDir = -1;
        } else if (probe2 === 1) {
          // one adjacent marble so change position and direction
          xPos -= xDir;
          xDir = 0;
          yDir = 1;
        }
      }

    } while (xPos > 0 && yPos > 0 && xPos < gridUpperBound && yPos < gridUpperBound)

    // check for immediate reflection
    if (xPos === x && yPos === y) {
      console.log('reflection');
      this.grid[x][y] = 'r';
    }

    this.renderGrid();

  }
};
