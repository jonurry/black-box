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

describe('It should create and initialise the Black Box.', () => {

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

  test('It should initialise the grid by populating the entire grid (incl. rim and corners) with zeros.', () => {
    var blackbox = new BlackBox(8, 4);
    blackbox.createGrid();
    blackbox.initialiseGrid();
    for (var i = 0; i < blackbox.grid.length; i++) {
      for (var j = 0; j < blackbox.grid[i].length; j++) {
        expect(blackbox.grid[i][j]).toBe(0);
      }
    }
  });

});

describe('It should place the marbles in valid locations.', () => {

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

  test('It should not place marbles on the rim.', () => {
    var blackbox1 = new BlackBox(8, 4);
    blackbox1.createGrid();
    blackbox1.initialiseGrid();
    blackbox1.placeMarblesRandomlyOnGrid();
    // expect rim to not contain a marble
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

});

describe('It should know the location type of a Point.', () => {
  test('It should know if a Point is the corner.', () => {
    var blackbox = new BlackBox(8, 4);
    blackbox.createGrid();
    // Check all 4 corner locations
    expect(blackbox.getLocationType(new Point(0, 0).getPosition())).toBe(locationType.CORNER);
    expect(blackbox.getLocationType(new Point(9, 0).getPosition())).toBe(locationType.CORNER);
    expect(blackbox.getLocationType(new Point(0, 9).getPosition())).toBe(locationType.CORNER);
    expect(blackbox.getLocationType(new Point(9, 9).getPosition())).toBe(locationType.CORNER);
  });

  test('It should know if a Point is on the rim.', () => {
    var blackbox = new BlackBox(8, 4);
    blackbox.createGrid();
    // Check rim on all 4 sides of the grid, lower bound, upper bound and centre
    // top row, far left, far right, centre
    expect(blackbox.getLocationType(new Point(0, 1).getPosition())).toBe(locationType.RIM);
    expect(blackbox.getLocationType(new Point(0, 8).getPosition())).toBe(locationType.RIM);
    expect(blackbox.getLocationType(new Point(0, 4).getPosition())).toBe(locationType.RIM);
    // bottom row, far left, far right, centre
    expect(blackbox.getLocationType(new Point(9, 1).getPosition())).toBe(locationType.RIM);
    expect(blackbox.getLocationType(new Point(9, 8).getPosition())).toBe(locationType.RIM);
    expect(blackbox.getLocationType(new Point(9, 4).getPosition())).toBe(locationType.RIM);
    // left side, top, bottom, centre
    expect(blackbox.getLocationType(new Point(1, 0).getPosition())).toBe(locationType.RIM);
    expect(blackbox.getLocationType(new Point(8, 0).getPosition())).toBe(locationType.RIM);
    expect(blackbox.getLocationType(new Point(4, 0).getPosition())).toBe(locationType.RIM);
    // right side, top, bottom, centre
    expect(blackbox.getLocationType(new Point(1, 9).getPosition())).toBe(locationType.RIM);
    expect(blackbox.getLocationType(new Point(8, 9).getPosition())).toBe(locationType.RIM);
    expect(blackbox.getLocationType(new Point(4, 9).getPosition())).toBe(locationType.RIM);
  });

  test('It should know if a Point is in the grid.', () => {
    var blackbox = new BlackBox(8, 4);
    blackbox.createGrid();
    // Check locations within the playable game grid
    // Test upper and lower bounds for rows and columns
    // Also test for locations near the centre of the grid
    expect(blackbox.getLocationType(new Point(1, 1).getPosition())).toBe(locationType.GRID);
    expect(blackbox.getLocationType(new Point(1, 8).getPosition())).toBe(locationType.GRID);
    expect(blackbox.getLocationType(new Point(8, 1).getPosition())).toBe(locationType.GRID);
    expect(blackbox.getLocationType(new Point(8, 8).getPosition())).toBe(locationType.GRID);
    expect(blackbox.getLocationType(new Point(3, 4).getPosition())).toBe(locationType.GRID);
    expect(blackbox.getLocationType(new Point(7, 2).getPosition())).toBe(locationType.GRID);
  });

  test('It should know if a Point is outside of the black box.', () => {
    var blackbox = new BlackBox(8, 4);
    blackbox.createGrid();
    // Check locations outside of the grid
    expect(blackbox.getLocationType(new Point(-1, 2).getPosition())).toBe(locationType.OUTSIDE);
    expect(blackbox.getLocationType(new Point(12, 5).getPosition())).toBe(locationType.OUTSIDE);
    expect(blackbox.getLocationType(new Point(3, -4).getPosition())).toBe(locationType.OUTSIDE);
    expect(blackbox.getLocationType(new Point(6, 11).getPosition())).toBe(locationType.OUTSIDE);
    expect(blackbox.getLocationType(new Point(-1, -1).getPosition())).toBe(locationType.OUTSIDE);
    expect(blackbox.getLocationType(new Point(10, 10).getPosition())).toBe(locationType.OUTSIDE);
  });
});

test.skip('It should set the current ray position by row and column number', () => {
  var pos = [2, 4];
  blackbox.setRayPosition(pos);
  expect(blackbox.rayPosition).toBe(pos);
});
