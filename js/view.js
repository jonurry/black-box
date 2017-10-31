(function(root, BLACKBOX, undefined) {

  function createSVGPath(shot, gridSize) {

    var pathCount = shot.path.length;
    var startVector;
    var currentVector;
    var nextVector;
    var path = [];
    var cellWidth
    var radius;
    var row, col;

    if (pathCount > 2) {
      cellWidth = 100 / gridSize;
      radius = cellWidth / 2;
      startVector = shot.path[0];
      row = startVector.position.row;
      col = startVector.position.column;
      // move to start position of ray ("M x y")
      path.push('M');
      if (col === 0) {
        path.push(0);
      } else if (col === gridSize + 1) {
        path.push(100);
      } else {
        path.push((col - 0.5) * cellWidth);
      }
      if (row === 0) {
        path.push(0);
      } else if (row === gridSize + 1) {
        path.push(100);
      } else {
        path.push((row - 0.5) * cellWidth);
      }
      for (var i = 1; i < shot.path.length - 1; i++) {
        currentVector = shot.path[i];
        nextVector = shot.path[i + 1];
        if (currentVector.direction.rowIncrement === 1 && nextVector.direction.rowIncrement === 1) {
          // ray moves down one cell relative to current position "v 1-cell"
          path.push('v');
          path.push(cellWidth);
        } else if (currentVector.direction.rowIncrement === -1 && nextVector.direction.rowIncrement === -1) {
          // ray moves up one cell relative to current position "v -(1-cell)"
          path.push('v');
          path.push(-cellWidth);
        } else if (currentVector.direction.columnIncrement === 1 && nextVector.direction.columnIncrement === 1) {
          // ray moves right one cell relative to current position "h 1-cell"
          path.push('h');
          path.push(cellWidth);
        } else if (currentVector.direction.columnIncrement === -1 && nextVector.direction.columnIncrement === -1) {
          // ray moves left one cell relative to current position "h -(1-cell)"
          path.push('h');
          path.push(-cellWidth);
        } else if (currentVector.direction.columnIncrement === -1 && nextVector.direction.rowIncrement === 1) {
          // ray deflected from travelling left to travelling down
          // ray arcs anti-clockwise to left and down relative to current position
          // "a radius radius, 0 0 0, -radius radius"
          path.push('a');
          path.push(radius);
          path.push(radius);
          path.push(0);
          path.push(0);
          path.push(0);
          path.push(-radius);
          path.push(radius);
        } else if (currentVector.direction.rowIncrement === 1 && nextVector.direction.columnIncrement === 1) {
          // ray deflected from travelling down to travelling right
          // ray arcs anti-clockwise from down to right relative to current position
          // "a radius radius, 0 0 0, radius radius"
          path.push('a');
          path.push(radius);
          path.push(radius);
          path.push(0);
          path.push(0);
          path.push(0);
          path.push(radius);
          path.push(radius);
        } else if (currentVector.direction.columnIncrement === 1 && nextVector.direction.rowIncrement === -1) {
          // ray deflected from travelling right to travelling up
          // ray arcs anti-clockwise to right and up relative to current position
          // "a radius radius, 0 0 0, radius -radius"
          path.push('a');
          path.push(radius);
          path.push(radius);
          path.push(0);
          path.push(0);
          path.push(0);
          path.push(radius);
          path.push(-radius);
        } else if (currentVector.direction.rowIncrement === -1 && nextVector.direction.columnIncrement === -1) {
          // ray deflected from travelling up to travelling left
          // ray arcs anti-clockwise to left and up relative to current position
          // "a radius radius, 0 0 0, -radius -radius"
          path.push('a');
          path.push(radius);
          path.push(radius);
          path.push(0);
          path.push(0);
          path.push(0);
          path.push(-radius);
          path.push(-radius);
        } else if (currentVector.direction.columnIncrement === 1 && nextVector.direction.rowIncrement === 1) {
          // ray deflected from travelling right to travelling down
          // ray arcs clockwise to right and down relative to current position
          // "a radius radius, 0 0 1, radius radius"
          path.push('a');
          path.push(radius);
          path.push(radius);
          path.push(0);
          path.push(0);
          path.push(1);
          path.push(radius);
          path.push(radius);
        } else if (currentVector.direction.rowIncrement === 1 && nextVector.direction.columnIncrement === -1) {
          // ray deflected from travelling down to travelling left
          // ray arcs clockwise from down to left relative to current position
          // "a radius radius, 0 0 1, -radius radius"
          path.push('a');
          path.push(radius);
          path.push(radius);
          path.push(0);
          path.push(0);
          path.push(1);
          path.push(-radius);
          path.push(radius);
        } else if (currentVector.direction.columnIncrement === -1 && nextVector.direction.rowIncrement === -1) {
          // ray deflected from travelling left to travelling up
          // ray arcs clockwise to left and up relative to current position
          // "a radius radius, 0 0 1, -radius -radius"
          path.push('a');
          path.push(radius);
          path.push(radius);
          path.push(0);
          path.push(0);
          path.push(1);
          path.push(-radius);
          path.push(-radius);
        } else if (currentVector.direction.rowIncrement === -1 && nextVector.direction.columnIncrement === 1) {
          // ray deflected from travelling up to travelling right
          // ray arcs clockwise to right and up relative to current position
          // "a radius radius, 0 0 1, radius -radius"
          path.push('a');
          path.push(radius);
          path.push(radius);
          path.push(0);
          path.push(0);
          path.push(1);
          path.push(radius);
          path.push(-radius);
        }
      }
    }

    return path.join(' ');

  };

  function View() {
    this.view = this;
    this.validationHandlers();
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
        if (clickedElement.nodeName !== 'svg') {
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

  View.prototype.renderGrid = function(grid, gridSize, gameHasFinished, allMarblesPlaced, guesses, marbles) {
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
        if (gameHasFinished) {
          // render marbles
          marbles.forEach(function(marble) {
            if (parseInt(marble.row) === row && parseInt(marble.column) === column) {
              if (grid[row][column] === 0) {
                classes.push('guess');
              }
            }
          });
        }
        // set row and column data
        cellDiv.dataset.pos = row + ',' + column;
        cellDiv.className = classes.join(' ');
        blackboxDiv.appendChild(cellDiv);
      }
    }
    if (gameHasFinished) {
      // overlay the inner grid with an SVG element so that we can draw
      // the ray's path on top of the grid.
      var width, margin;
      width = gridSize / (gridSize + 2);
      margin = (1 - width) / 2;
      width *= 100;
      margin *=100;
      blackboxDiv.innerHTML += '<svg viewBox="0 0 100 100" style="width: ' + width + '%; top: ' + margin + '%; left: ' + margin + '%;"></svg>'
    }
    // enable/disable score game button
    var buttonScoreGame = document.getElementById('buttonScoreGame');
    buttonScoreGame.disabled = !(allMarblesPlaced && !gameHasFinished);
  };

  View.prototype.renderShot = function(shot, gridSize, gameHasFinished, allMarblesPlaced) {
    var OUTCOME = BLACKBOX.SHOOT_RAY_OUTCOME;
    var buttonScoreGame = document.getElementById('buttonScoreGame');
    var startPos = shot.path[0].position.row + ',' + shot.path[0].position.column;
    var endPos = shot.path[shot.path.length - 1].position.row + ',' + shot.path[shot.path.length - 1].position.column;
    var startElement = document.querySelectorAll("[data-pos='" + startPos + "']")[0];
    var endElement = document.querySelectorAll("[data-pos='" + endPos + "']")[0];
    var cssClass = '';

    switch (shot.outcome) {
      case OUTCOME.ABSORBED:
        cssClass = 'hit'
        break;
      case OUTCOME.MARBLE_PLACED:
      case OUTCOME.MARBLE_REMOVED:
        cssClass = 'guess'
        break;
      case OUTCOME.PROPOGATED:
        cssClass = 'ray-' + shot.rayNumber;
        break;
      case OUTCOME.REFLECTED:
        cssClass = 'reflect'
        break;
    }

    // if gameHasFinished then trace path of ray
    if (gameHasFinished) {
      var svgElement;
      var svgPath;
      var pathElement;
      var svgRay;
      svgPath = createSVGPath(shot, gridSize);
      if (svgPath.length > 0) {
        svgElement = document.getElementsByTagName('svg')[0];
        pathElement = document.createElement('path');
        pathElement.setAttribute('d', svgPath);
        if (cssClass !== '') {
          pathElement.setAttribute('class', cssClass);
        }
        switch (shot.outcome) {
          case OUTCOME.ABSORBED:
          case OUTCOME.REFLECTED:
            if (svgElement.innerHTML.search(pathElement.outerHTML) === -1) {
              svgElement.innerHTML += pathElement.outerHTML;
            } else {
              svgElement.innerHTML = svgElement.innerHTML.replace(pathElement.outerHTML, '')
            }
            break;
          case OUTCOME.PROPOGATED:
            svgRay = svgElement.getElementsByClassName(cssClass);
            if (svgRay.length === 0) {
              svgElement.innerHTML += pathElement.outerHTML;
            } else {
              svgRay[0].remove();
            }
            break;
        }
      }
    } else {
      // game has not finished
      cssClass = ' ' + cssClass;
      switch (shot.outcome) {
        case OUTCOME.ABSORBED:
        case OUTCOME.MARBLE_PLACED:
        case OUTCOME.PROPOGATED:
        case OUTCOME.REFLECTED:
          startElement.className += cssClass;
          if (shot.outcome === OUTCOME.PROPOGATED) {
            endElement.className += cssClass;
          }
          break;
        case OUTCOME.MARBLE_REMOVED:
          startElement.className = startElement.className.replace(cssClass, '');
          break;
      }
    }

    // enable/disable score game button
    buttonScoreGame.disabled = !(allMarblesPlaced && !gameHasFinished);
  };

  View.prototype.validationHandlers = function() {

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
