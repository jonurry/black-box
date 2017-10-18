(function(root, BLACKBOX, undefined) {

  function View() {
    this.view = this;
    this.setupEventHandlers();
  };

  View.prototype.bind = function (event, handler) {

		var self = this,
        blackboxDiv,
        buttonNewGame,
        buttonScoreGame,
        gridSize,
        numberOfMarbles;

    if (event === 'newGame') {
      buttonNewGame = document.getElementById('buttonNewGame');
      buttonNewGame.addEventListener('click', function(event) {
        gridSize = parseInt(document.getElementById('inputGridSize').value);
        numberOfMarbles = parseInt(document.getElementById('inputMarbles').value);
        handler(gridSize, numberOfMarbles);
        document.getElementById('labelScore').innerHTML = '';
      });
    } else if (event === 'scoreGame') {
      buttonScoreGame = document.getElementById('buttonScoreGame');
      buttonScoreGame.addEventListener('click', function(event) {
        var score = handler();
        document.getElementById('labelScore').innerHTML = score;
      });
    } else if (event === 'shootRay') {
      blackboxDiv = document.getElementById('blackbox');
      blackboxDiv.addEventListener('click', function(event) {
        var clickedElement = event.target;
        if (clickedElement.className.includes('cell')) {
          var row = parseInt(clickedElement.dataset.pos.split(',')[0]);
          var column = parseInt(clickedElement.dataset.pos.split(',')[1]);
          handler(new BLACKBOX.Vector(row, column));
        }
      });
    }

	};

  View.prototype.renderGridConsole = function(grid) {
    var gridLine;
    console.log();
    for (i = 0; i < grid.length; i++) {
      gridLine = '';
      for (j = 0; j < grid.length; j++) {
        gridLine += String(grid[i][j]) + '\t';
      }
      console.log(gridLine + '\t' + String(i));
    }
  };

  View.prototype.renderGrid = function(grid, gridSize, gameHasFinished, allMarblesPlaced, guesses) {
    var blackboxDiv = document.getElementById('blackbox');
    blackboxDiv.innerHTML = '';
    var upperGridBound = gridSize + 1;
    for (var row = 0; row <= upperGridBound; row++) {
      for (var column = 0; column <= upperGridBound; column++) {
        var cellDiv = document.createElement('div');
        var classes = [
          'cell', 'cell-' + (upperGridBound + 1)
        ];
        // render ray outcomes
        switch (grid[row][column]) {
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
              classes.push('ray-' + grid[row][column]);
            }
        }
        // set row and column data
        cellDiv.dataset.pos = row + ',' + column;
        // render guesses
        if (!gameHasFinished) {
          guesses.forEach(function(guess) {
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
    buttonScoreGame.disabled = !(allMarblesPlaced && !gameHasFinished);
  };

  View.prototype.renderShot = function(shot, gameHasFinished, allMarblesPlaced) {
    var OUTCOME = BLACKBOX.SHOOT_RAY_OUTCOME;
    var blackboxDiv = document.getElementById('blackbox');
    var buttonScoreGame = document.getElementById('buttonScoreGame');
    var startVector = JSON.parse(shot.path[0]);
    var endVector = JSON.parse(shot.path[shot.path.length - 1]);
    var startPos = startVector.position.row + ',' + startVector.position.column;
    var endPos = endVector.position.row + ',' + endVector.position.column;
    var startElement = document.querySelectorAll("[data-pos='" + startPos + "']")[0];
    var endElement = document.querySelectorAll("[data-pos='" + endPos + "']")[0];
    switch (shot.outcome) {
      case OUTCOME.ABSORBED:
        startElement.className += ' hit';
        break;
      case OUTCOME.MARBLE_PLACED:
        startElement.className += ' guess';
        break;
      case OUTCOME.MARBLE_REMOVED:
        startElement.className = startElement.className.replace(' guess', '');
        break;
      case OUTCOME.PROPOGATED:
        startElement.className += ' ray-' + shot.numberOfRays;
        endElement.className += ' ray-' + shot.numberOfRays;
        break;
      case OUTCOME.REFLECTED:
        startElement.className += ' reflect';
        break;
    }
    // enable/disable score game button
    buttonScoreGame.disabled = !(allMarblesPlaced && !gameHasFinished);
  };

  View.prototype.setupEventHandlers = function() {

    var view = this.view;
    var inputGridSize = document.getElementById('inputGridSize');
    var inputMarbles = document.getElementById('inputMarbles');

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
