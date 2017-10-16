(function(root) {

  var model = new BLACKBOX.Model(8, 4, true);
  var view = new BLACKBOX.View(model);

  var controller = new BLACKBOX.Controller(model, view);
  controller.initialise();

})(this);
