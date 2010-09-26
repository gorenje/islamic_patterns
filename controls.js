function ctrl_redraw() {
  var cnvs_container = document.getElementById('canvas_container');
  var datasrc = "pattern_" + document.getElementById('pattern_selection').value + ".pjs";
  var regexp = new RegExp(datasrc);

  if ( !regexp.test(cnvs_container.innerHTML) ) {
    cnvs_container.innerHTML = '<canvas id="the_canvas" datasrc="'+datasrc+'"></canvas>';
    Processing.reload();
  }
  
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

function ctrl_show_guides(obj) {
  return false;
}
