(function(root, BLACKBOX, undefined) {

  // define black box constants
  const SHOOT_RAY_OUTCOME = {
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

  // dependencies
  // Node.js import modules
  if (typeof exports === 'object') {
    if (BLACKBOX === undefined) {
      BLACKBOX = {};
    }
    if (BLACKBOX.VECTOR === undefined) {
      var vectorModule = require('../js/vector.js');
      BLACKBOX.VECTOR = vectorModule.VECTOR;
    }
    if (BLACKBOX.utility === undefined) {
      var utilModule = require('../js/utility.js');
      BLACKBOX.utility = utilModule.blackBoxUtil;
    }
  }

  // private properties
  //

  // private methods
  function checkForDeflectedRay(ray, grid, gridSize) {
    var probe1 = 0;
    var probe2 = 0;
    var row = ray.position.row;
    var column = ray.position.column;
    var gridUpperBound = gridSize + 1;
    var DIR = BLACKBOX.VECTOR.DIRECTION;
    if (ray.direction === DIR.UP || ray.direction === DIR.DOWN) {
      if(column + 1 === gridUpperBound) {
        probe1 = 0;
      } else {
        probe1 = grid[row][column + 1];
      }
      if(column - 1 === 0) {
        probe2 = 0;
      } else {
        probe2 = grid[row][column - 1];
      }
      if (probe1 === 1 && probe2 === 1) {
        //two adjacent marbles so ray is reversed
        ray.direction = (ray.direction === DIR.UP) ? DIR.DOWN : DIR.UP;
        ray.move();
      } else if (probe1 === 1) {
        // one adjacent marble so go back one space and then head LEFT
        ray.direction = (ray.direction === DIR.UP) ? DIR.DOWN : DIR.UP;
        ray.move();
        ray.direction = DIR.LEFT;
      } else if (probe2 === 1) {
        // one adjacent marble so go back one space and then head RIGHT
        ray.direction = (ray.direction === DIR.UP) ? DIR.DOWN : DIR.UP;
        ray.move();
        ray.direction = DIR.RIGHT;
      }
    } else {
      //ray is travelling LEFT or RIGHT
      // ignore case where first propogated ray is encoutered at edge
      if(row + 1 === gridUpperBound) {
        probe1 = 0;
      } else {
        probe1 = grid[row + 1][column];
      }
      if(row - 1 === 0) {
        probe2 = 0;
      } else {
        probe2 = grid[row - 1][column];
      }
      if (probe1 === 1 && probe2 === 1) {
        //two adjacent marbles so ray is reversed
        ray.direction = (ray.direction === DIR.LEFT) ? DIR.RIGHT : DIR.LEFT;
        ray.move();
      } else if (probe1 === 1) {
        // one adjacent marble so go back one space and then head UP
        ray.direction = (ray.direction === DIR.LEFT) ? DIR.RIGHT : DIR.LEFT;
        ray.move();
        ray.direction = DIR.UP;
      } else if (probe2 === 1) {
        // one adjacent marble so go back one space and then head DOWN
        ray.direction = (ray.direction === DIR.LEFT) ? DIR.RIGHT : DIR.LEFT;
        ray.move();
        ray.direction = DIR.DOWN;
      }
    }

  };

  function createGrid(grid, gridSize) {
    // reset empty array without creating a new array
    grid.length = 0;
    //first row. 2 extra slots to record ray outcomes at either end
    for (var row = 0; row < gridSize + 2; row++) {
      grid[row] = [];
      grid[row].length = gridSize + 2;
    }
  };

  function initialiseGrid(grid, gridSize) {
    for (var row = 0; row < gridSize + 2; row++) {
      grid[row].fill(0);
    }
  };

  function placeMarblesRandomlyOnGrid(grid, gridSize, numberOfMarbles) {
    for (i = 0; i < numberOfMarbles; i++) {
      do {
        var row = BLACKBOX.utility.getRandomIntInclusive(1, gridSize);
        var column = BLACKBOX.utility.getRandomIntInclusive(1, gridSize);
      } while (grid[row][column] === 1);
      grid[row][column] = 1;
    }
  };

  function rayAlreadyShot(ray, grid) {
    // check if ray has already been shot from current location (i.e. duplicate)
    return (grid[ray.position.row][ray.position.column] !== 0);
  };

  function rayHasHitMarble(ray, grid) {
    // check if ray has hit a marble
    return (grid[ray.position.row][ray.position.column] === 1);
  };

  function rayHasRechedRim(ray, gridSize) {
    var currentRow = ray.position.row;
    var currentColumn = ray.position.column;
    var gridUpperBound = gridSize + 1;
    // check if ray has reached the rim
    return (currentRow === 0 ||
            currentRow === gridUpperBound ||
            currentColumn === 0 ||
            currentColumn === gridUpperBound);
  };

  function rayIsInCorner(ray, gridSize) {
    var currentRow = ray.position.row;
    var currentColumn = ray.position.column;
    var gridUpperBound = gridSize + 1;
    // check if ray is in a corner
    return ((currentRow === 0 && currentColumn === 0) ||
            (currentRow === 0 && currentColumn === gridUpperBound) ||
            (currentRow === gridUpperBound && currentColumn === 0) ||
            (currentRow === gridUpperBound && currentColumn === gridUpperBound));
  };

  function rayIsInsideGrid(ray, gridSize) {
    var currentRow = ray.position.row;
    var currentColumn = ray.position.column;
    var gridUpperBound = gridSize + 1;
    return (currentRow > 0 &&
            currentColumn > 0 &&
            currentRow < gridUpperBound &&
            currentColumn < gridUpperBound);
  };

  function rayIsOutsideGrid(ray, gridSize) {
    var currentRow = ray.position.row;
    var currentColumn = ray.position.column;
    var gridUpperBound = gridSize + 1;
    return (currentRow < 0 ||
            currentColumn < 0 ||
            currentRow > gridUpperBound ||
            currentColumn > gridUpperBound);
  };

  // public API - constructor
  function BlackBox(gridSize = 8, numberOfMarbles = 4, newGame = false) {

    this.gameHasFinished = false;
    this.numberOfRays = 0;
    this.grid = [];
    this.gridSize = gridSize;
    this.guesses= [];
    this.numberOfMarbles = numberOfMarbles;

    if (newGame) {
      this.newGame(this.gridSize, this.numberOfMarbles);
    }

  };

  // public API - prototype methods

  BlackBox.prototype.allMarblesPlaced = function() {
    return (this.guesses.length === this.numberOfMarbles);
  };

  BlackBox.prototype.guess = function(newGuess) {
    var guessRow = newGuess.position.row;
    var guessColumn = newGuess.position.column;
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
      this.guesses.push(newGuess.position);
      return SHOOT_RAY_OUTCOME.MARBLE_PLACED;
    } else {
      return SHOOT_RAY_OUTCOME.MARBLE_MAX;
    }
  };

  BlackBox.prototype.newGame = function(gridSize = 8, numberOfMarbles = 4) {
    this.gameHasFinished = false;
    this.grid = [];
    this.gridSize = gridSize;
    this.guesses= [];
    this.numberOfMarbles = numberOfMarbles;
    this.numberOfRays = 0;
    createGrid(this.grid, this.gridSize);
    initialiseGrid(this.grid, this.gridSize);
    placeMarblesRandomlyOnGrid(this.grid, this.gridSize, this.numberOfMarbles);
  };

  BlackBox.prototype.scoreGame = function() {
    // 1 point for each entry and exit location
    // 5 points for each guess in the wrong location
    // incomplete games will not be scored
    var score;
    if (this.allMarblesPlaced()) {
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

  BlackBox.prototype.shootRay = function(ray) {
    var originalRow = ray.position.row;
    var originalColumn = ray.position.column;
    var outcome = SHOOT_RAY_OUTCOME.NOTHING;
    if (!this.gameHasFinished) {
      if (rayIsOutsideGrid(ray, this.gridSize)) {
        outcome = SHOOT_RAY_OUTCOME.OUTSIDE;
      } else if (rayIsInCorner(ray, this.gridSize)) {
        outcome = SHOOT_RAY_OUTCOME.CORNER;
      } else if (rayIsInsideGrid(ray, this.gridSize)){
        outcome = this.guess(ray);
      } else if (rayAlreadyShot(ray, this.grid)) {
        outcome = SHOOT_RAY_OUTCOME.DUPLICATE;
      } else {
        do {
          ray.move();
          if (rayHasHitMarble(ray, this.grid)) {
            this.grid[originalRow][originalColumn] = 'a';
            outcome = SHOOT_RAY_OUTCOME.ABSORBED;
          } else if (rayHasRechedRim(ray, this.gridSize)) {
            if (ray.position.row === originalRow &&
                ray.position.column === originalColumn) {
              this.grid[originalRow][originalColumn] = 'r';
              outcome = SHOOT_RAY_OUTCOME.REFLECTED;
            } else {
              this.numberOfRays += 1;
              this.grid[ray.position.row][ray.position.column] = this.numberOfRays;
              this.grid[originalRow][originalColumn] = this.numberOfRays;
              outcome = SHOOT_RAY_OUTCOME.PROPOGATED;
            }
          } else {
            checkForDeflectedRay(ray, this.grid, this.gridSize);
            if (rayHasRechedRim(ray, this.gridSize)) {
              if (ray.position.row === originalRow &&
                  ray.position.column === originalColumn) {
                this.grid[originalRow][originalColumn] = 'r';
                outcome = SHOOT_RAY_OUTCOME.REFLECTED;
              } else {
                this.numberOfRays += 1;
                this.grid[ray.position.row][ray.position.column] = this.numberOfRays;
                this.grid[originalRow][originalColumn] = this.numberOfRays;
                outcome = SHOOT_RAY_OUTCOME.PROPOGATED;
              }
            }
          }
        } while (outcome === SHOOT_RAY_OUTCOME.NOTHING)
      }
    }
    return outcome;
  };

  // Export to root (window in browser)
  if (typeof define === 'function' && define.amd) {
    // requireJS
    //define(VECTOR);
  } else if (typeof exports === 'object') {
    // Node.js
    module.exports.SHOOT_RAY_OUTCOME = SHOOT_RAY_OUTCOME;
    module.exports.BlackBoxModel = BlackBox;
    if (process.env.NODE_ENV === 'test') {
      module.exports.BlackBoxModel._private = {
        checkForDeflectedRay: checkForDeflectedRay,
        createGrid: createGrid,
        initialiseGrid: initialiseGrid,
        placeMarblesRandomlyOnGrid: placeMarblesRandomlyOnGrid,
        rayAlreadyShot: rayAlreadyShot,
        rayHasHitMarble: rayHasHitMarble,
        rayHasRechedRim: rayHasRechedRim,
        rayIsInCorner: rayIsInCorner,
        rayIsInsideGrid: rayIsInsideGrid,
        rayIsOutsideGrid: rayIsOutsideGrid
      }
    }
  } else {
    // in the browser
    root = root || {};
    root.BLACKBOX = root.BLACKBOX || {};
    root.BLACKBOX.SHOOT_RAY_OUTCOME = SHOOT_RAY_OUTCOME;
    root.BLACKBOX.Model = BlackBox;
  }

})(this, this.BLACKBOX);
