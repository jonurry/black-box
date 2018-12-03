"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function e(t){return typeof t}:function e(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function e(t){return typeof t}:function e(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function e(t){return typeof t}:function e(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}
// dependencies
// Node.js import modules
function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function e(t){return typeof t}:function e(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function e(t){return typeof t}:function e(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}if(function(e){var t={getRandomIntInclusive:function e(t,n){return t=Math.ceil(t),n=Math.floor(n),Math.floor(Math.random()*(n-t+1))+t;//The maximum is inclusive and the minimum is inclusive
}};// Export to root (window in browser)
"function"==typeof define&&define.amd||("object"===("undefined"==typeof exports?"undefined":_typeof(exports))?
// Node.js
module.exports.blackBoxUtil=t:(
// in the browser
(e=e||{}).BLACKBOX=e.BLACKBOX||{},e.BLACKBOX.utility=t))}(Window),function(e,o){function t(e,t,n){this.direction=n!==o?n:i.DIRECTION.NONE,this.position={row:parseInt(e,10),column:parseInt(t,10)}}// define vector constants
var i={DIRECTION:{UP:{rowIncrement:-1,columnIncrement:0},DOWN:{rowIncrement:1,columnIncrement:0},LEFT:{rowIncrement:0,columnIncrement:-1},RIGHT:{rowIncrement:0,columnIncrement:1},NONE:{rowIncrement:0,columnIncrement:0}}};t.prototype.move=function(){try{var e=this.direction.rowIncrement,t=this.direction.columnIncrement;Number.isInteger(e)&&Number.isInteger(t)&&-1<=e&&e<=1&&-1<=t&&t<=1&&(this.position.row+=e,this.position.column+=t)}catch(e){throw"The vector direction was not a valid direction."}},t.prototype.setPosition=function(e,t){this.position.row=e,this.position.column=t},// Export to root (window in browser)
"function"==typeof define&&define.amd||("object"===("undefined"==typeof exports?"undefined":_typeof(exports))?(
// Node.js
module.exports.VECTOR=i,module.exports.Vector=t):(
// in the browser
(e=e||{}).BLACKBOX=e.BLACKBOX||{},e.BLACKBOX.VECTOR=i,e.BLACKBOX.Vector=t))}(Window),"object"===("undefined"==typeof exports?"undefined":_typeof(exports))){if(void 0===(void 0).BLACKBOX&&((void 0).BLACKBOX={}),void 0===(void 0).BLACKBOX.VECTOR){var vectorModule=require("../js/vector.js");(void 0).BLACKBOX.VECTOR=vectorModule.VECTOR}if(void 0===(void 0).BLACKBOX.utility){var utilModule=require("../js/utility.js");(void 0).BLACKBOX.utility=utilModule.blackBoxUtil}}!function(e){// private properties
//
// private methods
function m(e,t,n){var o=!1,i=!1,r=e.position.row+e.direction.rowIncrement,s=e.position.column+e.direction.columnIncrement,u=n+1,c=b.VECTOR.DIRECTION,a;return a=0===r||r===u||0===s||s===u?v.NONE:e.direction===c.UP||e.direction===c.DOWN?(o=t.some(function(e){return e.row===r&&e.column===s+1}),i=t.some(function(e){return e.row===r&&e.column===s-1}),o&&i?(
//two adjacent marbles so ray is reversed
e.direction=e.direction===c.UP?c.DOWN:c.UP,v.REVERSED):o?(
// one adjacent marble so head LEFT
e.direction=c.LEFT,v.DEFLECTED):i?(
// one adjacent marble so head RIGHT
e.direction=c.RIGHT,v.DEFLECTED):v.NONE):(
//ray is travelling LEFT or RIGHT
// ignore case where first propagated ray is encountered at edge
o=t.some(function(e){return e.row===r+1&&e.column===s}),i=t.some(function(e){return e.row===r-1&&e.column===s}),o&&i?(
//two adjacent marbles so ray is reversed
e.direction=e.direction===c.LEFT?c.RIGHT:c.LEFT,v.REVERSED):o?(
// one adjacent marble so head UP
e.direction=c.UP,v.DEFLECTED):i?(
// one adjacent marble so head DOWN
e.direction=c.DOWN,v.DEFLECTED):v.NONE)}function i(e,t){//first row. 2 extra slots to record ray outcomes at either end
for(var n=
// reset empty array without creating a new array
e.length=0;n<t+2;n++)e[n]=[],e[n].length=t+2}function r(e,t){for(var n=0;n<t+2;n++)e[n].fill(0)}function t(e,t,n,o){
// place marble according to row and column position
// if marble already placed then ignore request
// if max number of marbles would be exceeded then don't place marble
var i={};i.row=e,i.column=t,o.length<n&&(o.some(function(e){return e.row===i.row&&e.column===i.column})||o.push(i))}function s(e,t,n){for(var o,i=0;i<t;i++){for(o={};o.row=b.utility.getRandomIntInclusive(1,e),o.column=b.utility.getRandomIntInclusive(1,e),n.some(function(e){return e.row===o.row&&e.column===o.column}););n.push(o)}}function p(e,t){
// check if ray has already been shot from current location (i.e. duplicate)
return 0!==t[e.position.row][e.position.column]}function h(e,t){
// check if ray will hit a marble on next move
var n={};return n.row=e.position.row+e.direction.rowIncrement,n.column=e.position.column+e.direction.columnIncrement,t.some(function(e){return e.row===n.row&&e.column===n.column})}function f(e,t){var n=e.position.row,o=e.position.column,i=t+1;// check if ray has reached the rim
return 0===n||n===i||0===o||o===i}function y(e,t){var n=e.position.row,o=e.position.column,i=t+1;// check if ray is in a corner
return 0===n&&0===o||0===n&&o===i||n===i&&0===o||n===i&&o===i}function E(e,t){var n=e.position.row,o=e.position.column,i=t+1;return 0<n&&0<o&&n<i&&o<i}function g(e,t){var n=e.position.row,o=e.position.column,i=t+1;return n<0||o<0||i<n||i<o}// public API - constructor
function n(e,t,n){var o=0<arguments.length&&void 0!==e?e:8,i=1<arguments.length&&void 0!==t?t:4,r=2<arguments.length&&void 0!==n&&n;this.gameHasFinished=!1,this.grid=[],this.gridSize=o,this.guesses=[],this.marbles=[],this.numberOfMarbles=i,this.numberOfRays=0,this.turns=[],r&&this.newGame(this.gridSize,this.numberOfMarbles)}// public API - prototype methods
var b=e.BLACKBOX,O={ABSORBED:"ray hit marble and was absorbed",CORNER:"ray is in a corner",DUPLICATE:"ray has already been shot",INSIDE:"ray is inside the black box",MARBLE_MAX:"marble ignored - maximum number already placed",MARBLE_PLACED:"marble has been placed",MARBLE_REMOVED:"marble has been removed",NOTHING:"no outcome",OUTSIDE:"ray is outside of the black box",PROPOGATED:"ray has reached the rim",REFLECTED:"ray has been reflected"},v={DEFLECTED:"ray has been deflected",NONE:"ray has not been deflected",REVERSED:"ray has been reversed"};// define black box constants
n.prototype.allMarblesPlaced=function(){return this.guesses.length===this.numberOfMarbles},n.prototype.guess=function(e){for(var t=e.position.row,n=e.position.column,o=-1,i=0,r;r=this.guesses[i];i++)r.row===t&&r.column===n&&(
// that guess has already been made so remove guess
o=i);return-1<o?(this.guesses.splice(o,1),O.MARBLE_REMOVED):this.guesses.length<this.numberOfMarbles?(this.guesses.push(e.position),O.MARBLE_PLACED):O.MARBLE_MAX},n.prototype.newGame=function(e,t){var n=0<arguments.length&&void 0!==e?e:8,o=1<arguments.length&&void 0!==t?t:4;this.gameHasFinished=!1,this.grid=[],this.gridSize=n,this.guesses=[],this.marbles=[],this.numberOfMarbles=o,this.numberOfRays=0,this.turns=[],i(this.grid,this.gridSize),r(this.grid,this.gridSize),s(this.gridSize,this.numberOfMarbles,this.marbles)},n.prototype.scoreGame=function(){
// 1 point for each entry and exit location
// 5 points for each guess in the wrong location
// incomplete games will not be scored
var e,n;if(this.allMarblesPlaced()){n=0;// Add up the ray scores
for(var t=1;t<=this.gridSize;t++)0!==this.grid[0][t]&&n++,0!==this.grid[this.gridSize+1][t]&&n++,0!==this.grid[t][0]&&n++,0!==this.grid[t][this.gridSize+1]&&n++;// process the guesses
this.guesses.forEach(function(t){this.marbles.some(function(e){return e.row===t.row&&e.column===t.column})?this.grid[t.row][t.column]="y":(n+=5,this.grid[t.row][t.column]="n")},this);// cycle through grid and mark any marbles that were not found
for(var o=1;o<=this.gridSize;o++)for(var i=1;i<=this.gridSize;i++)1===this.grid[o][i]&&(this.grid[o][i]="x");this.gameHasFinished=!0}else e=this.numberOfMarbles-this.guesses.length,n="Make "+e.toString()+" more guess"+(1===e?"":"es")+" to get a score",this.gameHasFinished=!1;return n},n.prototype.shootRay=function(e){
// returns an object that gives the overall outcome
// and the path that the ray took
// {
//  outcome: SHOOT_RAY_OUTCOME,
//  path: array of Vectors,
//  rayNumber: the number of the ray
// }
var t={outcome:O.NOTHING,path:[],rayNumber:0},n,o=v.NONE,i=e.position.row,r=e.position.column,s=this.grid,u=this.gridSize,c=u+1,a=this.marbles,l=this.gameHasFinished,d=b.VECTOR.DIRECTION;if(// determine ray direction if not specified
e.direction===d.NONE&&(0===e.position.row?e.direction=d.DOWN:e.position.row===c?e.direction=d.UP:0===e.position.column?e.direction=d.RIGHT:e.position.column===c&&(e.direction=d.LEFT)),t.path.push(JSON.parse(JSON.stringify(e))),g(e,u))t.outcome=O.OUTSIDE;else if(y(e,u))t.outcome=O.CORNER;else if(E(e,u))this.gameHasFinished?t.outcome=O.INSIDE:t.outcome=this.guess(e);else if(p(e,s)&&!this.gameHasFinished)t.outcome=O.DUPLICATE;else
// shoot the ray
for(;h(e,a)?(this.gameHasFinished||(s[i][r]="a"),t.path.push(JSON.parse(JSON.stringify(e))),t.outcome=O.ABSORBED):(n=JSON.stringify(e),(o=m(e,a,u))!==v.NONE&&(1===t.path.length?(this.gameHasFinished||(s[i][r]="r"),t.outcome=O.REFLECTED):o===v.REVERSED&&(
// DONE: Path is not fully traced when reflected (missing a step) id:4 gh:5
t.path.push(JSON.parse(n)),t.path.push(JSON.parse(JSON.stringify(e)))))),t.outcome===O.NOTHING&&(e.move(),t.path.push(JSON.parse(JSON.stringify(e))),f(e,u)&&(e.position.row===i&&e.position.column===r?(this.gameHasFinished||(s[i][r]="r"),t.outcome=O.REFLECTED):(this.gameHasFinished||(this.numberOfRays++,s[e.position.row][e.position.column]=this.numberOfRays,s[i][r]=this.numberOfRays),t.outcome=O.PROPOGATED))),t.outcome===O.NOTHING;);return l?t.rayNumber=s[i][r]:(t.rayNumber=this.numberOfRays,t.outcome!==O.ABSORBED&&t.outcome!==O.REFLECTED&&t.outcome!==O.PROPOGATED||this.turns.push(t)),t},// Export to root (window in browser)
"function"==typeof define&&define.amd||("object"===("undefined"==typeof exports?"undefined":_typeof(exports))?(
// Node.js
module.exports.SHOOT_RAY_OUTCOME=O,module.exports.BlackBoxModel=n,"test"===process.env.NODE_ENV&&(module.exports.BlackBoxModel._private={checkForDeflectedRay:m,createGrid:i,initialiseGrid:r,placeMarbleOnGrid:t,placeMarblesRandomlyOnGrid:s,rayAlreadyShot:p,rayHasHitMarble:h,rayHasReachedRim:f,rayIsInCorner:y,rayIsInsideGrid:E,rayIsOutsideGrid:g})):(
// in the browser
(e=e||{}).BLACKBOX=e.BLACKBOX||{},e.BLACKBOX.SHOOT_RAY_OUTCOME=O,e.BLACKBOX.Model=n))}(Window),function(e,a){function u(e){var n,o,t,i,r;s&&(null!==(r=document.getElementById("svg"))&&0<(i=c(r.querySelectorAll("path"))).length&&(o=i.map(function(e){var t=e.getTotalLength();return e.style.strokeDasharray=t+" "+t,e.style.strokeDashoffset=t,e.style.visibility="visible",.03*Math.pow(t,.5)}),i[// triggering a reflow so styles are calculated in their
// start position, so they animate from here
n=0].getBoundingClientRect(),e&&i.forEach(function(e,t){e.style.transition=e.style.WebkitTransition="stroke-dashoffset "+o[t]+"s "+n+"s ease-in-out",e.style.strokeDashoffset="0",n+=o[t]+.1})),t=o.reduce(function(e,t){return e+t},.1*o.length+5),l=setTimeout(u,1e3*t,!e))}// end: SVG Animate
function m(e,t){var n,o,i,r,s=[],u,c,a,l;if(2<e.path.length){c=(u=100/t)/2,a=(o=e.path[0]).position.row,l=o.position.column,// move to start position of ray ("M x y")
s.push("M"),0===l?s.push(0):l===t+1?s.push(100):s.push((l-.5)*u),0===a?s.push(0):a===t+1?s.push(100):s.push((a-.5)*u);for(var d=1;d<e.path.length-1;d++)i=e.path[d],r=e.path[d+1],1===i.direction.rowIncrement&&1===r.direction.rowIncrement?(
// ray moves down one cell relative to current position "v 1-cell"
s.push("v"),s.push(u)):-1===i.direction.rowIncrement&&-1===r.direction.rowIncrement?(
// ray moves up one cell relative to current position "v -(1-cell)"
s.push("v"),s.push(-u)):1===i.direction.columnIncrement&&1===r.direction.columnIncrement?(
// ray moves right one cell relative to current position "h 1-cell"
s.push("h"),s.push(u)):-1===i.direction.columnIncrement&&-1===r.direction.columnIncrement?(
// ray moves left one cell relative to current position "h -(1-cell)"
s.push("h"),s.push(-u)):-1===i.direction.columnIncrement&&1===r.direction.rowIncrement?(
// ray deflected from travelling left to travelling down
// ray arcs anti-clockwise to left and down relative to current position
// "a radius radius, 0 0 0, -radius radius"
s.push("a"),s.push(c),s.push(c),s.push(0),s.push(0),s.push(0),s.push(-c),s.push(c)):1===i.direction.rowIncrement&&1===r.direction.columnIncrement?(
// ray deflected from travelling down to travelling right
// ray arcs anti-clockwise from down to right relative to current position
// "a radius radius, 0 0 0, radius radius"
s.push("a"),s.push(c),s.push(c),s.push(0),s.push(0),s.push(0),s.push(c),s.push(c)):1===i.direction.columnIncrement&&-1===r.direction.rowIncrement?(
// ray deflected from travelling right to travelling up
// ray arcs anti-clockwise to right and up relative to current position
// "a radius radius, 0 0 0, radius -radius"
s.push("a"),s.push(c),s.push(c),s.push(0),s.push(0),s.push(0),s.push(c),s.push(-c)):-1===i.direction.rowIncrement&&-1===r.direction.columnIncrement?(
// ray deflected from travelling up to travelling left
// ray arcs anti-clockwise to left and up relative to current position
// "a radius radius, 0 0 0, -radius -radius"
s.push("a"),s.push(c),s.push(c),s.push(0),s.push(0),s.push(0),s.push(-c),s.push(-c)):1===i.direction.columnIncrement&&1===r.direction.rowIncrement?(
// ray deflected from travelling right to travelling down
// ray arcs clockwise to right and down relative to current position
// "a radius radius, 0 0 1, radius radius"
s.push("a"),s.push(c),s.push(c),s.push(0),s.push(0),s.push(1),s.push(c),s.push(c)):1===i.direction.rowIncrement&&-1===r.direction.columnIncrement?(
// ray deflected from travelling down to travelling left
// ray arcs clockwise from down to left relative to current position
// "a radius radius, 0 0 1, -radius radius"
s.push("a"),s.push(c),s.push(c),s.push(0),s.push(0),s.push(1),s.push(-c),s.push(c)):-1===i.direction.columnIncrement&&-1===r.direction.rowIncrement?(
// ray deflected from travelling left to travelling up
// ray arcs clockwise to left and up relative to current position
// "a radius radius, 0 0 1, -radius -radius"
s.push("a"),s.push(c),s.push(c),s.push(0),s.push(0),s.push(1),s.push(-c),s.push(-c)):-1===i.direction.rowIncrement&&1===r.direction.columnIncrement&&(
// ray deflected from travelling up to travelling right
// ray arcs clockwise to right and up relative to current position
// "a radius radius, 0 0 1, radius -radius"
s.push("a"),s.push(c),s.push(c),s.push(0),s.push(0),s.push(1),s.push(c),s.push(-c))}return s.join(" ")}function p(e,t,n,o){var i=!(3<arguments.length&&o!==a)||o,r=f.SHOOT_RAY_OUTCOME,s,u,c;switch(s=document.getElementsByTagName("svg")[0],(u=document.createElement("path")).setAttribute("d",e),u.style.visibility=i?"visible":"hidden",""!==n&&u.setAttribute("class",n),t){case r.ABSORBED:case r.REFLECTED:-1===s.innerHTML.search(u.outerHTML)?s.innerHTML+=u.outerHTML:s.innerHTML=s.innerHTML.replace(u.outerHTML,"");break;case r.PROPOGATED:(c=s.querySelectorAll("path."+n)[0])===a?s.innerHTML+=u.outerHTML:c.remove();break}}function h(){var e,t,n,o,i,r,s;null!==(i=document.getElementById("svg"))&&(
// resize the svg element
e=document.getElementById("blackbox"),t=parseInt(document.getElementById("inputGridSize").value),o=e.offsetWidth/(t+2),s=e.offsetWidth-2*o,r=e.offsetTop+o,n=o+e.offsetLeft,i.style.cssText="width: "+s+"px; top: "+r+"px; left: "+n+"px;")}function c(e){return Array.prototype.slice.call(e)}function t(){(this.view=this).validationHandlers(),this.bind("resizeBlackBox")}var f=e.BLACKBOX,l,s=((n=document.createElement("div")).innerHTML="<svg/>","http://www.w3.org/2000/svg"==(n.firstChild&&n.firstChild.namespaceURI)),n;document.documentElement.className+=s?" inline-svg":"",t.prototype.bind=function(e,t){var n,o,i,r,s,u,c,a,l,d;"animateRays"===e?((a=document.getElementById("radioAnimateRaysYes")).addEventListener("change",function(){t()}),(a=document.getElementById("radioAnimateRaysNo")).addEventListener("change",function(){t()})):"newGame"===e?(o=document.getElementById("buttonNewGame")).addEventListener("click",function(){u=parseInt(document.getElementById("inputGridSize").value),c=parseInt(document.getElementById("inputMarbles").value),t(u,c),document.getElementById("score").style.display="none",document.getElementById("animateRays").style.display="none"}):"scoreGame"===e?(i=document.getElementById("buttonScoreGame")).addEventListener("click",function(){d=t(),document.getElementById("scoreValue").innerHTML=d,document.getElementById("score").style.display="block",document.getElementById("animateRays").style.display="block"}):"shootRay"===e?(n=document.getElementById("blackbox")).addEventListener("click",function(e){"svg"!==(r=e.target).nodeName&&(l=parseInt(r.dataset.pos.split(",")[0]),s=parseInt(r.dataset.pos.split(",")[1]),t(new f.Vector(l,s)))}):"resizeBlackBox"===e&&window.addEventListener("resize",h)},t.prototype.renderAndAnimateAllRays=function(e,n){var o=f.SHOOT_RAY_OUTCOME,t,i,r,s;return(t="on"===document.querySelector('input[name="switch"]:checked').value)?(null!==(r=document.getElementById("svg"))&&0===(i=c(r.querySelectorAll("path"))).length&&e.forEach(function(e){var t;switch(e.outcome){case o.ABSORBED:t="hit";break;case o.MARBLE_PLACED:case o.MARBLE_REMOVED:t="guess";break;case o.PROPOGATED:t="ray-"+e.rayNumber;break;case o.REFLECTED:t="reflect";break}0<(s=m(e,n)).length&&p(s,e.outcome,t,!1)}),u(!0)):clearTimeout(l),t},t.prototype.renderGridConsole=function(e){var t;console.log();for(var n=0;n<e.length;n++){t="";for(var o=0;o<e.length;o++)t+=String(e[n][o])+"\t";console.log(t+"\t"+String(n))}},t.prototype.renderGrid=function(t,e,n,o,i,r){var s=document.getElementById("blackbox"),u,c,a,l=e+1;s.innerHTML="",s.className="blackbox grid grid-size-"+e;for(var d=0;d<=l;d++)for(var m=0;m<=l;m++){// render ray outcomes
switch(c=document.createElement("div"),a=["cell"],t[d][m]){case 0:
// no action required
break;case"a":a.push("hit");break;case"n":a.push("guess-wrong");break;case"r":a.push("reflect");break;case"x":a.push("not-found");break;case"y":a.push("guess-right");break;default:0!==d&&d!==l&&0!==m&&m!==l||a.push("ray-"+t[d][m])}n&&
// render marbles
r.forEach(function(e){parseInt(e.row)===d&&parseInt(e.column)===m&&0===t[d][m]&&a.push("guess")}),// set row and column data
c.dataset.pos=d+","+m,c.className=a.join(" "),s.appendChild(c)}n&&(
// overlay the inner grid with an SVG element so that we can draw
// the ray's path on top of the grid.
s.innerHTML+='<svg id="svg" viewBox="0 0 100 100"></svg>',window.setTimeout(h,0)),(// enable/disable score game button
u=document.getElementById("buttonScoreGame")).disabled=!(o&&!n)},t.prototype.renderShot=function(e,t,n,o){var i=f.SHOOT_RAY_OUTCOME,r,s="",u,c,a,l,d;switch(l=e.path[0].position.row+","+e.path[0].position.column,c=e.path[e.path.length-1].position.row+","+e.path[e.path.length-1].position.column,a=document.querySelectorAll("[data-pos='"+l+"']")[0],u=document.querySelectorAll("[data-pos='"+c+"']")[0],r=document.getElementById("buttonScoreGame"),e.outcome){case i.ABSORBED:s="hit";break;case i.MARBLE_PLACED:case i.MARBLE_REMOVED:s="guess";break;case i.PROPOGATED:s="ray-"+e.rayNumber;break;case i.REFLECTED:s="reflect";break}// if gameHasFinished then trace path of ray
if(n)0<(d=m(e,t)).length&&p(d,e.outcome,s);else switch(
// game has not finished
s=" "+s,e.outcome){case i.ABSORBED:case i.MARBLE_PLACED:case i.PROPOGATED:case i.REFLECTED:a.className+=s,e.outcome===i.PROPOGATED&&(u.className+=s);break;case i.MARBLE_REMOVED:a.className=a.className.replace(s,"");break}// enable/disable score game button
r.disabled=!(o&&!n)},t.prototype.validationHandlers=function(){var e=document.getElementById("inputGridSize"),t=document.getElementById("inputMarbles");e.addEventListener("focusout",function(e){var t=parseInt(e.currentTarget.value);t<6?e.currentTarget.value=6:16<t?e.currentTarget.value=16:isNaN(t)&&(e.currentTarget.value=8)}),t.addEventListener("focusout",function(e){var t=parseInt(document.getElementById("inputGridSize").value),n=parseInt(e.currentTarget.value);n<4?e.currentTarget.value=4:16<n?e.currentTarget.value=16:isNaN(n)&&(e.currentTarget.value=t-4)})},// Export to root (window in browser)
"function"==typeof define&&define.amd||("object"===("undefined"==typeof exports?"undefined":_typeof(exports))?
// Node.js
module.exports.BlackBoxView=t:(
// in the browser
(e=e||{}).BLACKBOX=e.BLACKBOX||{},e.BLACKBOX.View=t))}(Window),function(e){function t(e){e.animateRays=e.view.renderAndAnimateAllRays(e.model.turns,e.model.gridSize)}function n(e,t){var i=this;this.animateRays=!0,this.model=e,this.view=t,this.view.bind("animateRays",function(){i.onClickAnimateRays()}),this.view.bind("newGame",function(e,t){var n=0<arguments.length&&void 0!==e?e:8,o=1<arguments.length&&void 0!==t?t:4;i.onClickNewGame(n,o)}),this.view.bind("scoreGame",function(){return i.onClickScoreGame()}),this.view.bind("shootRay",function(e){return i.onClickShootRay(e)})}n.prototype.onClickAnimateRays=function(){t(this)},n.prototype.onClickNewGame=function(e,t){var n=0<arguments.length&&void 0!==e?e:8,o=1<arguments.length&&void 0!==t?t:4;this.model.newGame(n,o),this.renderViews()},n.prototype.onClickScoreGame=function(){var e=this.model.scoreGame();return this.renderViews(),this.animateRays&&setTimeout(t,3e3,this),e},n.prototype.onClickShootRay=function(e){var t=this.model.shootRay(e);this.view.renderShot(t,this.model.gridSize,this.model.gameHasFinished,this.model.allMarblesPlaced())},n.prototype.renderViews=function(){var e=this.model,t=JSON.parse(JSON.stringify(e.grid)),n=JSON.parse(JSON.stringify(e.guesses)),o=JSON.parse(JSON.stringify(e.marbles));this.view.renderGridConsole(t),this.view.renderGrid(t,e.gridSize,e.gameHasFinished,e.allMarblesPlaced(),n,o)},// Export to root (window in browser)
"function"==typeof define&&define.amd||("object"===("undefined"==typeof exports?"undefined":_typeof(exports))?
// Node.js
module.exports.BlackBoxController=n:(
// in the browser
(e=e||{}).BLACKBOX=e.BLACKBOX||{},e.BLACKBOX.Controller=n))}(Window),function(e){var t=e.BLACKBOX,n=new t.Model(8,4,!0),o=new t.View,i;new t.Controller(n,o).renderViews()}(Window);
//# sourceMappingURL=app.js.map
//# sourceMappingURL=app.js.map