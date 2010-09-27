// Set this to 0 to see all the guiding circles and triangles, set to 3
// to see just the end result.
var cnvs = document.getElementById('the_canvas');
if ( cnvs.just_one_circle == undefined ) cnvs.just_one_circle = false;
if ( cnvs.number_of_subcircles == undefined ) cnvs.number_of_subcircles = 6;
if ( cnvs.bgcolour == undefined) cnvs.bgcolour = 0;

cnvs.set_just_one_circle = function(val) {
  this.just_one_circle = val;
};

cnvs.setup_circle = function(val) {
  if ( this.base_radius == undefined ) {
    this.base_radius = this.just_one_circle ? 150 : 75;
  }
  this.master_circle = new MasterCircle(new ProPoint(300,300), this.base_radius, 
                                        this.number_of_subcircles);
};

var info = document.getElementById("phase_current");

void setup() {
  cnvs.phase = 0;
  cnvs.setup_circle();

  size(600, 600);
  frameRate(1);
  background(cnvs.bgcolour);
};

void draw() {
  cnvs.phase += 1;
  info.innerHTML = "Frame: " + cnvs.phase;

  if ( cnvs.just_one_circle ) {
    eval( "cnvs.master_circle.draw_phase_" + cnvs.phase + "(this)");
  } else {
    var masters = cnvs.master_circle.new_masters();
    for ( idx in masters ) {
      eval( "masters[idx].draw_phase_" + cnvs.phase + "(this)");
      var m2 = masters[idx].new_masters();
      for ( idx2 in m2) {
        eval( "m2[idx2].draw_phase_" + cnvs.phase + "(this)");
        var m3 = m2[idx2].new_masters();
        for ( idx3 in m3) {
          eval( "m3[idx3].draw_phase_" + cnvs.phase + "(this)");
        }
      }
    }
  }
};
