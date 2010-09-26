function ctrl_redraw() {
  var cnvs_container = document.getElementById('canvas_container');
  var pattern_num = document.getElementById('pattern_selection').value;
  cnvs_container.innerHTML = '<canvas id="the_canvas" width="600" height="600" datasrc="pattern_' + pattern_num + '.pjs"></canvas>';
  Processing.reload();
  
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
