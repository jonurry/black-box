var blackbox = new BlackBox();
blackbox.createGrid();
blackbox.initialiseGrid();
blackbox.placeMarblesRandomlyOnGrid();
var view = new View(blackbox);
view.renderGridConsole();
view.renderGridHTML();
