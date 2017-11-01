// TODO: Add some more tests

// Load the javascript files to be tested

//let fs = require('fs');
//eval(fs.readFileSync('./js/utility.js').toString());
//eval(fs.readFileSync('./js/vector.js').toString());
//eval(fs.readFileSync('./js/model.js').toString());

var vectorModule = require('../js/vector.js');
var Vector = vectorModule.Vector;
const VECTOR = vectorModule.VECTOR;

var modelModule = require('../js/model.js');
//var BLACKBOX = modelModule.BLACKBOX;
const SHOOT_RAY_OUTCOME = modelModule.SHOOT_RAY_OUTCOME;
var BlackBoxModel = modelModule.BlackBoxModel;
if (process.env.NODE_ENV === 'test') {
  var privateBlackBox = modelModule.BlackBoxModel._private;
}

describe('It should create and initialise the Black Box.', () => {

  test('It should create a new blackbox with default dimensions and marbles.', () => {
    var blackbox = new BlackBoxModel();
    expect(blackbox.gridSize).toBe(8);
    expect(blackbox.numberOfMarbles).toBe(4);
  });

  test('It should create a new blackbox with specified dimensions and marbles.', () => {
    var blackbox = new BlackBoxModel(16, 10);
    expect(blackbox.gridSize).toBe(16);
    expect(blackbox.numberOfMarbles).toBe(10);
  });

  test('It should create the grid.', () => {
    var blackbox = new BlackBoxModel( 8, 4, true);
    expect(blackbox.grid).toHaveLength(10);
    for (var i = 0; i < blackbox.grid.length; i++) {
      expect(blackbox.grid[i]).toHaveLength(10);
    }
  });

  test.skip('It should initialise the grid by populating the entire grid (incl. rim and corners) with zeros.', () => {
    var blackbox = new BlackBoxModel( 8, 4, true);
    for (var i = 0; i < blackbox.grid.length; i++) {
      for (var j = 0; j < blackbox.grid[i].length; j++) {
        expect(blackbox.grid[i][j]).toBe(0);
      }
    }
  });

});

describe('It should place the marbles in valid locations.', () => {

  test('It should place the correct number of marbles on the grid.', () => {
    var blackbox = new BlackBoxModel( 8, 4, true);
    expect(blackbox.marbles.length).toBe(4);
  });

  test('It should not place marbles on the rim.', () => {
    var blackbox = new BlackBoxModel();
    // try 100 new games, none should have marbles on the rim
    for (var numberOfGames = 0; numberOfGames < 100; numberOfGames++) {
      blackbox.newGame();
      // expect rim to not contain a marble
      expect(blackbox.grid[0]).not.toEqual(expect.arrayContaining([1]));
      expect(blackbox.grid[9]).not.toEqual(expect.arrayContaining([1]));
      for (var i = 0; i < blackbox.grid.length; i++) {
        expect(blackbox.grid[0][i]).not.toBe(1);
        expect(blackbox.grid[9][i]).not.toBe(1);
      }
    }
  });

  test('It should place marbles randomly on the grid.', () => {
    var numberOfMatchedMarbles = 0;
    var blackbox1 = new BlackBoxModel(8, 4, true);
    // create a second black box and expect its marbles not to be in the same position as the first black box
    var blackbox2 = new BlackBoxModel(8, 4, true);
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

describe.skip('It should know the location type of a Vector.', () => {

  test('It should know if a Vector is the corner.', () => {
    var blackbox = new BlackBoxModel();
    blackbox.newGame();
    // Check all 4 corner locations
    expect(blackbox.getLocationType(new Vector(0, 0).position)).toBe(LOCATION_TYPE.CORNER);
    expect(blackbox.getLocationType(new Vector(9, 0).position)).toBe(LOCATION_TYPE.CORNER);
    expect(blackbox.getLocationType(new Vector(0, 9).position)).toBe(LOCATION_TYPE.CORNER);
    expect(blackbox.getLocationType(new Vector(9, 9).position)).toBe(LOCATION_TYPE.CORNER);
  });

  test('It should know if a Vector is on the rim.', () => {
    var blackbox = new BlackBoxModel();
    blackbox.newGame();
    // Check rim on all 4 sides of the grid, lower bound, upper bound and centre
    // top row, far left, far right, centre
    expect(blackbox.getLocationType(new Vector(0, 1).position)).toBe(LOCATION_TYPE.RIM);
    expect(blackbox.getLocationType(new Vector(0, 8).position)).toBe(LOCATION_TYPE.RIM);
    expect(blackbox.getLocationType(new Vector(0, 4).position)).toBe(LOCATION_TYPE.RIM);
    // bottom row, far left, far right, centre
    expect(blackbox.getLocationType(new Vector(9, 1).position)).toBe(LOCATION_TYPE.RIM);
    expect(blackbox.getLocationType(new Vector(9, 8).position)).toBe(LOCATION_TYPE.RIM);
    expect(blackbox.getLocationType(new Vector(9, 4).position)).toBe(LOCATION_TYPE.RIM);
    // left side, top, bottom, centre
    expect(blackbox.getLocationType(new Vector(1, 0).position)).toBe(LOCATION_TYPE.RIM);
    expect(blackbox.getLocationType(new Vector(8, 0).position)).toBe(LOCATION_TYPE.RIM);
    expect(blackbox.getLocationType(new Vector(4, 0).position)).toBe(LOCATION_TYPE.RIM);
    // right side, top, bottom, centre
    expect(blackbox.getLocationType(new Vector(1, 9).position)).toBe(LOCATION_TYPE.RIM);
    expect(blackbox.getLocationType(new Vector(8, 9).position)).toBe(LOCATION_TYPE.RIM);
    expect(blackbox.getLocationType(new Vector(4, 9).position)).toBe(LOCATION_TYPE.RIM);
  });

  test('It should know if a Vector is in the grid.', () => {
    var blackbox = new BlackBoxModel();
    blackbox.newGame();
    // Check locations within the playable game grid
    // Test upper and lower bounds for rows and columns
    // Also test for locations near the centre of the grid
    expect(blackbox.getLocationType(new Vector(1, 1).position)).toBe(LOCATION_TYPE.GRID);
    expect(blackbox.getLocationType(new Vector(1, 8).position)).toBe(LOCATION_TYPE.GRID);
    expect(blackbox.getLocationType(new Vector(8, 1).position)).toBe(LOCATION_TYPE.GRID);
    expect(blackbox.getLocationType(new Vector(8, 8).position)).toBe(LOCATION_TYPE.GRID);
    expect(blackbox.getLocationType(new Vector(3, 4).position)).toBe(LOCATION_TYPE.GRID);
    expect(blackbox.getLocationType(new Vector(7, 2).position)).toBe(LOCATION_TYPE.GRID);
  });

  test('It should know if a Vector is outside of the black box.', () => {
    var blackbox = new BlackBoxModel();
    blackbox.newGame();
    // Check locations outside of the grid
    expect(blackbox.getLocationType(new Vector(-1, 2).position)).toBe(LOCATION_TYPE.OUTSIDE);
    expect(blackbox.getLocationType(new Vector(12, 5).position)).toBe(LOCATION_TYPE.OUTSIDE);
    expect(blackbox.getLocationType(new Vector(3, -4).position)).toBe(LOCATION_TYPE.OUTSIDE);
    expect(blackbox.getLocationType(new Vector(6, 11).position)).toBe(LOCATION_TYPE.OUTSIDE);
    expect(blackbox.getLocationType(new Vector(-1, -1).position)).toBe(LOCATION_TYPE.OUTSIDE);
    expect(blackbox.getLocationType(new Vector(10, 10).position)).toBe(LOCATION_TYPE.OUTSIDE);
  });

});

describe('It should handle guesses as to the locations of the marbles in the Black Box.', () => {

  test('It should accept guesses.', () => {
    var blackbox = new BlackBoxModel(8, 4);
    // Create 2 Vectors and add them as guesses
    var guess1 = new Vector(3, 4);
    blackbox.guess(guess1);
    var guess2 = new Vector(7, 2);
    blackbox.guess(guess2);
    expect(blackbox.guesses.length).toBe(2);
    expect(blackbox.guesses[0]).toEqual(guess1.position);
    expect(blackbox.guesses[1]).toEqual(guess2.position);
  });

  test('It should accept no more guesses than there are marbles in the game.', () => {
    var blackbox = new BlackBoxModel(8, 4);
    var guess1 = new Vector(1, 1);
    blackbox.guess(guess1);
    var guess2 = new Vector(2, 2);
    blackbox.guess(guess2);
    var guess3 = new Vector(3, 3);
    blackbox.guess(guess3);
    var guess4 = new Vector(4, 4);
    blackbox.guess(guess4);
    var guess5 = new Vector(5, 5);
    blackbox.guess(guess5);
    var guess6 = new Vector(6, 6);
    blackbox.guess(guess6);
    expect(blackbox.guesses.length).toBe(4);
    expect(blackbox.guesses[0]).toEqual(guess1.position);
    expect(blackbox.guesses[1]).toEqual(guess2.position);
    expect(blackbox.guesses[2]).toEqual(guess3.position);
    expect(blackbox.guesses[3]).toEqual(guess4.position);
  });

  test('It should treat a duplicate guess as a withdrawal of that guess.', () => {
    var blackbox = new BlackBoxModel(8, 4);
    // first 3 guesses are different so all are added in order
    var guess1 = new Vector(1, 1);
    blackbox.guess(guess1);
    expect(blackbox.guesses.length).toBe(1);
    expect(blackbox.guesses[0]).toEqual(guess1.position);
    var guess2 = new Vector(2, 2);
    blackbox.guess(guess2);
    expect(blackbox.guesses.length).toBe(2);
    expect(blackbox.guesses[0]).toEqual(guess1.position);
    expect(blackbox.guesses[1]).toEqual(guess2.position);
    var guess3 = new Vector(3, 3);
    blackbox.guess(guess3);
    expect(blackbox.guesses.length).toBe(3);
    expect(blackbox.guesses[0]).toEqual(guess1.position);
    expect(blackbox.guesses[1]).toEqual(guess2.position);
    expect(blackbox.guesses[2]).toEqual(guess3.position);
    // next guess is duplicate of second guess so second guess is removed leaving guesses one and three.
    var guess4 = new Vector(2, 2);
    blackbox.guess(guess4);
    expect(blackbox.guesses.length).toBe(2);
    expect(blackbox.guesses[0]).toEqual(guess1.position);
    expect(blackbox.guesses[1]).toEqual(guess3.position);
    // next guess is duplicate of first guess so first guess is removed leaving only third guess.
    var guess5 = new Vector(1, 1);
    blackbox.guess(guess5);
    expect(blackbox.guesses.length).toBe(1);
    expect(blackbox.guesses[0]).toEqual(guess3.position);
    // final guess is a duplicate of third guess so thired guess us removed. There are no guesses left.
    var guess6 = new Vector(3, 3);
    blackbox.guess(guess6);
    expect(blackbox.guesses.length).toBe(0);
  });

});

describe('It should ignore rays shot from the corners or from outside.', () => {

  test('It should ignore shots from the corners.', () => {
    var blackbox = new BlackBoxModel(8, 4, true);
    expect(blackbox.shootRay(new Vector(0, 0, VECTOR.DIRECTION.DOWN)).outcome).toBe(SHOOT_RAY_OUTCOME.CORNER);
    expect(blackbox.shootRay(new Vector(0, 9, VECTOR.DIRECTION.LEFT)).outcome).toBe(SHOOT_RAY_OUTCOME.CORNER);
    expect(blackbox.shootRay(new Vector(9, 9, VECTOR.DIRECTION.UP)).outcome).toBe(SHOOT_RAY_OUTCOME.CORNER);
    expect(blackbox.shootRay(new Vector(9, 0, VECTOR.DIRECTION.RIGHT)).outcome).toBe(SHOOT_RAY_OUTCOME.CORNER);
  });

  test('It should ignore shots from ouside the black box.', () => {
    var blackbox = new BlackBoxModel(8, 4, true);
    expect(blackbox.shootRay(new Vector(-1, -1)).outcome).toBe(SHOOT_RAY_OUTCOME.OUTSIDE);
    expect(blackbox.shootRay(new Vector(-1, 5)).outcome).toBe(SHOOT_RAY_OUTCOME.OUTSIDE);
    expect(blackbox.shootRay(new Vector(-1, 10)).outcome).toBe(SHOOT_RAY_OUTCOME.OUTSIDE);
    expect(blackbox.shootRay(new Vector(10, -1)).outcome).toBe(SHOOT_RAY_OUTCOME.OUTSIDE);
    expect(blackbox.shootRay(new Vector(10, 5)).outcome).toBe(SHOOT_RAY_OUTCOME.OUTSIDE);
    expect(blackbox.shootRay(new Vector(10, 10)).outcome).toBe(SHOOT_RAY_OUTCOME.OUTSIDE);
    expect(blackbox.shootRay(new Vector(-1, -1)).outcome).toBe(SHOOT_RAY_OUTCOME.OUTSIDE);
    expect(blackbox.shootRay(new Vector(5, -1)).outcome).toBe(SHOOT_RAY_OUTCOME.OUTSIDE);
    expect(blackbox.shootRay(new Vector(10, -1)).outcome).toBe(SHOOT_RAY_OUTCOME.OUTSIDE);
    expect(blackbox.shootRay(new Vector(-1, 10)).outcome).toBe(SHOOT_RAY_OUTCOME.OUTSIDE);
    expect(blackbox.shootRay(new Vector(5, 10)).outcome).toBe(SHOOT_RAY_OUTCOME.OUTSIDE);
    expect(blackbox.shootRay(new Vector(10, 10)).outcome).toBe(SHOOT_RAY_OUTCOME.OUTSIDE);
  });

});

describe('It should shoot rays from the rim.', () => {

  test('It should absorb rays shot at marbles.', () => {

    var blackbox = new BlackBoxModel(8, 4, true);
    // blackbox.grid[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[1] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[3] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[4] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
    // blackbox.grid[5] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[6] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[7] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[8] = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
    // blackbox.grid[9] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    blackbox.marbles = [];
    privateBlackBox.placeMarbleOnGrid(1, 1, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(3, 1, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(4, 8, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(8, 6, blackbox.numberOfMarbles, blackbox.marbles);

    expect(blackbox.shootRay(new Vector(0, 1, VECTOR.DIRECTION.DOWN)).outcome).toBe(SHOOT_RAY_OUTCOME.ABSORBED);
    expect(blackbox.grid[0][1]).toBe('a');
    expect(blackbox.shootRay(new Vector(0, 6, VECTOR.DIRECTION.DOWN)).outcome).toBe(SHOOT_RAY_OUTCOME.ABSORBED);
    expect(blackbox.grid[0][6]).toBe('a');
    expect(blackbox.shootRay(new Vector(0, 8, VECTOR.DIRECTION.DOWN)).outcome).toBe(SHOOT_RAY_OUTCOME.ABSORBED);
    expect(blackbox.grid[0][8]).toBe('a');
    expect(blackbox.shootRay(new Vector(1, 9, VECTOR.DIRECTION.LEFT)).outcome).toBe(SHOOT_RAY_OUTCOME.ABSORBED);
    expect(blackbox.grid[1][9]).toBe('a');
    expect(blackbox.shootRay(new Vector(4, 9, VECTOR.DIRECTION.LEFT)).outcome).toBe(SHOOT_RAY_OUTCOME.ABSORBED);
    expect(blackbox.grid[4][9]).toBe('a');
    expect(blackbox.shootRay(new Vector(8, 9, VECTOR.DIRECTION.LEFT)).outcome).toBe(SHOOT_RAY_OUTCOME.ABSORBED);
    expect(blackbox.grid[8][9]).toBe('a');
    expect(blackbox.shootRay(new Vector(9, 1, VECTOR.DIRECTION.UP)).outcome).toBe(SHOOT_RAY_OUTCOME.ABSORBED);
    expect(blackbox.grid[9][1]).toBe('a');
    expect(blackbox.shootRay(new Vector(9, 6, VECTOR.DIRECTION.UP)).outcome).toBe(SHOOT_RAY_OUTCOME.ABSORBED);
    expect(blackbox.grid[9][6]).toBe('a');
    expect(blackbox.shootRay(new Vector(9, 8, VECTOR.DIRECTION.UP)).outcome).toBe(SHOOT_RAY_OUTCOME.ABSORBED);
    expect(blackbox.grid[9][8]).toBe('a');
    expect(blackbox.shootRay(new Vector(1, 0, VECTOR.DIRECTION.RIGHT)).outcome).toBe(SHOOT_RAY_OUTCOME.ABSORBED);
    expect(blackbox.grid[1][0]).toBe('a');
    expect(blackbox.shootRay(new Vector(3, 0, VECTOR.DIRECTION.RIGHT)).outcome).toBe(SHOOT_RAY_OUTCOME.ABSORBED);
    expect(blackbox.grid[3][0]).toBe('a');
    expect(blackbox.shootRay(new Vector(8, 0, VECTOR.DIRECTION.RIGHT)).outcome).toBe(SHOOT_RAY_OUTCOME.ABSORBED);
    expect(blackbox.grid[8][0]).toBe('a');
  });

  test('It should deflect rays shot past marbles', () => {

    var blackbox = new BlackBoxModel(8, 4, true);
    // blackbox.grid[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[1] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[3] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[4] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
    // blackbox.grid[5] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[6] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[7] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[8] = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
    // blackbox.grid[9] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    blackbox.marbles = [];
    privateBlackBox.placeMarbleOnGrid(1, 1, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(3, 1, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(4, 8, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(8, 6, blackbox.numberOfMarbles, blackbox.marbles);

    expect(blackbox.shootRay(new Vector(0, 7, VECTOR.DIRECTION.DOWN)).outcome).toBe(SHOOT_RAY_OUTCOME.ABSORBED);
    expect(blackbox.grid[0][7]).toBe('a');
    expect(blackbox.shootRay(new Vector(9, 2, VECTOR.DIRECTION.UP)).outcome).toBe(SHOOT_RAY_OUTCOME.ABSORBED);
    expect(blackbox.grid[9][2]).toBe('a');
    expect(blackbox.shootRay(new Vector(7, 9, VECTOR.DIRECTION.LEFT)).outcome).toBe(SHOOT_RAY_OUTCOME.PROPOGATED);
    expect(blackbox.grid[7][9]).toBe(1);
    expect(blackbox.grid[5][0]).toBe(1);
    expect(blackbox.shootRay(new Vector(7, 0, VECTOR.DIRECTION.RIGHT)).outcome).toBe(SHOOT_RAY_OUTCOME.PROPOGATED);
    expect(blackbox.grid[7][0]).toBe(2);
    expect(blackbox.grid[0][5]).toBe(2);
  });

  test('It should reflect rays', () => {

    var blackbox = new BlackBoxModel(8, 4, true);
    // blackbox.grid[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[1] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[3] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[4] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
    // blackbox.grid[5] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[6] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[7] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[8] = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
    // blackbox.grid[9] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    blackbox.marbles = [];
    privateBlackBox.placeMarbleOnGrid(1, 1, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(3, 1, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(4, 8, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(8, 6, blackbox.numberOfMarbles, blackbox.marbles);

    expect(blackbox.shootRay(new Vector(0, 2, VECTOR.DIRECTION.DOWN)).outcome).toBe(SHOOT_RAY_OUTCOME.REFLECTED);
    expect(blackbox.grid[0][2]).toBe('r');
    expect(blackbox.shootRay(new Vector(2, 9, VECTOR.DIRECTION.LEFT)).outcome).toBe(SHOOT_RAY_OUTCOME.REFLECTED);
    expect(blackbox.grid[2][9]).toBe('r');
    expect(blackbox.shootRay(new Vector(3, 9, VECTOR.DIRECTION.LEFT)).outcome).toBe(SHOOT_RAY_OUTCOME.REFLECTED);
    expect(blackbox.grid[3][9]).toBe('r');
    expect(blackbox.shootRay(new Vector(5, 9, VECTOR.DIRECTION.LEFT)).outcome).toBe(SHOOT_RAY_OUTCOME.REFLECTED);
    expect(blackbox.grid[5][9]).toBe('r');
    expect(blackbox.shootRay(new Vector(9, 5, VECTOR.DIRECTION.UP)).outcome).toBe(SHOOT_RAY_OUTCOME.REFLECTED);
    expect(blackbox.grid[9][5]).toBe('r');
    expect(blackbox.shootRay(new Vector(9, 7, VECTOR.DIRECTION.UP)).outcome).toBe(SHOOT_RAY_OUTCOME.REFLECTED);
    expect(blackbox.grid[9][7]).toBe('r');
    expect(blackbox.shootRay(new Vector(2, 0, VECTOR.DIRECTION.RIGHT)).outcome).toBe(SHOOT_RAY_OUTCOME.REFLECTED);
    expect(blackbox.grid[2][0]).toBe('r');
    expect(blackbox.shootRay(new Vector(4, 0, VECTOR.DIRECTION.RIGHT)).outcome).toBe(SHOOT_RAY_OUTCOME.REFLECTED);
    expect(blackbox.grid[4][0]).toBe('r');
  });

  test('It should propogate rays without reflection', () => {

    var blackbox = new BlackBoxModel(8, 4, true);
    // blackbox.grid[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[1] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[3] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[4] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
    // blackbox.grid[5] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[6] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[7] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[8] = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
    // blackbox.grid[9] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    blackbox.marbles = [];
    privateBlackBox.placeMarbleOnGrid(1, 1, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(3, 1, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(4, 8, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(8, 6, blackbox.numberOfMarbles, blackbox.marbles);

    expect(blackbox.shootRay(new Vector(0, 3, VECTOR.DIRECTION.DOWN)).outcome).toBe(SHOOT_RAY_OUTCOME.PROPOGATED);
    expect(blackbox.grid[0][3]).toBe(1);
    expect(blackbox.grid[9][3]).toBe(1);
    expect(blackbox.shootRay(new Vector(0, 4, VECTOR.DIRECTION.DOWN)).outcome).toBe(SHOOT_RAY_OUTCOME.PROPOGATED);
    expect(blackbox.grid[0][4]).toBe(2);
    expect(blackbox.grid[9][4]).toBe(2);
    expect(blackbox.shootRay(new Vector(6, 9, VECTOR.DIRECTION.LEFT)).outcome).toBe(SHOOT_RAY_OUTCOME.PROPOGATED);
    expect(blackbox.grid[6][9]).toBe(3);
    expect(blackbox.grid[6][0]).toBe(3);
  });

});

describe('It should place and remove guesses using shootRay', () => {

  test('it should place and remove guesses', () => {

    var blackbox = new BlackBoxModel();
    blackbox.newGame();
    expect(blackbox.shootRay(new Vector(1, 1)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.shootRay(new Vector(2, 2)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.shootRay(new Vector(3, 3)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.shootRay(new Vector(4, 4)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.shootRay(new Vector(5, 5)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_MAX);
    expect(blackbox.shootRay(new Vector(6, 6)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_MAX);
    for (var i = 0; i < blackbox.numberOfMarbles; i++) {
      expect(blackbox.guesses[i]).toEqual(new Vector(i + 1, i + 1).position);
    }
    expect(blackbox.guesses.length).toBe(4);
    expect(blackbox.shootRay(new Vector(2, 2)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_REMOVED);
    expect(blackbox.shootRay(new Vector(1, 1)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_REMOVED);
    expect(blackbox.shootRay(new Vector(4, 4)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_REMOVED);
    expect(blackbox.guesses[0]).toEqual(new Vector(3, 3).position);
    expect(blackbox.guesses.length).toBe(1);
    expect(blackbox.shootRay(new Vector(3, 3)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_REMOVED);
    expect(blackbox.shootRay(new Vector(5, 5)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.shootRay(new Vector(5, 5)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_REMOVED);
    expect(blackbox.shootRay(new Vector(6, 6)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.guesses[0]).toEqual(new Vector(6, 6).position);
    expect(blackbox.guesses.length).toBe(1);

  });

});

describe('it should score games', () => {

  test('it should not score incomplete games', () => {

    var blackbox = new BlackBoxModel(8, 4, true);
    // blackbox.grid[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[1] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[3] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[4] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
    // blackbox.grid[5] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[6] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[7] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[8] = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
    // blackbox.grid[9] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    blackbox.marbles = [];
    privateBlackBox.placeMarbleOnGrid(1, 1, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(3, 1, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(4, 8, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(8, 6, blackbox.numberOfMarbles, blackbox.marbles);

    expect(blackbox.shootRay(new Vector(1, 1)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.allMarblesPlaced()).toBe(false);
    expect(blackbox.scoreGame()).toBe('Make 3 more guesses to get a score');
    expect(blackbox.shootRay(new Vector(2, 2)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.allMarblesPlaced()).toBe(false);
    expect(blackbox.scoreGame()).toBe('Make 2 more guesses to get a score');
    expect(blackbox.shootRay(new Vector(3, 3)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.allMarblesPlaced()).toBe(false);
    expect(blackbox.scoreGame()).toBe('Make 1 more guess to get a score');
    expect(blackbox.shootRay(new Vector(4, 4)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.allMarblesPlaced()).toBe(true);
    expect(blackbox.scoreGame()).toBe('Your score is: 15');
    expect(blackbox.grid[1][1]).toBe('y');
    expect(blackbox.grid[2][2]).toBe('n');
    expect(blackbox.grid[3][3]).toBe('n');
    expect(blackbox.grid[4][4]).toBe('n');
    expect(blackbox.grid[3][1]).toBe(0);
    expect(blackbox.grid[4][8]).toBe(0);
    expect(blackbox.grid[8][6]).toBe(0);

    expect(blackbox.marbles.some(marble => marble.row === 3 && marble.column === 1)).toBe(true);
    expect(blackbox.marbles.some(marble => marble.row === 4 && marble.column === 8)).toBe(true);
    expect(blackbox.marbles.some(marble => marble.row === 8 && marble.column === 6)).toBe(true);

  });

  test('it should score the perfect game', () => {

    var blackbox = new BlackBoxModel(8, 4, true);
    // blackbox.grid[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[1] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[3] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[4] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
    // blackbox.grid[5] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[6] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[7] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[8] = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
    // blackbox.grid[9] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    blackbox.marbles = [];
    privateBlackBox.placeMarbleOnGrid(1, 1, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(3, 1, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(4, 8, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(8, 6, blackbox.numberOfMarbles, blackbox.marbles);

    expect(blackbox.shootRay(new Vector(1, 1)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.shootRay(new Vector(3, 1)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.shootRay(new Vector(4, 8)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.shootRay(new Vector(8, 6)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.scoreGame()).toBe('Your score is: 0');
    expect(blackbox.grid[1][1]).toBe('y');
    expect(blackbox.grid[3][1]).toBe('y');
    expect(blackbox.grid[4][8]).toBe('y');
    expect(blackbox.grid[8][6]).toBe('y');

  });

  test('it should score the worst game', () => {

    var blackbox = new BlackBoxModel(8, 4, true);
    // blackbox.grid[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[1] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[3] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[4] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
    // blackbox.grid[5] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[6] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[7] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // blackbox.grid[8] = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
    // blackbox.grid[9] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    blackbox.marbles = [];
    privateBlackBox.placeMarbleOnGrid(1, 1, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(3, 1, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(4, 8, blackbox.numberOfMarbles, blackbox.marbles);
    privateBlackBox.placeMarbleOnGrid(8, 6, blackbox.numberOfMarbles, blackbox.marbles);

    // [0, a, r, 1, 2, 3, a, a, a, 0];
    // [a, 1, 0, g, g, g, g, 0, 0, a];
    // [r, 0, 0, 0, 0, 0, 0, 0, 0, r];
    // [a, 1, 0, 0, 0, 0, 0, 0, 0, r];
    // [r, 0, 0, 0, 0, 0, 0, 0, 1, a];
    // [5, 0, 0, 0, 0, 0, 0, 0, 0, r];
    // [4, 0, 0, 0, 0, 0, 0, 0, 0, 4];
    // [3, 0, 0, 0, 0, 0, 0, 0, 0, 5];
    // [a, 0, 0, 0, 0, 0, 1, 0, 0, a];
    // [0, a, a, 1, 2, r, a, r, a, 0];

    for (var i = 1; i <= 8; i++) {
      blackbox.shootRay(new Vector(0, i, VECTOR.DIRECTION.DOWN));
      blackbox.shootRay(new Vector(9, i, VECTOR.DIRECTION.UP));
      blackbox.shootRay(new Vector(i, 0, VECTOR.DIRECTION.RIGHT));
      blackbox.shootRay(new Vector(i, 9, VECTOR.DIRECTION.LEFT));
    }
    expect(blackbox.shootRay(new Vector(1, 3)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.shootRay(new Vector(1, 4)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.shootRay(new Vector(1, 5)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.shootRay(new Vector(1, 6)).outcome).toBe(SHOOT_RAY_OUTCOME.MARBLE_PLACED);
    expect(blackbox.scoreGame()).toBe('Your score is: ' + ((4*8)+(4*5)).toString());
    expect(blackbox.grid[1][3]).toBe('n');
    expect(blackbox.grid[1][4]).toBe('n');
    expect(blackbox.grid[1][5]).toBe('n');
    expect(blackbox.grid[1][6]).toBe('n');
    expect(blackbox.grid[1][1]).toBe(0);
    expect(blackbox.grid[3][1]).toBe(0);
    expect(blackbox.grid[4][8]).toBe(0);
    expect(blackbox.grid[8][6]).toBe(0);
    expect(blackbox.marbles.some(marble => marble.row === 1 && marble.column === 1)).toBe(true);
    expect(blackbox.marbles.some(marble => marble.row === 3 && marble.column === 1)).toBe(true);
    expect(blackbox.marbles.some(marble => marble.row === 4 && marble.column === 8)).toBe(true);
    expect(blackbox.marbles.some(marble => marble.row === 8 && marble.column === 6)).toBe(true);

  });

  test('it should score a \'normal\' game', () => {

  });

});
