// Load the javascript files to be tested
var fs = require('fs');
eval(fs.readFileSync('./js/point.js').toString());

// Get testing
test('It should create a point at position 2, 4.', () => {
  var point1 = new Point(2, 4);
  expect(point1.position.row).toBe(2);
  expect(point1.position.column).toBe(4);
});

describe('It should move a point in all 4 directions.', () => {
  var point;
  beforeEach(() => {
    point = new Point(2, 4);
  });
  test('It should move point position UP by 1.', () => {
    var pointExpected = new Point(1, 4);
    point.move(direction.UP);
    expect(point.position).toEqual(pointExpected.position);
  });
  test('It should move point position DOWN by 1.', () => {
    var pointExpected = new Point(3, 4);
    point.move(direction.DOWN);
    expect(point.position).toEqual(pointExpected.position);
  });
  test('It should move point position LEFT by 1.', () => {
    var pointExpected = new Point(2, 3);
    point.move(direction.LEFT);
    expect(point.position).toEqual(pointExpected.position);
  });
  test('It should move point position RIGHT by 1.', () => {
    var pointExpected = new Point(2, 5);
    point.move(direction.RIGHT);
    expect(point.position).toEqual(pointExpected.position);
  });
});
