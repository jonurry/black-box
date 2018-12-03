// dependencies
// Node.js import modules
if (typeof exports === 'object') {
  if (this.BLACKBOX === undefined) {
    this.BLACKBOX = {};
  }
  if (this.BLACKBOX.VECTOR === undefined) {
    var vectorModule = require('../js/vector.js');
    this.BLACKBOX.VECTOR = vectorModule.VECTOR;
  }
  if (this.BLACKBOX.utility === undefined) {
    var utilModule = require('../js/utility.js');
    this.BLACKBOX.utility = utilModule.blackBoxUtil;
  }
}

(function(root) {
  'use strict';

  const BLACKBOX = root.BLACKBOX;

  // define black box constants
  const SHOOT_RAY_OUTCOME = {
    ABSORBED: 'ray hit marble and was absorbed',
    CORNER: 'ray is in a corner',
    DUPLICATE: 'ray has already been shot',
    INSIDE: 'ray is inside the black box',
    MARBLE_MAX: 'marble ignored - maximum number already placed',
    MARBLE_PLACED: 'marble has been placed',
    MARBLE_REMOVED: 'marble has been removed',
    NOTHING: 'no outcome',
    OUTSIDE: 'ray is outside of the black box',
    PROPOGATED: 'ray has reached the rim',
    REFLECTED: 'ray has been reflected'
  };

  const DEFLECTION = {
    DEFLECTED: 'ray has been deflected',
    NONE: 'ray has not been deflected',
    REVERSED: 'ray has been reversed'
  };

  // private properties
  //

  // private methods
  function checkForDeflectedRay(ray, marbles, gridSize) {
    var probe1 = false;
    var probe2 = false;
    var row = ray.position.row + ray.direction.rowIncrement;
    var column = ray.position.column + ray.direction.columnIncrement;
    var gridUpperBound = gridSize + 1;
    var DIR = BLACKBOX.VECTOR.DIRECTION;
    var result;

    if (
      row === 0 ||
      row === gridUpperBound ||
      column === 0 ||
      column === gridUpperBound
    ) {
      result = DEFLECTION.NONE;
    } else if (ray.direction === DIR.UP || ray.direction === DIR.DOWN) {
      probe1 = marbles.some(
        marble => marble.row === row && marble.column === column + 1
      );
      probe2 = marbles.some(
        marble => marble.row === row && marble.column === column - 1
      );
      if (probe1 && probe2) {
        //two adjacent marbles so ray is reversed
        ray.direction = ray.direction === DIR.UP ? DIR.DOWN : DIR.UP;
        result = DEFLECTION.REVERSED;
      } else if (probe1) {
        // one adjacent marble so head LEFT
        ray.direction = DIR.LEFT;
        result = DEFLECTION.DEFLECTED;
      } else if (probe2) {
        // one adjacent marble so head RIGHT
        ray.direction = DIR.RIGHT;
        result = DEFLECTION.DEFLECTED;
      } else {
        result = DEFLECTION.NONE;
      }
    } else {
      //ray is travelling LEFT or RIGHT
      // ignore case where first propagated ray is encountered at edge
      probe1 = marbles.some(
        marble => marble.row === row + 1 && marble.column === column
      );
      probe2 = marbles.some(
        marble => marble.row === row - 1 && marble.column === column
      );
      if (probe1 && probe2) {
        //two adjacent marbles so ray is reversed
        ray.direction = ray.direction === DIR.LEFT ? DIR.RIGHT : DIR.LEFT;
        result = DEFLECTION.REVERSED;
      } else if (probe1) {
        // one adjacent marble so head UP
        ray.direction = DIR.UP;
        result = DEFLECTION.DEFLECTED;
      } else if (probe2) {
        // one adjacent marble so head DOWN
        ray.direction = DIR.DOWN;
        result = DEFLECTION.DEFLECTED;
      } else {
        result = DEFLECTION.NONE;
      }
    }

    return result;
  }

  function createGrid(grid, gridSize) {
    // reset empty array without creating a new array
    grid.length = 0;
    //first row. 2 extra slots to record ray outcomes at either end
    for (var row = 0; row < gridSize + 2; row++) {
      grid[row] = [];
      grid[row].length = gridSize + 2;
    }
  }

  function initialiseGrid(grid, gridSize) {
    for (var row = 0; row < gridSize + 2; row++) {
      grid[row].fill(0);
    }
  }

  function placeMarbleOnGrid(row, column, numberOfMarbles, marbles) {
    // place marble according to row and column position
    // if marble already placed then ignore request
    // if max number of marbles would be exceeded then don't place marble
    var position = {};
    position.row = row;
    position.column = column;
    if (marbles.length < numberOfMarbles) {
      if (
        !marbles.some(
          marble =>
            marble.row === position.row && marble.column === position.column
        )
      ) {
        marbles.push(position);
      }
    }
  }

  function placeMarblesRandomlyOnGrid(gridSize, numberOfMarbles, marbles) {
    var position;
    for (var i = 0; i < numberOfMarbles; i++) {
      position = {};
      do {
        position.row = BLACKBOX.utility.getRandomIntInclusive(1, gridSize);
        position.column = BLACKBOX.utility.getRandomIntInclusive(1, gridSize);
      } while (
        marbles.some(
          marble =>
            marble.row === position.row && marble.column === position.column
        )
      );
      marbles.push(position);
    }
  }

  function rayAlreadyShot(ray, grid) {
    // check if ray has already been shot from current location (i.e. duplicate)
    return grid[ray.position.row][ray.position.column] !== 0;
  }

  function rayHasHitMarble(ray, marbles) {
    // check if ray will hit a marble on next move
    var position = {};
    position.row = ray.position.row + ray.direction.rowIncrement;
    position.column = ray.position.column + ray.direction.columnIncrement;
    return marbles.some(
      marble => marble.row === position.row && marble.column === position.column
    );
  }

  function rayHasReachedRim(ray, gridSize) {
    var currentRow = ray.position.row;
    var currentColumn = ray.position.column;
    var gridUpperBound = gridSize + 1;
    // check if ray has reached the rim
    return (
      currentRow === 0 ||
      currentRow === gridUpperBound ||
      currentColumn === 0 ||
      currentColumn === gridUpperBound
    );
  }

  function rayIsInCorner(ray, gridSize) {
    var currentRow = ray.position.row;
    var currentColumn = ray.position.column;
    var gridUpperBound = gridSize + 1;
    // check if ray is in a corner
    return (
      (currentRow === 0 && currentColumn === 0) ||
      (currentRow === 0 && currentColumn === gridUpperBound) ||
      (currentRow === gridUpperBound && currentColumn === 0) ||
      (currentRow === gridUpperBound && currentColumn === gridUpperBound)
    );
  }

  function rayIsInsideGrid(ray, gridSize) {
    var currentRow = ray.position.row;
    var currentColumn = ray.position.column;
    var gridUpperBound = gridSize + 1;
    return (
      currentRow > 0 &&
      currentColumn > 0 &&
      currentRow < gridUpperBound &&
      currentColumn < gridUpperBound
    );
  }

  function rayIsOutsideGrid(ray, gridSize) {
    var currentRow = ray.position.row;
    var currentColumn = ray.position.column;
    var gridUpperBound = gridSize + 1;
    return (
      currentRow < 0 ||
      currentColumn < 0 ||
      currentRow > gridUpperBound ||
      currentColumn > gridUpperBound
    );
  }

  // public API - constructor
  function BlackBox(gridSize = 8, numberOfMarbles = 4, newGame = false) {
    this.gameHasFinished = false;
    this.grid = [];
    this.gridSize = gridSize;
    this.guesses = [];
    this.marbles = [];
    this.numberOfMarbles = numberOfMarbles;
    this.numberOfRays = 0;
    this.turns = [];

    if (newGame) {
      this.newGame(this.gridSize, this.numberOfMarbles);
    }
  }

  // public API - prototype methods

  BlackBox.prototype.allMarblesPlaced = function() {
    return this.guesses.length === this.numberOfMarbles;
  };

  BlackBox.prototype.guess = function(newGuess) {
    var guessRow = newGuess.position.row;
    var guessColumn = newGuess.position.column;
    var removeGuess = -1;
    for (var i = 0, guess; (guess = this.guesses[i]); i++) {
      if (guess.row === guessRow && guess.column === guessColumn) {
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
    this.guesses = [];
    this.marbles = [];
    this.numberOfMarbles = numberOfMarbles;
    this.numberOfRays = 0;
    this.turns = [];
    createGrid(this.grid, this.gridSize);
    initialiseGrid(this.grid, this.gridSize);
    placeMarblesRandomlyOnGrid(
      this.gridSize,
      this.numberOfMarbles,
      this.marbles
    );
  };

  BlackBox.prototype.scoreGame = function() {
    // 1 point for each entry and exit location
    // 5 points for each guess in the wrong location
    // incomplete games will not be scored
    var numberMissingGuesses;
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
        if (
          this.marbles.some(
            marble => marble.row === guess.row && marble.column === guess.column
          )
        ) {
          this.grid[guess.row][guess.column] = 'y';
        } else {
          score += 5;
          this.grid[guess.row][guess.column] = 'n';
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
      this.gameHasFinished = true;
    } else {
      numberMissingGuesses = this.numberOfMarbles - this.guesses.length;
      score =
        'Make ' +
        numberMissingGuesses.toString() +
        ' more guess' +
        (numberMissingGuesses === 1 ? '' : 'es') +
        ' to get a score';
      this.gameHasFinished = false;
    }
    return score;
  };

  BlackBox.prototype.shootRay = function(ray) {
    // returns an object that gives the overall outcome
    // and the path that the ray took
    // {
    //  outcome: SHOOT_RAY_OUTCOME,
    //  path: array of Vectors,
    //  rayNumber: the number of the ray
    // }

    var result = {
      outcome: SHOOT_RAY_OUTCOME.NOTHING,
      path: [],
      rayNumber: 0
    };

    var originalRay;
    var deflectionOutcome = DEFLECTION.NONE;
    var originalRow = ray.position.row;
    var originalColumn = ray.position.column;
    var grid = this.grid;
    var gridSize = this.gridSize;
    var upperGridBound = gridSize + 1;
    var marbles = this.marbles;
    var gameHasFinished = this.gameHasFinished;
    var DIR = BLACKBOX.VECTOR.DIRECTION;

    // determine ray direction if not specified
    if (ray.direction === DIR.NONE) {
      if (ray.position.row === 0) {
        ray.direction = DIR.DOWN;
      } else if (ray.position.row === upperGridBound) {
        ray.direction = DIR.UP;
      } else if (ray.position.column === 0) {
        ray.direction = DIR.RIGHT;
      } else if (ray.position.column === upperGridBound) {
        ray.direction = DIR.LEFT;
      }
    }

    result.path.push(JSON.parse(JSON.stringify(ray)));

    if (rayIsOutsideGrid(ray, gridSize)) {
      result.outcome = SHOOT_RAY_OUTCOME.OUTSIDE;
    } else if (rayIsInCorner(ray, gridSize)) {
      result.outcome = SHOOT_RAY_OUTCOME.CORNER;
    } else if (rayIsInsideGrid(ray, gridSize)) {
      if (!this.gameHasFinished) {
        result.outcome = this.guess(ray);
      } else {
        result.outcome = SHOOT_RAY_OUTCOME.INSIDE;
      }
    } else if (rayAlreadyShot(ray, grid) && !this.gameHasFinished) {
      result.outcome = SHOOT_RAY_OUTCOME.DUPLICATE;
    } else {
      // shoot the ray
      do {
        if (rayHasHitMarble(ray, marbles)) {
          if (!this.gameHasFinished) {
            grid[originalRow][originalColumn] = 'a';
          }
          result.path.push(JSON.parse(JSON.stringify(ray)));
          result.outcome = SHOOT_RAY_OUTCOME.ABSORBED;
        } else {
          originalRay = JSON.stringify(ray);
          deflectionOutcome = checkForDeflectedRay(ray, marbles, gridSize);
          if (deflectionOutcome !== DEFLECTION.NONE) {
            if (result.path.length === 1) {
              if (!this.gameHasFinished) {
                grid[originalRow][originalColumn] = 'r';
              }
              result.outcome = SHOOT_RAY_OUTCOME.REFLECTED;
            } else if (deflectionOutcome === DEFLECTION.REVERSED) {
              // DONE: Path is not fully traced when reflected (missing a step) id:4 gh:5
              result.path.push(JSON.parse(originalRay));
              result.path.push(JSON.parse(JSON.stringify(ray)));
            }
          }
        }
        if (result.outcome === SHOOT_RAY_OUTCOME.NOTHING) {
          ray.move();
          result.path.push(JSON.parse(JSON.stringify(ray)));
          if (rayHasReachedRim(ray, gridSize)) {
            if (
              ray.position.row === originalRow &&
              ray.position.column === originalColumn
            ) {
              if (!this.gameHasFinished) {
                grid[originalRow][originalColumn] = 'r';
              }
              result.outcome = SHOOT_RAY_OUTCOME.REFLECTED;
            } else {
              if (!this.gameHasFinished) {
                this.numberOfRays++;
                grid[ray.position.row][ray.position.column] = this.numberOfRays;
                grid[originalRow][originalColumn] = this.numberOfRays;
              }
              result.outcome = SHOOT_RAY_OUTCOME.PROPOGATED;
            }
          }
        }
      } while (result.outcome === SHOOT_RAY_OUTCOME.NOTHING);
    }

    if (gameHasFinished) {
      result.rayNumber = grid[originalRow][originalColumn];
    } else {
      result.rayNumber = this.numberOfRays;
      if (
        result.outcome === SHOOT_RAY_OUTCOME.ABSORBED ||
        result.outcome === SHOOT_RAY_OUTCOME.REFLECTED ||
        result.outcome === SHOOT_RAY_OUTCOME.PROPOGATED
      ) {
        this.turns.push(result);
      }
    }

    return result;
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
        placeMarbleOnGrid: placeMarbleOnGrid,
        placeMarblesRandomlyOnGrid: placeMarblesRandomlyOnGrid,
        rayAlreadyShot: rayAlreadyShot,
        rayHasHitMarble: rayHasHitMarble,
        rayHasReachedRim: rayHasReachedRim,
        rayIsInCorner: rayIsInCorner,
        rayIsInsideGrid: rayIsInsideGrid,
        rayIsOutsideGrid: rayIsOutsideGrid
      };
    }
  } else {
    // in the browser
    root = root || {};
    root.BLACKBOX = root.BLACKBOX || {};
    root.BLACKBOX.SHOOT_RAY_OUTCOME = SHOOT_RAY_OUTCOME;
    root.BLACKBOX.Model = BlackBox;
  }
})(this || Window);
