JSM.Camera = function (eye, center, up)
{
	this.origo = new JSM.Coord (center[0], center[1], center[2]);
	this.eye = new JSM.Coord (eye[0], eye[1], eye[2]);
	this.center = new JSM.Coord (center[0], center[1], center[2]);
	this.up = new JSM.Coord (up[0], up[1], up[2]);
	this.fixUp = true;
	this.orbit = true;
	this.zoom = true;
};

JSM.Camera.prototype = 
{
	SetFixUp : function (fixUp)
	{
		this.fixUp = fixUp;
	},

	SetOrbitEnabled : function (orbit)
	{
		this.orbit = orbit;
	},
	
	SetZoomEnabled : function (zoom)
	{
		this.zoom = zoom;
	},
	
	Zoom : function (zoomIn)
	{
		if (!this.zoom) {
			return;
		}
	
		var direction = JSM.CoordSub (this.center, this.eye);
		var distance = JSM.VectorLength (direction);
		if (zoomIn && distance < 0.1) {
			return 0;
		}

		var move = distance * 0.1;
		if (!zoomIn) {
			move = move * -1.0;
		}

		this.eye = JSM.CoordOffset (this.eye, direction, move);
	},

	Orbit : function (angleX, angleY)
	{
		if (!this.orbit) {
			return;
		}
	
		var radAngleX = angleX * JSM.DegRad;
		var radAngleY = angleY * JSM.DegRad;
	
		var viewDirection = JSM.VectorNormalize (JSM.CoordSub (this.center, this.eye));
		var horizontalDirection = JSM.VectorNormalize (JSM.VectorCross (viewDirection, this.up));
		var verticalDirection = JSM.VectorNormalize (JSM.VectorCross (horizontalDirection, viewDirection));
		
		if (this.fixUp) {
			var originalAngle = JSM.GetVectorsAngle (viewDirection, this.up);
			var angleLimit = 5.0 * JSM.DegRad;
			if ((originalAngle > Math.PI - angleLimit && radAngleY < 0) ||
				(originalAngle < angleLimit && radAngleY > 0)) {
				return;
			}
		}

		this.eye = JSM.CoordRotate (this.eye, verticalDirection, radAngleX, this.origo);
		this.center = JSM.CoordRotate (this.center, verticalDirection, radAngleX, this.origo);
		
		viewDirection = JSM.VectorNormalize (JSM.CoordSub (this.center, this.eye));
		horizontalDirection = JSM.VectorNormalize (JSM.VectorCross (viewDirection, verticalDirection));
		
		this.eye = JSM.CoordRotate (this.eye, horizontalDirection, radAngleY, this.origo);
		this.center = JSM.CoordRotate (this.center, horizontalDirection, radAngleY, this.origo);
		if (!this.fixUp) {
			this.up = verticalDirection;
		}
	},
	
	Clone : function ()
	{
		var result = new JSM.Camera ();
		result.origo = this.origo;
		result.eye = this.eye;
		result.center = this.center;
		result.up = this.up;
		result.orbit = this.orbit;
		result.zoom = this.zoom;
		return result;
	}
};
