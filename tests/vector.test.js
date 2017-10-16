// Load the javascript files to be tested
var vectorModule = require('../js/vector.js');
var Vector = vectorModule.Vector;
var VECTOR = vectorModule.VECTOR;

// Get testing
test('It should create a vector at a position with no direction.', () => {
  var vector1 = new Vector(2, 4);
  expect(vector1.position.row).toBe(2);
  expect(vector1.position.column).toBe(4);
  expect(vector1.direction).toBe(VECTOR.DIRECTION.NONE);
});

test('It should create a vector at a position and with a direction.', () => {
  var vector1 = new Vector(2, 4, VECTOR.DIRECTION.UP);
  expect(vector1.position.row).toBe(2);
  expect(vector1.position.column).toBe(4);
  expect(vector1.direction).toBe(VECTOR.DIRECTION.UP);
});

describe('It should move a vector in all 4 directions.', () => {
  var vector;
  beforeEach(() => {
    vector = new Vector(2, 4);
  });
  test('It should move vector position UP by 1.', () => {
    var vectorExpected = new Vector(1, 4);
    vector.direction = VECTOR.DIRECTION.UP;
    vector.move();
    expect(vector.position).toEqual(vectorExpected.position);
  });
  test('It should move vector position DOWN by 1.', () => {
    var vectorExpected = new Vector(3, 4);
    vector.direction = VECTOR.DIRECTION.DOWN;
    vector.move();
    expect(vector.position).toEqual(vectorExpected.position);
  });
  test('It should move vector position LEFT by 1.', () => {
    var vectorExpected = new Vector(2, 3);
    vector.direction = VECTOR.DIRECTION.LEFT;
    vector.move();
    expect(vector.position).toEqual(vectorExpected.position);
  });
  test('It should move vector position RIGHT by 1.', () => {
    var vectorExpected = new Vector(2, 5);
    vector.direction = VECTOR.DIRECTION.RIGHT;
    vector.move();
    expect(vector.position).toEqual(vectorExpected.position);
  });
});
