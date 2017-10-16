(function(root) {

  var util = {
    getRandomIntInclusive: function(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
    }
  }

  // Export to root (window in browser)
  if (typeof define === 'function' && define.amd) {
    // requireJS
    // define(VECTOR);
    // define(Vector);
  } else if (typeof exports === 'object') {
    // Node.js
    module.exports.blackBoxUtil = util;
  } else {
    // in the browser
    root = root || {};
    root.BLACKBOX = root.BLACKBOX || {};
    root.BLACKBOX.utility = util;
  }

})(this);
