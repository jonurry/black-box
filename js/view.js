function BlackBoxView(blackbox) {
  this.blackbox = blackbox;
  this.view = this;
  this.onClickNewGame = null;
  this.setupEventHandlers();
};

BlackBoxView.prototype.renderGridConsole = function() {
  var gridLine;
  for (i = 0; i < blackbox.grid.length; i++) {
    gridLine = '';
    for (j = 0; j < blackbox.grid.length; j++) {
      gridLine += String(blackbox.grid[i][j]) + '\t';
    }
    console.log(gridLine + '\t' + String(i));
  }
};

BlackBoxView.prototype.renderGridHTML = function() {
  var blackboxDiv = document.getElementById('blackbox');
  blackboxDiv.innerHTML = '';
  var upperGridBound = blackbox.gridSize + 1;
  for (var row = 0; row <= upperGridBound; row++) {
    for (var column = 0; column <= upperGridBound; column++) {
      var cellDiv = document.createElement('div');
      var classes = [
        'cell', 'cell-' + (upperGridBound + 1)
      ];
      // render ray outcomes
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
      // set row and column data
      cellDiv.dataset.row = row;
      cellDiv.dataset.column = column;
      // render guesses
      if (!blackbox.gameHasFinished) {
        blackbox.guesses.forEach(function(guess) {
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
  buttonScoreGame.disabled = !(blackbox.allMarblesPlaced() && !blackbox.gameHasFinished);
};

BlackBoxView.prototype.setupEventHandlers = function() {
  var blackboxDiv = document.getElementById('blackbox');
  blackboxDiv.addEventListener('click', function(event) {
    var clickedElement = event.target;
    if (clickedElement.className.includes('cell')) {
      var row = parseInt(clickedElement.dataset.row);
      var column = parseInt(clickedElement.dataset.column);
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
    var gridSize = parseInt(document.getElementById('inputGridSize').value);
    var numberOfMarbles = parseInt(document.getElementById('inputMarbles').value);
    blackbox = view.onClickNewGame(gridSize, numberOfMarbles);
    view.renderGridConsole();
    view.renderGridHTML();
    document.getElementById('labelScore').innerHTML = '';
  });
  var buttonScoreGame = document.getElementById('buttonScoreGame');
  buttonScoreGame.addEventListener('click', function(event) {
    var score = blackbox.scoreGame();
    document.getElementById('labelScore').innerHTML = score;
    blackbox.gameHasFinished = true;
    view.renderGridConsole();
    view.renderGridHTML();
  });
  var inputGridSize = document.getElementById('inputGridSize');
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
  var inputMarbles = document.getElementById('inputMarbles');
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
