PolygonDrawer = function ()
{
	this.canvas = null;
	this.context = null;
	this.width = null;
	this.height = null;
	this.scale = null;
};

PolygonDrawer.prototype.Init = function (parent, width, height, scale)
{
	this.canvas = document.createElement ('canvas');
	this.canvas.width = width;
	this.canvas.height = height;
	
	this.context = this.canvas.getContext ('2d');
	this.context.translate (0.5, 0.5);
	this.context.clearRect (0, 0, this.width, this.height);

	this.width = width;
	this.height = height;
	this.scale = scale;
	
	parent.appendChild (this.canvas);
};

PolygonDrawer.prototype.DrawCoordSystem = function ()
{
	var from, to;
	var halfWidth = parseInt (this.width / 2.0, 10);
	var halfHeight = parseInt (this.height / 2.0, 10);
	
	this.context.strokeStyle = '#cccccc';
	this.context.beginPath ();
	
	from = this.GetCoord ([-halfWidth, 0], 1.0);
	to = this.GetCoord ([halfWidth, 0], 1.0);
	this.context.moveTo (from[0], from[1]);
	this.context.lineTo (to[0], to[1]);

	from = this.GetCoord ([0, -halfHeight], 1.0);
	to = this.GetCoord ([0, halfHeight], 1.0);
	this.context.moveTo (from[0], from[1]);
	this.context.lineTo (to[0], to[1]);
	
	this.context.closePath ();
	this.context.stroke ();
};

PolygonDrawer.prototype.DrawPolygon = function (polygon, fillStyle, strokeStyle)
{
	this.DrawPolygonInternal (polygon, fillStyle, strokeStyle, true);
};

PolygonDrawer.prototype.DrawPolyline = function (polygon, fillStyle, strokeStyle)
{
	this.DrawPolygonInternal (polygon, fillStyle, strokeStyle, false);
};

PolygonDrawer.prototype.DrawPolygonInternal = function (polygon, fillStyle, strokeStyle, onlyLines)
{
	this.context.fillStyle = fillStyle;
	this.context.strokeStyle = strokeStyle;
	this.context.beginPath ();

	var needMove = true;
	var i, current;
	for (i = 0; i < polygon.length; i++) {
		current = this.GetCoord (polygon[i], this.scale);
		if (current === null) {
			needMove = true;
			continue;
		}
		if (needMove) {
			this.context.moveTo (current[0], current[1]);
			needMove = false;
		} else {
			this.context.lineTo (current[0], current[1]);
		}
	}
	
	if (onlyLines) {
		this.context.closePath ();
		this.context.fill ();
	}
	this.context.stroke ();
};

PolygonDrawer.prototype.DrawIndices = function (polygon)
{
	this.context.fillStyle = '#000000';
	this.context.font = '12px Arial';
	this.context.beginPath ();

	var i, current;
	for (i = 0; i < polygon.length; i++) {
		current = this.GetCoord (polygon[i], this.scale);
		if (current === null) {
			continue;
		}
		this.context.fillText (i, current[0] + 5, current[1] + 5);
	}
	
	this.context.closePath ();
	this.context.fill ();
};

PolygonDrawer.prototype.GetCoord = function (coord, scale)
{
	if (coord === null) {
		return null;
	}
	var centerX = parseInt (this.width / 2.0, 10);
	var centerY = parseInt (this.height / 2.0, 10);
	var scaled = [coord[0] * scale, coord[1] * scale];
	return [centerX + scaled[0], this.height - (centerY + scaled[1])];
};
