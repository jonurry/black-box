// @codekit-prepend "utility.js";
// @codekit-prepend "vector.js";
// @codekit-prepend "model.js";
// @codekit-prepend "view.js";
// @codekit-prepend "controller.js";

!(function(BLACKBOX) {
  "use strict";

  var model = new BLACKBOX.Model(8, 4, true);
  var view = new BLACKBOX.View();
  var controller = new BLACKBOX.Controller(model, view);
  controller.renderViews();
})(this.BLACKBOX);
