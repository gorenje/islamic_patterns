// 'Pro' == processing
// Because these things know how to draw themselves using processingJS.
var ProPoint = function(x,y) {
  this.x = x;
  this.y = y;
};

ProPoint.prototype = {
  distance: function( pt ) {
    return (this.minus(pt)).v_length();
  },

  v_length: function() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
  },
  
  equals: function( pt ) {
    return this.is_point(pt) && (this.x == pt.x && this.y == pt.y);
  },
  minus: function( pt ) {
    return new ProPoint( this.x - pt.x, this.y - pt.y );
  },
  plus: function( pt ) {
    return new ProPoint( this.x + pt.x, this.y + pt.y );
  },
  multiple: function( factor ) {
    return new ProPoint( this.x * factor, this.y * factor );
  },

  // return a point that is located between this point and the given point
  // defined by ratio (value between 0 and 1 inclusive). If ratio is greater
  // than 1, then a point beyond the line joining the points is returned
  point_on_segment: function( pt, ratio ) {
    if ( this.equals(pt) ) { return new ProPoint( pt.x, pt.y ); }
    return this.minus(this.minus(pt).multiple(ratio));
  },

  slope: function( pt ) {
    if (this.equals(pt) ) {
      throw "SamePointsError";
    } else if ( this.x == pt.x) {
      throw "PointsVerticalError";
    }
    return ( (this.y - pt.y) / (this.x - pt.x) );
  },

  clone: function() {
    return new ProPoint(this.x, this.y);
  },

  to_s: function() {
    return "Point: " + this.x + ", " + this.y;
  },

  is_point: function(obj) {
    return (obj.is_point != undefined);
  },

  closest: function( array_of_points ) {
    var ret_idx = 0;
    var min_distance = Infinity;
    for ( idx in array_of_points ) {
      var d = array_of_points[idx].distance( this );
      if ( d < min_distance ) { ret_idx = idx;  min_distance = d; }
    }
    return array_of_points[ret_idx];
  },
};

var ProOrigin = new ProPoint(0,0);

var ProCircle = function(center, radius) {
  this.cpt = center;
  this.radius = radius;
};

ProCircle.prototype = {
  center_pt: function() {
    return this.cpt.clone();
  },

  draw: function(context) {
    context.ellipse( this.cpt.x, this.cpt.y, this.radius*2, this.radius*2);
  },

  points: function( point_count ) {
    pts = [];
    delta = (2 * Math.PI) / point_count;
    for (var idx = 1; idx <= point_count; idx++) {
      pts.push( new ProPoint( this.radius * Math.cos( delta * idx ) + this.cpt.x,
                              this.radius * Math.sin( delta * idx ) + this.cpt.y ));
    }

    return pts;
  },

  distance: function( other_circle ) {
    return this.cpt.distance(other_circle.cpt);
  },

  equals: function( other_circle ) {
    return (this.is_circle(other_circle) && other_circle.cpt.equals(this.cpt) && 
            this.radius == other_circle.radius);
  },

  closest: function( array_of_points ) {
    return this.cpt.closest( array_of_points );
  },
  clone: function() {
    return new ProCircle( this.cpt.clone(), this.radius );
  },
  is_circle: function(obj) {
    return (obj.is_circle != undefined);
  },

  intersection: function( other_circle ) {
    var distance = this.distance(other_circle);
    var r0 = this.radius;
    var r1 = other_circle.radius;

    // don't intersect - too far apart
    if ( distance > (r0 + r1)) { return []; }
    // infinite number of solutions ... same circle
    if ( this.equals(other_circle) ) { return []; }
    // one circle is contained in the other - no intersection points
    if ( distance < Math.abs(r0 - r1)) { return []; }
    
    var a = ((r0*r0) - (r1*r1) + (distance * distance)) / (2 * distance);
    var h = Math.sqrt((r0*r0) - (a*a));

    var tpt = other_circle.cpt.minus(this.cpt);
    var dx = tpt.x;
    var dy = tpt.y;

    var twoPt = new ProPoint(this.cpt.x + (dx*a/distance), this.cpt.y + (dy*a/distance));
    var rPt = new ProPoint(-dy * (h/distance), dx * (h/distance));
    
    return [twoPt.plus(rPt), twoPt.minus(rPt)];
  }
};


var ProRect = function(pt1, pt2, pt3, pt4 ) {
  this._compute = function(pt1,pt2) {
    var d = pt1.distance(pt2);
    var radius = Math.sqrt((d*d)/2);
    return (new ProCircle(pt1,radius)).intersection(new ProCircle(pt2,radius));
  };

  this.points = [pt1, pt2, pt3, pt4];

  if ( pt2 == null && pt4 == null ) {
    var pts = this._compute(pt1, pt3);
    this.points = [pt1, pts[0], pt3, pts[1]];
  }

  this._sort_funct = function(a,b) {
    return ProOrigin.distance(a) < ProOrigin.distance(b);
  };
};

ProRect.prototype = {
  draw: function(context) {
    var p = this.points;
    context.quad( p[0].x, p[0].y, p[1].x, p[1].y, p[2].x, p[2].y, p[3].x, p[3].y);
  },
  
  is_rectangle: function( obj ) {
    return obj.is_rectangle != undefined;
  },
  
  create_copy_and_sort: function(ary) {
    var ret_ary = [];
    for ( idx in ary ) { ret_ary.push(ary[idx].clone()); }
    ret_ary.sort( this._sort_funct);
    return ret_ary;
  },

  compare_two_arrays: function(ary1, ary2) {
    if ( ary1.length != ary2.length ) { return false; }
    var cary1 = this.create_copy_and_sort(ary1);
    var cary2 = this.create_copy_and_sort(ary2);
    for ( idx in cary1 ) {
      if (!cary1[idx].equals(cary2[idx])) { return false; }
    } 
    return true;
  },

  equals: function( obj) {
    return this.is_rectangle(obj) && this.compare_two_arrays(this.points, obj.points);
  }
};

var ProTriangle = function(pt1, pt2, pt3) {
  this.points = [pt1, pt2, pt3];
  this._sort_funct = function(a,b) {
    return ProOrigin.distance(a) < ProOrigin.distance(b);
  };
};

ProTriangle.prototype = {
  draw: function(context) {
    var p = this.points;
    context.triangle( p[0].x, p[0].y, p[1].x, p[1].y, p[2].x, p[2].y);
  },
  
  is_triangle: function( obj ) {
    return obj.is_triangle != undefined;
  },
  
  create_copy_and_sort: function(ary) {
    var ret_ary = [];
    for ( idx in ary ) { ret_ary.push(ary[idx].clone()); }
    ret_ary.sort( this._sort_funct);
    return ret_ary;
  },

  compare_two_arrays: function(ary1, ary2) {
    if ( ary1.length != ary2.length ) { return false; }
    var cary1 = this.create_copy_and_sort(ary1);
    var cary2 = this.create_copy_and_sort(ary2);
    for ( idx in cary1 ) {
      if (!cary1[idx].equals(cary2[idx])) { return false; }
    } 
    return true;
  },

  equals: function(obj) {
    return this.is_triangle(obj) && this.compare_two_arrays(this.points, obj.points);
  }
};

var ProColorSetting = function(operation) {
  this.operation = operation;
};
ProColorSetting.prototype = {
  draw: function(context) {
    eval("context."+this.operation);
  },
  equals: function(obj) {
    return false;
  }
};

var ProDrawStack = function() {
  this.stack = [];
};

ProDrawStack.prototype = {
  clear: function () {
    this.stack = [];
  },
  draw: function(context) {
    for ( idx in this.stack ) {
      this.stack[idx].draw(context);
    }
  },

  push: function(obj) {
//     if ( ! this.contains_obj(obj) ) { 
      this.stack.push(obj); 
//     }
  },

  contains_obj: function( obj) {
    for (idx in this.stack) {
      if ( this.stack[idx].equals(obj) ) {
        return true;
      }
    }
    return false;
  }
};
