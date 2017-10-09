debugger;
var model = new BlackBoxModel();
var view = new BlackBoxView();

var BlackBoxController = function BlackBoxController(model /* BlackBoxModel */, view /* BlackBoxView */) {
  this.model = model;
  this.view = view;
};

BlackBoxController.prototype.initialise = function initialise() {
  this.view.onClickNewGame = this.onClickNewGame.bind(this);
};

BlackBoxController.prototype.onClickNewGame = function onClickNewGame(gridSize = 8, numberOfMarbles = 4) {
  // todo: render view(s)
  return this.model.newGame(gridSize, numberOfMarbles);
};

controller = new BlackBoxController(model, view);
controller.initialise();
