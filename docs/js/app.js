"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function e(t){return typeof t}:function e(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function e(t){return typeof t}:function e(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function e(t){return typeof t}:function e(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}
// dependencies
// Node.js import modules
function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function e(t){return typeof t}:function e(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function e(t){return typeof t}:function e(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}if(function(e){var t={getRandomIntInclusive:function e(t,o){return t=Math.ceil(t),o=Math.floor(o),Math.floor(Math.random()*(o-t+1))+t;//The maximum is inclusive and the minimum is inclusive
}};// Export to root (window in browser)
"function"==typeof define&&define.amd||("object"===("undefined"==typeof exports?"undefined":_typeof(exports))?
// Node.js
module.exports.blackBoxUtil=t:(
// in the browser
(e=e||{}).BLACKBOX=e.BLACKBOX||{},e.BLACKBOX.utility=t))}(void 0),function(e,n){function t(e,t,o){this.direction=o!==n?o:i.DIRECTION.NONE,this.position={row:parseInt(e,10),column:parseInt(t,10)}}// define vector constants
var i={DIRECTION:{UP:{rowIncrement:-1,columnIncrement:0},DOWN:{rowIncrement:1,columnIncrement:0},LEFT:{rowIncrement:0,columnIncrement:-1},RIGHT:{rowIncrement:0,columnIncrement:1},NONE:{rowIncrement:0,columnIncrement:0}}};t.prototype.move=function(){try{var e=this.direction.rowIncrement,t=this.direction.columnIncrement;Number.isInteger(e)&&Number.isInteger(t)&&-1<=e&&e<=1&&-1<=t&&t<=1&&(this.position.row+=e,this.position.column+=t)}catch(e){throw"The vector direction was not a valid direction."}},t.prototype.setPosition=function(e,t){this.position.row=e,this.position.column=t},// Export to root (window in browser)
"function"==typeof define&&define.amd||("object"===("undefined"==typeof exports?"undefined":_typeof(exports))?(
// Node.js
module.exports.VECTOR=i,module.exports.Vector=t):(
// in the browser
(e=e||{}).BLACKBOX=e.BLACKBOX||{},e.BLACKBOX.VECTOR=i,e.BLACKBOX.Vector=t))}(void 0),"object"===("undefined"==typeof exports?"undefined":_typeof(exports))){if(void 0===(void 0).BLACKBOX&&((void 0).BLACKBOX={}),void 0===(void 0).BLACKBOX.VECTOR){var vectorModule=require("../js/vector.js");(void 0).BLACKBOX.VECTOR=vectorModule.VECTOR}if(void 0===(void 0).BLACKBOX.utility){var utilModule=require("../js/utility.js");(void 0).BLACKBOX.utility=utilModule.blackBoxUtil}}!function(e,m){// private properties
//
// private methods
function p(e,t,o){var n=!1,i=!1,r=e.position.row+e.direction.rowIncrement,s=e.position.column+e.direction.columnIncrement,u=o+1,c=m.VECTOR.DIRECTION,a;return a=0===r||r===u||0===s||s===u?O.NONE:e.direction===c.UP||e.direction===c.DOWN?(n=t.some(function(e){return e.row===r&&e.column===s+1}),i=t.some(function(e){return e.row===r&&e.column===s-1}),n&&i?(
//two adjacent marbles so ray is reversed
e.direction=e.direction===c.UP?c.DOWN:c.UP,O.REVERSED):n?(
// one adjacent marble so head LEFT
e.direction=c.LEFT,O.DEFLECTED):i?(
// one adjacent marble so head RIGHT
e.direction=c.RIGHT,O.DEFLECTED):O.NONE):(
//ray is travelling LEFT or RIGHT
// ignore case where first propagated ray is encountered at edge
n=t.some(function(e){return e.row===r+1&&e.column===s}),i=t.some(function(e){return e.row===r-1&&e.column===s}),n&&i?(
//two adjacent marbles so ray is reversed
e.direction=e.direction===c.LEFT?c.RIGHT:c.LEFT,O.REVERSED):n?(
// one adjacent marble so head UP
e.direction=c.UP,O.DEFLECTED):i?(
// one adjacent marble so head DOWN
e.direction=c.DOWN,O.DEFLECTED):O.NONE)}function i(e,t){//first row. 2 extra slots to record ray outcomes at either end
for(var o=
// reset empty array without creating a new array
e.length=0;o<t+2;o++)e[o]=[],e[o].length=t+2}function r(e,t){for(var o=0;o<t+2;o++)e[o].fill(0)}function t(e,t,o,n){
// place marble according to row and column position
// if marble already placed then ignore request
// if max number of marbles would be exceeded then don't place marble
var i={};i.row=e,i.column=t,n.length<o&&(n.some(function(e){return e.row===i.row&&e.column===i.column})||n.push(i))}function s(e,t,o){for(var n,i=0;i<t;i++){for(n={};n.row=m.utility.getRandomIntInclusive(1,e),n.column=m.utility.getRandomIntInclusive(1,e),o.some(function(e){return e.row===n.row&&e.column===n.column}););o.push(n)}}function h(e,t){
// check if ray has already been shot from current location (i.e. duplicate)
return 0!==t[e.position.row][e.position.column]}function f(e,t){
// check if ray will hit a marble on next move
var o={};return o.row=e.position.row+e.direction.rowIncrement,o.column=e.position.column+e.direction.columnIncrement,t.some(function(e){return e.row===o.row&&e.column===o.column})}function y(e,t){var o=e.position.row,n=e.position.column,i=t+1;// check if ray has reached the rim
return 0===o||o===i||0===n||n===i}function E(e,t){var o=e.position.row,n=e.position.column,i=t+1;// check if ray is in a corner
return 0===o&&0===n||0===o&&n===i||o===i&&0===n||o===i&&n===i}function g(e,t){var o=e.position.row,n=e.position.column,i=t+1;return 0<o&&0<n&&o<i&&n<i}function b(e,t){var o=e.position.row,n=e.position.column,i=t+1;return o<0||n<0||i<o||i<n}// public API - constructor
function o(e,t,o){var n=0<arguments.length&&void 0!==e?e:8,i=1<arguments.length&&void 0!==t?t:4,r=2<arguments.length&&void 0!==o&&o;this.gameHasFinished=!1,this.grid=[],this.gridSize=n,this.guesses=[],this.marbles=[],this.numberOfMarbles=i,this.numberOfRays=0,this.turns=[],r&&this.newGame(this.gridSize,this.numberOfMarbles)}// public API - prototype methods
// define black box constants
var v={ABSORBED:"ray hit marble and was absorbed",CORNER:"ray is in a corner",DUPLICATE:"ray has already been shot",INSIDE:"ray is inside the black box",MARBLE_MAX:"marble ignored - maximum number already placed",MARBLE_PLACED:"marble has been placed",MARBLE_REMOVED:"marble has been removed",NOTHING:"no outcome",OUTSIDE:"ray is outside of the black box",PROPOGATED:"ray has reached the rim",REFLECTED:"ray has been reflected"},O={DEFLECTED:"ray has been deflected",NONE:"ray has not been deflected",REVERSED:"ray has been reversed"};o.prototype.allMarblesPlaced=function(){return this.guesses.length===this.numberOfMarbles},o.prototype.guess=function(e){for(var t=e.position.row,o=e.position.column,n=-1,i=0,r;r=this.guesses[i];i++)r.row===t&&r.column===o&&(
// that guess has already been made so remove guess
n=i);return-1<n?(this.guesses.splice(n,1),v.MARBLE_REMOVED):this.guesses.length<this.numberOfMarbles?(this.guesses.push(e.position),v.MARBLE_PLACED):v.MARBLE_MAX},o.prototype.newGame=function(e,t){var o=0<arguments.length&&void 0!==e?e:8,n=1<arguments.length&&void 0!==t?t:4;this.gameHasFinished=!1,this.grid=[],this.gridSize=o,this.guesses=[],this.marbles=[],this.numberOfMarbles=n,this.numberOfRays=0,this.turns=[],i(this.grid,this.gridSize),r(this.grid,this.gridSize),s(this.gridSize,this.numberOfMarbles,this.marbles)},o.prototype.scoreGame=function(){
// 1 point for each entry and exit location
// 5 points for each guess in the wrong location
// incomplete games will not be scored
var e,o;if(this.allMarblesPlaced()){o=0;// Add up the ray scores
for(var t=1;t<=this.gridSize;t++)0!==this.grid[0][t]&&o++,0!==this.grid[this.gridSize+1][t]&&o++,0!==this.grid[t][0]&&o++,0!==this.grid[t][this.gridSize+1]&&o++;// process the guesses
this.guesses.forEach(function(t){this.marbles.some(function(e){return e.row===t.row&&e.column===t.column})?this.grid[t.row][t.column]="y":(o+=5,this.grid[t.row][t.column]="n")},this);// cycle through grid and mark any marbles that were not found
for(var n=1;n<=this.gridSize;n++)for(var i=1;i<=this.gridSize;i++)1===this.grid[n][i]&&(this.grid[n][i]="x");this.gameHasFinished=!0}else e=this.numberOfMarbles-this.guesses.length,o="Make "+e.toString()+" more guess"+(1===e?"":"es")+" to get a score",this.gameHasFinished=!1;return o},o.prototype.shootRay=function(e){
// returns an object that gives the overall outcome
// and the path that the ray took
// {
//  outcome: SHOOT_RAY_OUTCOME,
//  path: array of Vectors,
//  rayNumber: the number of the ray
// }
var t={outcome:v.NOTHING,path:[],rayNumber:0},o,n=O.NONE,i=e.position.row,r=e.position.column,s=this.grid,u=this.gridSize,c=u+1,a=this.marbles,l=this.gameHasFinished,d=m.VECTOR.DIRECTION;if(// determine ray direction if not specified
e.direction===d.NONE&&(0===e.position.row?e.direction=d.DOWN:e.position.row===c?e.direction=d.UP:0===e.position.column?e.direction=d.RIGHT:e.position.column===c&&(e.direction=d.LEFT)),t.path.push(JSON.parse(JSON.stringify(e))),b(e,u))t.outcome=v.OUTSIDE;else if(E(e,u))t.outcome=v.CORNER;else if(g(e,u))this.gameHasFinished?t.outcome=v.INSIDE:t.outcome=this.guess(e);else if(h(e,s)&&!this.gameHasFinished)t.outcome=v.DUPLICATE;else
// shoot the ray
for(;f(e,a)?(this.gameHasFinished||(s[i][r]="a"),t.path.push(JSON.parse(JSON.stringify(e))),t.outcome=v.ABSORBED):(o=JSON.stringify(e),(n=p(e,a,u))!==O.NONE&&(1===t.path.length?(this.gameHasFinished||(s[i][r]="r"),t.outcome=v.REFLECTED):n===O.REVERSED&&(
// DONE: Path is not fully traced when reflected (missing a step) id:4 gh:5
t.path.push(JSON.parse(o)),t.path.push(JSON.parse(JSON.stringify(e)))))),t.outcome===v.NOTHING&&(e.move(),t.path.push(JSON.parse(JSON.stringify(e))),y(e,u)&&(e.position.row===i&&e.position.column===r?(this.gameHasFinished||(s[i][r]="r"),t.outcome=v.REFLECTED):(this.gameHasFinished||(this.numberOfRays++,s[e.position.row][e.position.column]=this.numberOfRays,s[i][r]=this.numberOfRays),t.outcome=v.PROPOGATED))),t.outcome===v.NOTHING;);return l?t.rayNumber=s[i][r]:(t.rayNumber=this.numberOfRays,t.outcome!==v.ABSORBED&&t.outcome!==v.REFLECTED&&t.outcome!==v.PROPOGATED||this.turns.push(t)),t},// Export to root (window in browser)
"function"==typeof define&&define.amd||("object"===("undefined"==typeof exports?"undefined":_typeof(exports))?(
// Node.js
module.exports.SHOOT_RAY_OUTCOME=v,module.exports.BlackBoxModel=o,"test"===process.env.NODE_ENV&&(module.exports.BlackBoxModel._private={checkForDeflectedRay:p,createGrid:i,initialiseGrid:r,placeMarbleOnGrid:t,placeMarblesRandomlyOnGrid:s,rayAlreadyShot:h,rayHasHitMarble:f,rayHasReachedRim:y,rayIsInCorner:E,rayIsInsideGrid:g,rayIsOutsideGrid:b})):(
// in the browser
(e=e||{}).BLACKBOX=e.BLACKBOX||{},e.BLACKBOX.SHOOT_RAY_OUTCOME=v,e.BLACKBOX.Model=o))}(void 0,(void 0).BLACKBOX),function(e,m,a){function u(e){var o,n,t,i,r;s&&(null!==(r=document.getElementById("svg"))&&0<(i=c(r.querySelectorAll("path"))).length&&(n=i.map(function(e){var t=e.getTotalLength();return e.style.strokeDasharray=t+" "+t,e.style.strokeDashoffset=t,e.style.visibility="visible",.03*Math.pow(t,.5)}),i[// triggering a reflow so styles are calculated in their
// start position, so they animate from here
o=0].getBoundingClientRect(),e&&i.forEach(function(e,t){e.style.transition=e.style.WebkitTransition="stroke-dashoffset "+n[t]+"s "+o+"s ease-in-out",e.style.strokeDashoffset="0",o+=n[t]+.1})),t=n.reduce(function(e,t){return e+t},.1*n.length+5),l=setTimeout(u,1e3*t,!e))}// end: SVG Animate
function p(e,t){var o,n,i,r,s=[],u,c,a,l;if(2<e.path.length){c=(u=100/t)/2,a=(n=e.path[0]).position.row,l=n.position.column,// move to start position of ray ("M x y")
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
s.push("a"),s.push(c),s.push(c),s.push(0),s.push(0),s.push(1),s.push(c),s.push(-c))}return s.join(" ")}function h(e,t,o,n){var i=!(3<arguments.length&&n!==a)||n,r=m.SHOOT_RAY_OUTCOME,s,u,c;switch(s=document.getElementsByTagName("svg")[0],(u=document.createElement("path")).setAttribute("d",e),u.style.visibility=i?"visible":"hidden",""!==o&&u.setAttribute("class",o),t){case r.ABSORBED:case r.REFLECTED:-1===s.innerHTML.search(u.outerHTML)?s.innerHTML+=u.outerHTML:s.innerHTML=s.innerHTML.replace(u.outerHTML,"");break;case r.PROPOGATED:(c=s.querySelectorAll("path."+o)[0])===a?s.innerHTML+=u.outerHTML:c.remove();break}}function f(){var e,t,o,n,i,r,s;null!==(i=document.getElementById("svg"))&&(
// resize the svg element
e=document.getElementById("blackbox"),t=parseInt(document.getElementById("inputGridSize").value),n=e.offsetWidth/(t+2),s=e.offsetWidth-2*n,r=e.offsetTop+n,o=n+e.offsetLeft,i.style.cssText="width: "+s+"px; top: "+r+"px; left: "+o+"px;")}function c(e){return Array.prototype.slice.call(e)}function t(){(this.view=this).validationHandlers(),this.bind("resizeBlackBox")}var l,s=((o=document.createElement("div")).innerHTML="<svg/>","http://www.w3.org/2000/svg"==(o.firstChild&&o.firstChild.namespaceURI)),o;// the following code is adapted from Jake Archibald's article on animating SVG paths
// https://jakearchibald.com/2013/animated-line-drawing-svg/
// begin: SVG Animate
document.documentElement.className+=s?" inline-svg":"",t.prototype.bind=function(e,t){var o,n,i,r,s,u,c,a,l,d;"animateRays"===e?((a=document.getElementById("radioAnimateRaysYes")).addEventListener("change",function(){t()}),(a=document.getElementById("radioAnimateRaysNo")).addEventListener("change",function(){t()})):"newGame"===e?(n=document.getElementById("buttonNewGame")).addEventListener("click",function(){u=parseInt(document.getElementById("inputGridSize").value),c=parseInt(document.getElementById("inputMarbles").value),t(u,c),document.getElementById("score").style.display="none",document.getElementById("animateRays").style.display="none"}):"scoreGame"===e?(i=document.getElementById("buttonScoreGame")).addEventListener("click",function(){d=t(),document.getElementById("scoreValue").innerHTML=d,document.getElementById("score").style.display="block",document.getElementById("animateRays").style.display="block"}):"shootRay"===e?(o=document.getElementById("blackbox")).addEventListener("click",function(e){"svg"!==(r=e.target).nodeName&&(l=parseInt(r.dataset.pos.split(",")[0]),s=parseInt(r.dataset.pos.split(",")[1]),t(new m.Vector(l,s)))}):"resizeBlackBox"===e&&window.addEventListener("resize",f)},t.prototype.renderAndAnimateAllRays=function(e,o){var n=m.SHOOT_RAY_OUTCOME,t,i,r,s;return(t="on"===document.querySelector('input[name="switch"]:checked').value)?(null!==(r=document.getElementById("svg"))&&0===(i=c(r.querySelectorAll("path"))).length&&e.forEach(function(e){var t;switch(e.outcome){case n.ABSORBED:t="hit";break;case n.MARBLE_PLACED:case n.MARBLE_REMOVED:t="guess";break;case n.PROPOGATED:t="ray-"+e.rayNumber;break;case n.REFLECTED:t="reflect";break}0<(s=p(e,o)).length&&h(s,e.outcome,t,!1)}),u(!0)):clearTimeout(l),t},t.prototype.renderGridConsole=function(e){var t;console.log();for(var o=0;o<e.length;o++){t="";for(var n=0;n<e.length;n++)t+=String(e[o][n])+"\t";console.log(t+"\t"+String(o))}},t.prototype.renderGrid=function(t,e,o,n,i,r){var s=document.getElementById("blackbox"),u,c,a,l=e+1;s.innerHTML="",s.className="blackbox grid grid-size-"+e;for(var d=0;d<=l;d++)for(var m=0;m<=l;m++){// render ray outcomes
switch(c=document.createElement("div"),a=["cell"],t[d][m]){case 0:
// no action required
break;case"a":a.push("hit");break;case"n":a.push("guess-wrong");break;case"r":a.push("reflect");break;case"x":a.push("not-found");break;case"y":a.push("guess-right");break;default:0!==d&&d!==l&&0!==m&&m!==l||a.push("ray-"+t[d][m])}o&&
// render marbles
r.forEach(function(e){parseInt(e.row)===d&&parseInt(e.column)===m&&0===t[d][m]&&a.push("guess")}),// set row and column data
c.dataset.pos=d+","+m,c.className=a.join(" "),s.appendChild(c)}o&&(
// overlay the inner grid with an SVG element so that we can draw
// the ray's path on top of the grid.
s.innerHTML+='<svg id="svg" viewBox="0 0 100 100"></svg>',window.setTimeout(f,0)),(// enable/disable score game button
u=document.getElementById("buttonScoreGame")).disabled=!(n&&!o)},t.prototype.renderShot=function(e,t,o,n){var i=m.SHOOT_RAY_OUTCOME,r,s="",u,c,a,l,d;switch(l=e.path[0].position.row+","+e.path[0].position.column,c=e.path[e.path.length-1].position.row+","+e.path[e.path.length-1].position.column,a=document.querySelectorAll("[data-pos='"+l+"']")[0],u=document.querySelectorAll("[data-pos='"+c+"']")[0],r=document.getElementById("buttonScoreGame"),e.outcome){case i.ABSORBED:s="hit";break;case i.MARBLE_PLACED:case i.MARBLE_REMOVED:s="guess";break;case i.PROPOGATED:s="ray-"+e.rayNumber;break;case i.REFLECTED:s="reflect";break}// if gameHasFinished then trace path of ray
if(o)0<(d=p(e,t)).length&&h(d,e.outcome,s);else switch(
// game has not finished
s=" "+s,e.outcome){case i.ABSORBED:case i.MARBLE_PLACED:case i.PROPOGATED:case i.REFLECTED:a.className+=s,e.outcome===i.PROPOGATED&&(u.className+=s);break;case i.MARBLE_REMOVED:a.className=a.className.replace(s,"");break}// enable/disable score game button
r.disabled=!(n&&!o)},t.prototype.validationHandlers=function(){var e=document.getElementById("inputGridSize"),t=document.getElementById("inputMarbles");e.addEventListener("focusout",function(e){var t=parseInt(e.currentTarget.value);t<6?e.currentTarget.value=6:16<t?e.currentTarget.value=16:isNaN(t)&&(e.currentTarget.value=8)}),t.addEventListener("focusout",function(e){var t=parseInt(document.getElementById("inputGridSize").value),o=parseInt(e.currentTarget.value);o<4?e.currentTarget.value=4:16<o?e.currentTarget.value=16:isNaN(o)&&(e.currentTarget.value=t-4)})},// Export to root (window in browser)
"function"==typeof define&&define.amd||("object"===("undefined"==typeof exports?"undefined":_typeof(exports))?
// Node.js
module.exports.BlackBoxView=t:(
// in the browser
(e=e||{}).BLACKBOX=e.BLACKBOX||{},e.BLACKBOX.View=t))}(void 0,(void 0).BLACKBOX),function(e){function t(e){e.animateRays=e.view.renderAndAnimateAllRays(e.model.turns,e.model.gridSize)}function o(e,t){var i=this;this.animateRays=!0,this.model=e,this.view=t,this.view.bind("animateRays",function(){i.onClickAnimateRays()}),this.view.bind("newGame",function(e,t){var o=0<arguments.length&&void 0!==e?e:8,n=1<arguments.length&&void 0!==t?t:4;i.onClickNewGame(o,n)}),this.view.bind("scoreGame",function(){return i.onClickScoreGame()}),this.view.bind("shootRay",function(e){return i.onClickShootRay(e)})}o.prototype.onClickAnimateRays=function(){t(this)},o.prototype.onClickNewGame=function(e,t){var o=0<arguments.length&&void 0!==e?e:8,n=1<arguments.length&&void 0!==t?t:4;this.model.newGame(o,n),this.renderViews()},o.prototype.onClickScoreGame=function(){var e=this.model.scoreGame();return this.renderViews(),this.animateRays&&setTimeout(t,3e3,this),e},o.prototype.onClickShootRay=function(e){var t=this.model.shootRay(e);this.view.renderShot(t,this.model.gridSize,this.model.gameHasFinished,this.model.allMarblesPlaced())},o.prototype.renderViews=function(){var e=this.model,t=JSON.parse(JSON.stringify(e.grid)),o=JSON.parse(JSON.stringify(e.guesses)),n=JSON.parse(JSON.stringify(e.marbles));this.view.renderGridConsole(t),this.view.renderGrid(t,e.gridSize,e.gameHasFinished,e.allMarblesPlaced(),o,n)},// Export to root (window in browser)
"function"==typeof define&&define.amd||("object"===("undefined"==typeof exports?"undefined":_typeof(exports))?
// Node.js
module.exports.BlackBoxController=o:(
// in the browser
(e=e||{}).BLACKBOX=e.BLACKBOX||{},e.BLACKBOX.Controller=o))}(void 0),function(e){var t=new e.Model(8,4,!0),o=new e.View,n;new e.Controller(t,o).renderViews()}((void 0).BLACKBOX);
//# sourceMappingURL=app.js.map
//# sourceMappingURL=app.js.map