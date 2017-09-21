// Load the javascript files to be tested
var fs = require('fs');
eval(fs.readFileSync('./js/utility.js').toString());
eval(fs.readFileSync('./js/point.js').toString());
eval(fs.readFileSync('./js/blackbox.js').toString());

/*
set current position
get current position
set current direction
get current direction
test movement up, down, left, right - move next
do nothing if corners selected
check for hit at current position
check for change in direction i.e. proximity of marbles
check rim shot outcome for known grid (shot position, get outcome)
only accept shots from side of grid
shots within grid are treated as guesses
guesses are toggled i.e. if guess already made then guess is removed. if guess is new then guess is made.
 */

test('It should create a new blackbox with default dimensions and marbles.', () => {
  var blackbox = new BlackBox();
  expect(blackbox.gridSize).toBe(8);
  expect(blackbox.numberOfMarbles).toBe(4);
});

test('It should create a new blackbox with specified dimensions and marbles.', () => {
  var blackbox = new BlackBox(16, 10);
  expect(blackbox.gridSize).toBe(16);
  expect(blackbox.numberOfMarbles).toBe(10);
});

test('It should create the grid.', () => {
  var blackbox = new BlackBox(8, 4);
  blackbox.createGrid();
  expect(blackbox.grid).toHaveLength(10);
  for (var i = 0; i < blackbox.grid.length; i++) {
    expect(blackbox.grid[i]).toHaveLength(10);
  }
});

test('It should initialise the grid by populating the grid and gutters with zeros.', () => {
  var blackbox = new BlackBox(8, 4);
  blackbox.createGrid();
  blackbox.initialiseGrid();
  for (var i = 0; i < blackbox.grid.length; i++) {
    for (var j = 0; j < blackbox.grid[i].length; j++) {
      expect(blackbox.grid[i][j]).toBe(0);
    }
  }
});

test.skip('It should set the current ray position by row and column number', () => {
  var pos = [2, 4];
  blackbox.setRayPosition(pos);
  expect(blackbox.rayPosition).toBe(pos);
});
