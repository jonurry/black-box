var LOCATION_TYPE = {
  CORNER: 'corner',
  GRID: 'grid',
  OUTSIDE: 'outside',
  RIM: 'rim'
};

var SHOOT_RAY_OUTCOME = {
  ABSORBED: 'ray hit marble and was absorbed',
  CORNER: 'ray is in a corner',
  DUPLICATE: 'ray has already been shot',
  MARBLE_MAX: 'marble ignored - maximum number already placed',
  MARBLE_PLACED: 'marble has been placed',
  MARBLE_REMOVED: 'marble has been removed',
  NOTHING: 'no outcome',
  OUTSIDE: 'ray is outside of the black box',
  PROPOGATED: 'ray has reached the rim',
  REFLECTED: 'ray has been reflected'
}

function BlackBox(gridSize = 8, numberOfMarbles = 4) {
  this.grid = [];
  this.gridSize = gridSize;
  this.guesses= [];
  this.numberOfMarbles = numberOfMarbles;
  this.numberOfRays = 0;
  this.checkForDeflectedRay = function(ray) {
    var probe1 = 0;
    var probe2 = 0;
    var row = ray.getPosition().row;
    var column = ray.getPosition().column;
    var gridUpperBound = this.gridSize + 1;
    if (ray.direction === DIRECTION.UP || ray.direction === DIRECTION.DOWN) {
      if(column + 1 === gridUpperBound) {
        probe1 = 0;
      } else {
        probe1 = this.grid[row][column + 1];
      }
      if(column - 1 === 0) {
        probe2 = 0;
      } else {
        probe2 = this.grid[row][column - 1];
      }
      if (probe1 === 1 && probe2 === 1) {
        //two adjacent marbles so ray is reversed
        ray.direction = (ray.direction === DIRECTION.UP) ? DIRECTION.DOWN : DIRECTION.UP;
        ray.move();
      } else if (probe1 === 1) {
        // one adjacent marble so go back one space and then head LEFT
        ray.direction = (ray.direction === DIRECTION.UP) ? DIRECTION.DOWN : DIRECTION.UP;
        ray.move();
        ray.direction = DIRECTION.LEFT;
      } else if (probe2 === 1) {
        // one adjacent marble so go back one space and then head RIGHT
        ray.direction = (ray.direction === DIRECTION.UP) ? DIRECTION.DOWN : DIRECTION.UP;
        ray.move();
        ray.direction = DIRECTION.RIGHT;
      }
    } else {
      //ray is travelling LEFT or RIGHT
      // ignore case where first propogated ray is encoutered at edge
      if(row + 1 === gridUpperBound) {
        probe1 = 0;
      } else {
        probe1 = this.grid[row + 1][column];
      }
      if(row - 1 === 0) {
        probe2 = 0;
      } else {
        probe2 = this.grid[row - 1][column];
      }
      if (probe1 === 1 && probe2 === 1) {
        //two adjacent marbles so ray is reversed
        ray.direction = (ray.direction === DIRECTION.LEFT) ? DIRECTION.RIGHT : DIRECTION.LEFT;
        ray.move();
      } else if (probe1 === 1) {
        // one adjacent marble so go back one space and then head UP
        ray.direction = (ray.direction === DIRECTION.LEFT) ? DIRECTION.RIGHT : DIRECTION.LEFT;
        ray.move();
        ray.direction = DIRECTION.UP;
      } else if (probe2 === 1) {
        // one adjacent marble so go back one space and then head DOWN
        ray.direction = (ray.direction === DIRECTION.LEFT) ? DIRECTION.RIGHT : DIRECTION.LEFT;
        ray.move();
        ray.direction = DIRECTION.DOWN;
      }
    }

  };
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
      returnLocationType = LOCATION_TYPE.GRID;
    } else if
      // check if position is at a corner of the grid
      ((row === 0 && col === 0) ||
      (row === 0 && col === gridUpperBound) ||
      (row === gridUpperBound && col === 0) ||
      (row === gridUpperBound && col === gridUpperBound)) {
        returnLocationType = LOCATION_TYPE.CORNER;
    } else if
      // check if position is on the rim (i.e. a valid place to shoot a ray)
      (((row === 0 || row === this.gridSize + 1) && (col >= 1 && col <= this.gridSize)) ||
      ((col === 0 || col === this.gridSize + 1) && (row >= 1 && row <= this.gridSize))) {
        returnLocationType = LOCATION_TYPE.RIM;
    } else {
      // otherwise, position must be outside the black box
      returnLocationType = LOCATION_TYPE.OUTSIDE;
    }
    return returnLocationType;
  }
  this.guess = function(newGuess) {
    var guessRow = newGuess.getPosition().row;
    var guessColumn = newGuess.getPosition().column;
    var removeGuess = -1;
    for (var i = 0, guess; guess = this.guesses[i]; i++) {
      if (guess.row === guessRow &&
          guess.column === guessColumn) {
        // that guess has already been made so remove guess
        removeGuess = i;
      }
    }
    if (removeGuess > -1) {
      this.guesses.splice(removeGuess, 1);
      return SHOOT_RAY_OUTCOME.MARBLE_REMOVED;
    } else if (this.guesses.length < this.numberOfMarbles) {
      this.guesses.push(newGuess.getPosition());
      return SHOOT_RAY_OUTCOME.MARBLE_PLACED;
    } else {
      return SHOOT_RAY_OUTCOME.MARBLE_MAX;
    }
  };
  this.initialiseGrid = function() {
    for (i = 0; i < this.grid.length; i++) {
      for (j = 0; j < this.grid.length; j++) {
        this.grid[i][j] = 0;
      }
    }
  };
  this.isGameComplete = function() {
    return (this.guesses.length === this.numberOfMarbles);
  };
  this.placeMarblesRandomlyOnGrid = function() {
    for (i = 0; i < this.numberOfMarbles; i++) {
      do {
        var row = util.getRandomIntInclusive(1, this.gridSize);
        var column = util.getRandomIntInclusive(1, this.gridSize);
      } while (this.grid[row][column] === 1);
      this.grid[row][column] = 1;
    }
  };
  this.rayAlreadyShot = function(ray) {
    // check if ray has already been shot from current location (i.e. duplicate)
    return (this.grid[ray.getPosition().row][ray.getPosition().column] !== 0);
  };
  this.rayHasHitMarble = function(ray) {
    // check if ray has hit a marble
    return (this.grid[ray.getPosition().row][ray.getPosition().column] === 1);
  };
  this.rayHasRechedRim = function(ray) {
    var currentRow = ray.getPosition().row;
    var currentColumn = ray.getPosition().column;
    var gridUpperBound = this.gridSize + 1;
    // check if ray has reached the rim
    return (currentRow === 0 ||
            currentRow === gridUpperBound ||
            currentColumn === 0 ||
            currentColumn === gridUpperBound);
  };
  this.rayIsInCorner = function(ray) {
    var currentRow = ray.getPosition().row;
    var currentColumn = ray.getPosition().column;
    var gridUpperBound = this.gridSize + 1;
    // check if ray is in a corner
    return ((currentRow === 0 && currentColumn === 0) ||
            (currentRow === 0 && currentColumn === gridUpperBound) ||
            (currentRow === gridUpperBound && currentColumn === 0) ||
            (currentRow === gridUpperBound && currentColumn === gridUpperBound));
  };
  this.rayIsInsideGrid = function(ray) {
    var currentRow = ray.getPosition().row;
    var currentColumn = ray.getPosition().column;
    var gridUpperBound = this.gridSize + 1;
    return (currentRow > 0 &&
            currentColumn > 0 &&
            currentRow < gridUpperBound &&
            currentColumn < gridUpperBound);
  };
  this.rayIsOutsideGrid = function(ray) {
    var currentRow = ray.getPosition().row;
    var currentColumn = ray.getPosition().column;
    var gridUpperBound = this.gridSize + 1;
    return (currentRow < 0 ||
            currentColumn < 0 ||
            currentRow > gridUpperBound ||
            currentColumn > gridUpperBound);
  };
  this.scoreGame = function() {
    // 1 point for each entry and exit location
    // 5 points for each guess in the wrong location
    // incomplete games will not be scored
    var score;
    if (this.isGameComplete()) {
      score = 0;
      // Add up the ray scores
      for (var i = 1; i <= this.gridSize; i++) {
        if (this.grid[0][i] !== 0) {
          score++;
        }
        if (this.grid[this.gridSize + 1][i] !== 0) {
          score++;
        }
        if (this.grid[i][0] !== 0) {
          score++;
        }
        if (this.grid[i][this.gridSize + 1] !== 0) {
          score++;
        }
      }
      // process the guesses
      this.guesses.forEach(function(guess) {
        if (this.grid[guess.row][guess.column] === 0) {
          score += 5;
          this.grid[guess.row][guess.column] = 'n'
        } else {
          this.grid[guess.row][guess.column] = 'y'
        }
      }, this);
      // cycle through grid and mark any marbles that were not found
      for (var row = 1; row <= this.gridSize; row++) {
        for (var column = 1; column <= this.gridSize; column++) {
          if (this.grid[row][column] === 1) {
            this.grid[row][column] = 'x';
          }
        }
      }
      score = 'Your score is: ' + score;
    } else {
      var numberMissingGuesses = this.numberOfMarbles - this.guesses.length;
      score = 'Make ' +
              numberMissingGuesses.toString() +
              ' more guess' +
              ((numberMissingGuesses === 1) ? '' : 'es') +
              ' to get a score';
    }
    return score;
  };
  this.shootRay = function(ray) {
    var originalRow = ray.getPosition().row;
    var originalColumn = ray.getPosition().column;
    var outcome = SHOOT_RAY_OUTCOME.NOTHING;
    if (this.rayIsOutsideGrid(ray)) {
      outcome = SHOOT_RAY_OUTCOME.OUTSIDE;
    } else if (this.rayIsInCorner(ray)) {
      outcome = SHOOT_RAY_OUTCOME.CORNER;
    } else if (this.rayIsInsideGrid(ray)){
      outcome = this.guess(ray);
    } else if (this.rayAlreadyShot(ray)) {
      outcome = SHOOT_RAY_OUTCOME.DUPLICATE;
    } else {
      do {
        ray.move();
        if (this.rayHasHitMarble(ray)) {
          this.grid[originalRow][originalColumn] = 'a';
          outcome = SHOOT_RAY_OUTCOME.ABSORBED;
        } else if (this.rayHasRechedRim(ray)) {
          if (ray.getPosition().row === originalRow &&
              ray.getPosition().column === originalColumn) {
            this.grid[originalRow][originalColumn] = 'r';
            outcome = SHOOT_RAY_OUTCOME.REFLECTED;
          } else {
            this.numberOfRays += 1;
            this.grid[ray.getPosition().row][ray.getPosition().column] = this.numberOfRays;
            this.grid[originalRow][originalColumn] = this.numberOfRays;
            outcome = SHOOT_RAY_OUTCOME.PROPOGATED;
          }
        } else {
          this.checkForDeflectedRay(ray);
          if (this.rayHasRechedRim(ray)) {
            if (ray.getPosition().row === originalRow &&
                ray.getPosition().column === originalColumn) {
              this.grid[originalRow][originalColumn] = 'r';
              outcome = SHOOT_RAY_OUTCOME.REFLECTED;
            } else {
              this.numberOfRays += 1;
              this.grid[ray.getPosition().row][ray.getPosition().column] = this.numberOfRays;
              this.grid[originalRow][originalColumn] = this.numberOfRays;
              outcome = SHOOT_RAY_OUTCOME.PROPOGATED;
            }
          }
        }
      } while (outcome === SHOOT_RAY_OUTCOME.NOTHING)
    }
    return outcome;
  };
};

function View(blackbox) {
  this.blackbox = blackbox;
  this.view = this;
  this.renderGridConsole = function() {
    var gridLine;
    for (i = 0; i < this.blackbox.grid.length; i++) {
      gridLine = '';
      for (j = 0; j < this.blackbox.grid.length; j++) {
        gridLine += String(this.blackbox.grid[i][j]) + '\t';
      }
      console.log(gridLine + '\t' + String(i));
    }
  };
  this.renderGridHTML = function() {
    var blackboxDiv = document.getElementById('blackbox');
    blackboxDiv.innerHTML = '';
    var upperGridBound = blackbox.gridSize + 1;
    // render ray outcomes
    for (var row = 0; row <= upperGridBound; row++) {
      for (var column = 0; column <= upperGridBound; column++) {
        var cellDiv = document.createElement('div');
        var classes = ['cell', 'cell-' + (upperGridBound + 1)];
        switch (blackbox.grid[row][column]) {
          case 0:
            // no action required
            break;
          case 'a':
            classes.push('hit');
            break;
          case 'n':
            classes.push('guess-wrong');
            break;
          case 'r':
            classes.push('reflect');
            break;
          case 'x':
            classes.push('not-found');
            break;
          case 'y':
            classes.push('guess-right');
              break;
          default:
            if (row === 0 || row === upperGridBound || column === 0 || column === upperGridBound) {
              classes.push('ray-' + blackbox.grid[row][column]);
            }
        }
        cellDiv.dataset.row = row;
        cellDiv.dataset.column = column;
        // render guesses
        blackbox.guesses.forEach(function(guess) {
          if (Number(guess.row) === row && Number(guess.column) === column) {
            classes.push('guess');
          }
        }, this);
        cellDiv.className = classes.join(' ');
        blackboxDiv.appendChild(cellDiv);
      }
    }
  };
  this.setupEventHandlers = function() {
    var blackboxDiv = document.getElementById('blackbox');
    blackboxDiv.addEventListener('click', function(event) {
      var clickedElement = event.target;
      if (clickedElement.className.includes('cell')) {
        var row = Number(clickedElement.dataset.row);
        var column = Number(clickedElement.dataset.column);
        var upperGridBound = blackbox.gridSize + 1;
        var direction = DIRECTION.NONE;
        if (row === 0) {
          direction = DIRECTION.DOWN;
        } else if (row === upperGridBound) {
          direction = DIRECTION.UP;
        } else if (column === 0) {
          direction = DIRECTION.RIGHT;
        } else if (column === upperGridBound) {
          direction = DIRECTION.LEFT;
        }
        blackbox.shootRay(new Vector(row, column, direction));
        view.renderGridHTML();
      }
    });
    var buttonNewGame = document.getElementById('buttonNewGame');
    buttonNewGame.addEventListener('click', function(event) {
      var gridSize = Number(document.getElementById('inputGridSize').value);
      var numberOfMarbles = Number(document.getElementById('inputMarbles').value);
      blackbox = new BlackBox(gridSize, numberOfMarbles);
      blackbox.createGrid();
      blackbox.initialiseGrid();
      blackbox.placeMarblesRandomlyOnGrid();
      view.blackbox = blackbox;
      view.renderGridConsole();
      view.renderGridHTML();
    });
    var buttonScoreGame = document.getElementById('buttonScoreGame');
    buttonScoreGame.addEventListener('click', function(event) {
      var score = blackbox.scoreGame();
      document.getElementById('labelScore').innerHTML = score;
      view.renderGridConsole();
      view.renderGridHTML();
    });
  };
  this.setupEventHandlers();
};
