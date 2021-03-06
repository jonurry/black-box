!(function(root, undefined) {
  'use strict';

  const BLACKBOX = root.BLACKBOX;
  var intervalID;

  // the following code is adapted from Jake Archibald's article on animating SVG paths
  // https://jakearchibald.com/2013/animated-line-drawing-svg/
  // begin: SVG Animate
  var supportsInlineSvg = (function() {
    var div = document.createElement('div');
    div.innerHTML = '<svg/>';
    return (
      (div.firstChild && div.firstChild.namespaceURI) ==
      'http://www.w3.org/2000/svg'
    );
  })();
  document.documentElement.className += supportsInlineSvg ? ' inline-svg' : '';

  function animateAllRays(draw) {
    if (!supportsInlineSvg) return;

    var begin;
    var durations;
    var interval;
    var paths;
    var svg;

    svg = document.getElementById('svg');
    if (svg !== null) {
      paths = toArray(svg.querySelectorAll('path'));
      if (paths.length > 0) {
        durations = paths.map(function(path) {
          var length = path.getTotalLength();
          path.style.strokeDasharray = length + ' ' + length;
          path.style.strokeDashoffset = length;
          path.style.visibility = 'visible';
          return Math.pow(length, 0.5) * 0.03;
        });

        // triggering a reflow so styles are calculated in their
        // start position, so they animate from here
        begin = 0;
        paths[0].getBoundingClientRect();

        if (draw) {
          paths.forEach(function(path, i) {
            path.style.transition = path.style.WebkitTransition =
              'stroke-dashoffset ' +
              durations[i] +
              's ' +
              begin +
              's ease-in-out';
            path.style.strokeDashoffset = '0';
            begin += durations[i] + 0.1;
          });
        }
      }
    }
    interval = durations.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0.1 * durations.length + 5
    );
    intervalID = setTimeout(animateAllRays, interval * 1000, !draw);
  }
  // end: SVG Animate

  function createSVGPath(shot, gridSize) {
    var pathCount = shot.path.length;
    var startVector;
    var currentVector;
    var nextVector;
    var path = [];
    var cellWidth;
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
        if (
          currentVector.direction.rowIncrement === 1 &&
          nextVector.direction.rowIncrement === 1
        ) {
          // ray moves down one cell relative to current position "v 1-cell"
          path.push('v');
          path.push(cellWidth);
        } else if (
          currentVector.direction.rowIncrement === -1 &&
          nextVector.direction.rowIncrement === -1
        ) {
          // ray moves up one cell relative to current position "v -(1-cell)"
          path.push('v');
          path.push(-cellWidth);
        } else if (
          currentVector.direction.columnIncrement === 1 &&
          nextVector.direction.columnIncrement === 1
        ) {
          // ray moves right one cell relative to current position "h 1-cell"
          path.push('h');
          path.push(cellWidth);
        } else if (
          currentVector.direction.columnIncrement === -1 &&
          nextVector.direction.columnIncrement === -1
        ) {
          // ray moves left one cell relative to current position "h -(1-cell)"
          path.push('h');
          path.push(-cellWidth);
        } else if (
          currentVector.direction.columnIncrement === -1 &&
          nextVector.direction.rowIncrement === 1
        ) {
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
        } else if (
          currentVector.direction.rowIncrement === 1 &&
          nextVector.direction.columnIncrement === 1
        ) {
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
        } else if (
          currentVector.direction.columnIncrement === 1 &&
          nextVector.direction.rowIncrement === -1
        ) {
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
        } else if (
          currentVector.direction.rowIncrement === -1 &&
          nextVector.direction.columnIncrement === -1
        ) {
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
        } else if (
          currentVector.direction.columnIncrement === 1 &&
          nextVector.direction.rowIncrement === 1
        ) {
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
        } else if (
          currentVector.direction.rowIncrement === 1 &&
          nextVector.direction.columnIncrement === -1
        ) {
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
        } else if (
          currentVector.direction.columnIncrement === -1 &&
          nextVector.direction.rowIncrement === -1
        ) {
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
        } else if (
          currentVector.direction.rowIncrement === -1 &&
          nextVector.direction.columnIncrement === 1
        ) {
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
  }

  function renderSVGPath(svgPath, outcome, cssClass, visible = true) {
    var OUTCOME = BLACKBOX.SHOOT_RAY_OUTCOME;
    var svgElement;
    var pathElement;
    var svgRay;
    svgElement = document.getElementsByTagName('svg')[0];
    pathElement = document.createElement('path');
    pathElement.setAttribute('d', svgPath);
    if (visible) {
      pathElement.style.visibility = 'visible';
    } else {
      pathElement.style.visibility = 'hidden';
    }
    if (cssClass !== '') {
      pathElement.setAttribute('class', cssClass);
    }
    switch (outcome) {
      case OUTCOME.ABSORBED:
      case OUTCOME.REFLECTED:
        if (svgElement.innerHTML.search(pathElement.outerHTML) === -1) {
          svgElement.innerHTML += pathElement.outerHTML;
        } else {
          svgElement.innerHTML = svgElement.innerHTML.replace(
            pathElement.outerHTML,
            ''
          );
        }
        break;
      case OUTCOME.PROPOGATED:
        svgRay = svgElement.querySelectorAll('path.' + cssClass)[0];
        if (svgRay === undefined) {
          svgElement.innerHTML += pathElement.outerHTML;
        } else {
          svgRay.remove();
        }
        break;
    }
  }

  function resizeSVG() {
    var blackboxDiv;
    var gridSize;
    var left;
    var margin;
    var svg;
    var top;
    var width;

    svg = document.getElementById('svg');
    if (svg !== null) {
      // resize the svg element
      blackboxDiv = document.getElementById('blackbox');
      gridSize = parseInt(document.getElementById('inputGridSize').value);
      margin = blackboxDiv.offsetWidth / (gridSize + 2);
      width = blackboxDiv.offsetWidth - 2 * margin;
      top = blackboxDiv.offsetTop + margin;
      left = margin + blackboxDiv.offsetLeft;
      svg.style.cssText =
        'width: ' + width + 'px; top: ' + top + 'px; left: ' + left + 'px;';
    }
  }

  function toArray(arr) {
    return Array.prototype.slice.call(arr);
  }

  function View() {
    this.view = this;
    this.validationHandlers();
    this.bind('resizeBlackBox');
  }

  View.prototype.bind = function(event, handler) {
    var blackboxDiv;
    var buttonNewGame;
    var buttonScoreGame;
    var clickedElement;
    var column;
    var gridSize;
    var numberOfMarbles;
    var animateRays;
    var row;
    var score;

    if (event === 'animateRays') {
      animateRays = document.getElementById('radioAnimateRaysYes');
      animateRays.addEventListener('change', function() {
        handler();
      });
      animateRays = document.getElementById('radioAnimateRaysNo');
      animateRays.addEventListener('change', function() {
        handler();
      });
    } else if (event === 'newGame') {
      buttonNewGame = document.getElementById('buttonNewGame');
      buttonNewGame.addEventListener('click', function() {
        gridSize = parseInt(document.getElementById('inputGridSize').value);
        numberOfMarbles = parseInt(
          document.getElementById('inputMarbles').value
        );
        handler(gridSize, numberOfMarbles);
        document.getElementById('score').style.display = 'none';
        document.getElementById('animateRays').style.display = 'none';
      });
    } else if (event === 'scoreGame') {
      buttonScoreGame = document.getElementById('buttonScoreGame');
      buttonScoreGame.addEventListener('click', function() {
        score = handler();
        document.getElementById('scoreValue').innerHTML = score;
        document.getElementById('score').style.display = 'block';
        document.getElementById('animateRays').style.display = 'block';
      });
    } else if (event === 'shootRay') {
      blackboxDiv = document.getElementById('blackbox');
      blackboxDiv.addEventListener('click', function(event) {
        clickedElement = event.target;
        if (clickedElement.nodeName !== 'svg') {
          row = parseInt(clickedElement.dataset.pos.split(',')[0]);
          column = parseInt(clickedElement.dataset.pos.split(',')[1]);
          handler(new BLACKBOX.Vector(row, column));
        }
      });
    } else if (event === 'resizeBlackBox') {
      window.addEventListener('resize', resizeSVG);
    }
  };

  View.prototype.renderAndAnimateAllRays = function(allShots, gridSize) {
    var OUTCOME = BLACKBOX.SHOOT_RAY_OUTCOME;
    var animateRays;
    var paths;
    var svg;
    var svgPath;
    animateRays =
      document.querySelector('input[name="switch"]:checked').value === 'on'
        ? true
        : false;
    if (animateRays) {
      svg = document.getElementById('svg');
      if (svg !== null) {
        paths = toArray(svg.querySelectorAll('path'));
        if (paths.length === 0) {
          allShots.forEach(function(shot) {
            var cssClass;
            switch (shot.outcome) {
              case OUTCOME.ABSORBED:
                cssClass = 'hit';
                break;
              case OUTCOME.MARBLE_PLACED:
              case OUTCOME.MARBLE_REMOVED:
                cssClass = 'guess';
                break;
              case OUTCOME.PROPOGATED:
                cssClass = 'ray-' + shot.rayNumber;
                break;
              case OUTCOME.REFLECTED:
                cssClass = 'reflect';
                break;
            }
            svgPath = createSVGPath(shot, gridSize);
            if (svgPath.length > 0) {
              renderSVGPath(svgPath, shot.outcome, cssClass, false);
            }
          });
        }
      }
      animateAllRays(true);
    } else {
      clearTimeout(intervalID);
    }
    return animateRays;
  };

  View.prototype.renderGridConsole = function(grid) {
    var gridLine;

    console.log();
    for (var i = 0; i < grid.length; i++) {
      gridLine = '';
      for (var j = 0; j < grid.length; j++) {
        gridLine += String(grid[i][j]) + '\t';
      }
      console.log(gridLine + '\t' + String(i));
    }
  };

  View.prototype.renderGrid = function(
    grid,
    gridSize,
    gameHasFinished,
    allMarblesPlaced,
    guesses,
    marbles
  ) {
    var blackboxDiv = document.getElementById('blackbox');
    var buttonScoreGame;
    var cellDiv;
    var classes;
    var upperGridBound = gridSize + 1;

    blackboxDiv.innerHTML = '';
    blackboxDiv.className = 'blackbox grid grid-size-' + gridSize;
    for (var row = 0; row <= upperGridBound; row++) {
      for (var column = 0; column <= upperGridBound; column++) {
        cellDiv = document.createElement('div');
        classes = ['cell'];
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
            if (
              row === 0 ||
              row === upperGridBound ||
              column === 0 ||
              column === upperGridBound
            ) {
              classes.push('ray-' + grid[row][column]);
            }
        }
        if (gameHasFinished) {
          // render marbles
          marbles.forEach(function(marble) {
            if (
              parseInt(marble.row) === row &&
              parseInt(marble.column) === column
            ) {
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
      blackboxDiv.innerHTML += '<svg id="svg" viewBox="0 0 100 100"></svg>';
      window.setTimeout(resizeSVG, 0);
    }
    // enable/disable score game button
    buttonScoreGame = document.getElementById('buttonScoreGame');
    buttonScoreGame.disabled = !(allMarblesPlaced && !gameHasFinished);
  };

  View.prototype.renderShot = function(
    shot,
    gridSize,
    gameHasFinished,
    allMarblesPlaced
  ) {
    var OUTCOME = BLACKBOX.SHOOT_RAY_OUTCOME;
    var buttonScoreGame;
    var cssClass = '';
    var endElement;
    var endPos;
    var startElement;
    var startPos;
    var svgPath;

    startPos = shot.path[0].position.row + ',' + shot.path[0].position.column;
    endPos =
      shot.path[shot.path.length - 1].position.row +
      ',' +
      shot.path[shot.path.length - 1].position.column;
    startElement = document.querySelectorAll(
      "[data-pos='" + startPos + "']"
    )[0];
    endElement = document.querySelectorAll("[data-pos='" + endPos + "']")[0];
    buttonScoreGame = document.getElementById('buttonScoreGame');

    switch (shot.outcome) {
      case OUTCOME.ABSORBED:
        cssClass = 'hit';
        break;
      case OUTCOME.MARBLE_PLACED:
      case OUTCOME.MARBLE_REMOVED:
        cssClass = 'guess';
        break;
      case OUTCOME.PROPOGATED:
        cssClass = 'ray-' + shot.rayNumber;
        break;
      case OUTCOME.REFLECTED:
        cssClass = 'reflect';
        break;
    }

    // if gameHasFinished then trace path of ray
    if (gameHasFinished) {
      svgPath = createSVGPath(shot, gridSize);
      if (svgPath.length > 0) {
        renderSVGPath(svgPath, shot.outcome, cssClass);
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
})(this || Window);
