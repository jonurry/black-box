;!(function(root) {
  'use strict';

  var model = new BLACKBOX.Model(8, 4, true);
  var view = new BLACKBOX.View();
  var controller = new BLACKBOX.Controller(model, view);
  controller.renderViews();

})(this);
