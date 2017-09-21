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

test('It should place the correct number of marbles on the grid.', () => {
  var marbleCounter = 0;
  var blackbox1 = new BlackBox(8, 4);
  blackbox1.createGrid();
  blackbox1.initialiseGrid();
  blackbox1.placeMarblesRandomlyOnGrid();
  for (var i = 1; i <= blackbox1.gridSize; i++) {
    for (var j = 1; j <= blackbox1.gridSize; j++) {
      if (blackbox1.grid[i][j] === 1) {
        marbleCounter += 1;
      }
    }
  }
  expect(marbleCounter).toBe(4);
});

test('It should not place marbles in the gutters.', () => {
  var blackbox1 = new BlackBox(8, 4);
  blackbox1.createGrid();
  blackbox1.initialiseGrid();
  blackbox1.placeMarblesRandomlyOnGrid();
  // expect gutters to not contain a marble
  expect(blackbox1.grid[0]).not.toEqual(expect.arrayContaining([1]));
  expect(blackbox1.grid[9]).not.toEqual(expect.arrayContaining([1]));
  for (var i = 0; i < blackbox1.grid.length; i++) {
    expect(blackbox1.grid[0][i]).not.toBe(1);
    expect(blackbox1.grid[9][i]).not.toBe(1);
  }
});

test('It should place marbles randomly on the grid.', () => {
  var numberOfMatchedMarbles = 0;
  var blackbox1 = new BlackBox(8, 4);
  blackbox1.createGrid();
  blackbox1.initialiseGrid();
  blackbox1.placeMarblesRandomlyOnGrid();
  // create a second black box and expect its marbles not to be in the same position as the first black box
  var blackbox2 = new BlackBox(8, 4);
  blackbox2.createGrid();
  blackbox2.initialiseGrid();
  blackbox2.placeMarblesRandomlyOnGrid();
  for (var i = 1; i <= blackbox1.gridSize; i++) {
    for (var j = 1; j <= blackbox1.gridSize; j++) {
      if (blackbox1.grid[i][j] === 1 && blackbox2.grid[i][j]) {
        numberOfMatchedMarbles += 1;
      }
    }
  }
  expect(numberOfMatchedMarbles).not.toBe(4);
});

test.skip('It should set the current ray position by row and column number', () => {
  var pos = [2, 4];
  blackbox.setRayPosition(pos);
  expect(blackbox.rayPosition).toBe(pos);
});
