function ctrl_redraw() {
  var cnvs = Processing.getInstanceById('the_canvas');
  cnvs.setup();
  cnvs.loop();
  return false;
}

function ctrl_set_just_one_circle(obj) {
  var cnvs = document.getElementById('the_canvas');
  cnvs.set_just_one_circle(obj.checked);
  return false;
}
