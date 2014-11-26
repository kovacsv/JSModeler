PolygonDrawer = function ()
{
	this.canvas = null;
	this.context = null;
	this.width = null;
	this.height = null;
	this.options = null;
};

PolygonDrawer.prototype.Init = function (parent, width, height, options)
{
	this.canvas = document.createElement ('canvas');
	this.canvas.width = width;
	this.canvas.height = height;
	
	this.context = this.canvas.getContext ('2d');
	this.width = width;
	this.height = height;
	
	this.options = {
		drawIndices : false
	};
	if (options !== undefined && options !== null) {
		if (options.drawIndices !== undefined && options.drawIndices !== null) {
			this.options.drawIndices = options.drawIndices;
		}
	}
	
	parent.appendChild (this.canvas);
};

PolygonDrawer.prototype.DrawPolygon = function (polygon, scale)
{
	function GetCoord (drawer, coord, scale)
	{
		var centerX = parseInt (drawer.width / 2.0, 10);
		var centerY = parseInt (drawer.height / 2.0, 10);
		var scaled = [coord[0] * scale, coord[1] * scale];
		return [centerX + scaled[0], drawer.height - (centerY + scaled[1])];
	}

	function DrawCoordSystem (drawer)
	{
		var from, to;
		var halfWidth = parseInt (drawer.width / 2.0, 10);
		var halfHeight = parseInt (drawer.height / 2.0, 10);
		
		drawer.context.strokeStyle = '#cccccc';
		drawer.context.beginPath ();
		
		from = GetCoord (drawer, [-halfWidth, 0], 1);
		to = GetCoord (drawer, [halfWidth, 0], 1);
		drawer.context.moveTo (from[0], from[1]);
		drawer.context.lineTo (to[0], to[1]);

		from = GetCoord (drawer, [0, -halfHeight], 1);
		to = GetCoord (drawer, [0, halfHeight], 1);
		drawer.context.moveTo (from[0], from[1]);
		drawer.context.lineTo (to[0], to[1]);
		
		drawer.context.closePath ();
		drawer.context.stroke ();
	}

	function DrawPolygon (drawer, polygon, scale)
	{
		drawer.context.fillStyle = '#dedecd';
		drawer.context.strokeStyle = '#000000';
		
		drawer.context.beginPath ();
	
		var i, current;
		for (i = 0; i < polygon.length; i++) {
			current = GetCoord (drawer, polygon[i], scale);
			if (i === 0) {
				drawer.context.moveTo (current[0], current[1]);
			} else {
				drawer.context.lineTo (current[0], current[1]);
			}
		}
		
		drawer.context.closePath ();
		
		drawer.context.fill ();
		drawer.context.stroke ();
	}

	function DrawIndices (drawer, polygon, scale)
	{
		drawer.context.fillStyle = '#000000';
		drawer.context.font = '12px Arial';
		
		drawer.context.beginPath ();
	
		var i, current;
		for (i = 0; i < polygon.length; i++) {
			current = GetCoord (drawer, polygon[i], scale);
			drawer.context.fillText (i, current[0] + 5, current[1] + 5);
		}
		
		drawer.context.closePath ();
		
		drawer.context.fill ();
	}

	this.context.save ();
	this.context.translate (0.5, 0.5);
	this.context.clearRect (0, 0, this.width, this.height);
	
	DrawCoordSystem (this);
	DrawPolygon (this, polygon, scale);
	if (this.options.drawIndices) {
		DrawIndices (this, polygon, scale);
	}
	
	this.context.restore ();
};
