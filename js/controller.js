(function(root, BLACKBOX) {

  function BlackBoxController(model, view) {
    this.model = model;
    this.view = view;
  };

  BlackBoxController.prototype.initialise = function initialise() {
    this.view.onClickNewGame = this.onClickNewGame.bind(this);
    this.view.renderGridHTML();
  };

  BlackBoxController.prototype.onClickNewGame = function onClickNewGame(gridSize = 8, numberOfMarbles = 4) {
    // todo: render view(s)
    this.model.newGame(gridSize, numberOfMarbles);
  };

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
