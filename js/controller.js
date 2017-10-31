(function(root, BLACKBOX) {

  function BlackBoxController(model, view) {

    var self = this;
    self.model = model;
    self.view = view;

    self.view.bind('newGame', function (gridSize = 8, numberOfMarbles = 4) {
			self.onClickNewGame(gridSize, numberOfMarbles);
		});

    self.view.bind('scoreGame', function () {
			return self.onClickScoreGame();
		});

    self.view.bind('shootRay', function (ray) {
			return self.onClickShootRay(ray);
		});

  };

  BlackBoxController.prototype.onClickNewGame = function(gridSize = 8, numberOfMarbles = 4) {
    this.model.newGame(gridSize, numberOfMarbles);
    this.renderViews();
  };

  BlackBoxController.prototype.onClickScoreGame = function() {
    var score = this.model.scoreGame();
    this.renderViews();
    return score;
  };

  BlackBoxController.prototype.onClickShootRay = function(ray) {
    var outcome = this.model.shootRay(ray);
    this.view.renderShot(outcome, this.model.gridSize, this.model.gameHasFinished, this.model.allMarblesPlaced());
  };

  BlackBoxController.prototype.renderViews = function() {
    var model = this.model;
    var gridCopy = JSON.parse(JSON.stringify(model.grid));
    var guessesCopy = JSON.parse(JSON.stringify(model.guesses));
    var marblesCopy = JSON.parse(JSON.stringify(model.marbles));
    this.view.renderGridConsole(gridCopy);
    this.view.renderGrid(gridCopy, model.gridSize, model.gameHasFinished, model.allMarblesPlaced(), guessesCopy, marblesCopy);
  }

  // Export to root (window in browser)
  if (typeof define === 'function' && define.amd) {
    // requireJS
    //define(VECTOR);
  } else if (typeof exports === 'object') {
    // Node.js
    module.exports.BlackBoxController = BlackBoxController;
  } else {
    // in the browser
    root = root || {};
    root.BLACKBOX = root.BLACKBOX || {};
    root.BLACKBOX.Controller = BlackBoxController;
  }

})(this, this.BLACKBOX);
