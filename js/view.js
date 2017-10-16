(function(root, BLACKBOX, undefined) {

  function View(blackbox) {
    this.blackbox = blackbox;
    this.view = this;
    this.onClickNewGame = null;
    this.setupEventHandlers();
  };

  View.prototype.renderGridConsole = function() {
    var gridLine;
    for (i = 0; i < this.blackbox.grid.length; i++) {
      gridLine = '';
      for (j = 0; j < this.blackbox.grid.length; j++) {
        gridLine += String(this.blackbox.grid[i][j]) + '\t';
      }
      console.log(gridLine + '\t' + String(i));
    }
  };

  View.prototype.renderGridHTML = function() {
    var blackboxDiv = document.getElementById('blackbox');
    blackboxDiv.innerHTML = '';
    var upperGridBound = this.blackbox.gridSize + 1;
    for (var row = 0; row <= upperGridBound; row++) {
      for (var column = 0; column <= upperGridBound; column++) {
        var cellDiv = document.createElement('div');
        var classes = [
          'cell', 'cell-' + (upperGridBound + 1)
        ];
        // render ray outcomes
        switch (this.blackbox.grid[row][column]) {
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
              classes.push('ray-' + this.blackbox.grid[row][column]);
            }
        }
        // set row and column data
        cellDiv.dataset.row = row;
        cellDiv.dataset.column = column;
        // render guesses
        if (!this.blackbox.gameHasFinished) {
          this.blackbox.guesses.forEach(function(guess) {
            if (parseInt(guess.row) === row && parseInt(guess.column) === column) {
              classes.push('guess');
            }
          }, this);
        }
        cellDiv.className = classes.join(' ');
        blackboxDiv.appendChild(cellDiv);
      }
    }
    // enable/disable score game button
    var buttonScoreGame = document.getElementById('buttonScoreGame');
    buttonScoreGame.disabled = !(this.blackbox.allMarblesPlaced() && !this.blackbox.gameHasFinished);
  };

  View.prototype.setupEventHandlers = function() {

    var blackbox = this.blackbox;
    var view = this.view;
    var blackboxDiv = document.getElementById('blackbox');
    var buttonNewGame = document.getElementById('buttonNewGame');
    var buttonScoreGame = document.getElementById('buttonScoreGame');
    var inputGridSize = document.getElementById('inputGridSize');
    var inputMarbles = document.getElementById('inputMarbles');

    blackboxDiv.addEventListener('click', function(event) {
      var clickedElement = event.target;
      if (clickedElement.className.includes('cell')) {
        var row = parseInt(clickedElement.dataset.row);
        var column = parseInt(clickedElement.dataset.column);
        var upperGridBound = blackbox.gridSize + 1;
        var DIR = BLACKBOX.VECTOR.DIRECTION;
        var direction = DIR.NONE;
        if (row === 0) {
          direction = DIR.DOWN;
        } else if (row === upperGridBound) {
          direction = DIR.UP;
        } else if (column === 0) {
          direction = DIR.RIGHT;
        } else if (column === upperGridBound) {
          direction = DIR.LEFT;
        }
        blackbox.shootRay(new BLACKBOX.Vector(row, column, direction));
        view.renderGridHTML();
      }
    });

    buttonNewGame.addEventListener('click', function(event) {
      var gridSize = parseInt(document.getElementById('inputGridSize').value);
      var numberOfMarbles = parseInt(document.getElementById('inputMarbles').value);
      view.onClickNewGame(gridSize, numberOfMarbles);
      view.renderGridConsole();
      view.renderGridHTML();
      document.getElementById('labelScore').innerHTML = '';
    });

    buttonScoreGame.addEventListener('click', function(event) {
      var score = blackbox.scoreGame();
      document.getElementById('labelScore').innerHTML = score;
      blackbox.gameHasFinished = true;
      view.renderGridConsole();
      view.renderGridHTML();
    });

    inputGridSize.addEventListener('focusout', function(event) {
      var gridSize = parseInt(event.currentTarget.value);
      if (gridSize < 6) {
        event.currentTarget.value = 6;
      } else if (gridSize > 16) {
        event.currentTarget.value = 16;
      } else if (isNaN(gridSize)) {
        event.currentTarget.value = 8;
      }
    });

    inputMarbles.addEventListener('focusout', function(event) {
      var gridSize = parseInt(document.getElementById('inputGridSize').value);
      var numberOfMarbles = parseInt(event.currentTarget.value);
      if (numberOfMarbles < 4) {
        event.currentTarget.value = 4;
      } else if (numberOfMarbles > 16) {
        event.currentTarget.value = 16;
      } else if (isNaN(numberOfMarbles)) {
        event.currentTarget.value = gridSize - 4;
      }
    });

  };

  // Export to root (window in browser)
  if (typeof define === 'function' && define.amd) {
    // requireJS
    //define(VECTOR);
  } else if (typeof exports === 'object') {
    // Node.js
    module.exports.BlackBoxView = View;
  } else {
    // in the browser
    root = root || {};
    root.BLACKBOX = root.BLACKBOX || {};
    root.BLACKBOX.View = View;
  }

})(this, this.BLACKBOX);
