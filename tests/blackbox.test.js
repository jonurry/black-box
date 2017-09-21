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

test.skip('It should set the current ray position by row and column number', () => {
  var pos = [2, 4];
  blackbox.setRayPosition(pos);
  expect(blackbox.rayPosition).toBe(pos);
});
