JSM.Camera = function ()
{
	this.origo = null;
	this.eye = null;
	this.center = null;
	this.up = null;
};

JSM.Camera.prototype = 
{
	Init : function (eye, center, up)
	{
		this.origo = new JSM.Coord (center[0], center[1], center[2]);
		this.eye = new JSM.Coord (eye[0], eye[1], eye[2]);
		this.center = new JSM.Coord (center[0], center[1], center[2]);
		this.up = new JSM.Coord (up[0], up[1], up[2]);
	},

	Zoom : function (zoomIn)
	{
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

	Pan : function (distanceX, distanceY)
	{
		var viewDirection = JSM.VectorNormalize (JSM.CoordSub (this.center, this.eye));
		var horizontalDirection = JSM.VectorNormalize (JSM.VectorCross (viewDirection, this.up));
		var verticalDirection = JSM.VectorNormalize (JSM.VectorCross (horizontalDirection, viewDirection));

		this.eye = JSM.CoordOffset (this.eye, verticalDirection, distanceY);
		this.eye = JSM.CoordOffset (this.eye, horizontalDirection, distanceX);
		this.center = JSM.CoordOffset (this.center, verticalDirection, distanceY);
		this.center = JSM.CoordOffset (this.center, horizontalDirection, distanceX);
	},
	
	Orbit : function (angleX, angleY)
	{
		var radAngleX = angleX * JSM.DegRad;
		var radAngleY = angleY * JSM.DegRad;
	
		var viewDirection = JSM.VectorNormalize (JSM.CoordSub (this.center, this.eye));
		var horizontalDirection = JSM.VectorNormalize (JSM.VectorCross (viewDirection, this.up));
		var verticalDirection = JSM.VectorNormalize (JSM.VectorCross (horizontalDirection, viewDirection));

		this.eye = JSM.CoordRotate (this.eye, verticalDirection, radAngleX, this.origo);
		this.center = JSM.CoordRotate (this.center, verticalDirection, radAngleX, this.origo);
		
		viewDirection = JSM.VectorNormalize (JSM.CoordSub (this.center, this.eye));
		horizontalDirection = JSM.VectorNormalize (JSM.VectorCross (viewDirection, verticalDirection));
		
		this.eye = JSM.CoordRotate (this.eye, horizontalDirection, radAngleY, this.origo);
		this.center = JSM.CoordRotate (this.center, horizontalDirection, radAngleY, this.origo);

		this.up = verticalDirection;
	}
};
