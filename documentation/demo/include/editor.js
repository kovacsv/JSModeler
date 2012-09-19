Editor = function ()
{
	this.canvas = null;
	this.context = null;
	
	this.coords = null;
	this.current = null;
	this.finished = null;
	
	this.settings = null;
};

Editor.prototype =
{
	Initialize : function (canvasName, settings)
	{
		this.canvas = document.getElementById (canvasName);
		this.context = this.canvas.getContext ('2d');
		
		this.coords = [];
		this.current = [0, 0];
		this.finished = false;
			
		if (!this.canvas || !this.context) {
			return false;
		}

		var myThis = this;
		document.onmousemove = function (event) {myThis.OnMouseMove (event);};
		this.canvas.onmousedown = function (event) {myThis.OnMouseDown (event);};

		this.settings = {
			mode : 'Polygon',
			color : '#00aa00'
		};
	
		if (settings != undefined) {
			if (settings.mode != undefined) this.settings.mode = settings.mode;
			if (settings.color != undefined) this.settings.color = settings.color;
		}
		
		this.Draw ();
		return true;
	},

	AddCoord : function (coord)
	{
		var marker = this.GetMarker ();
		if (this.CoordDistance (coord, marker) < 10) {
			this.finished = true;
			this.Draw ();
			return;
		}

		this.coords.push (coord);
		this.Draw ();
	},
	
	Draw : function ()
	{
		this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
		
		this.context.fillStyle = '#ffffff';
		this.context.fillRect (0, 0, this.canvas.width, this.canvas.height);
		
		this.DrawCoords ();
		this.DrawMarker ();
		
		return true;
	},
	
	DrawCoords : function ()
	{
		if (this.coords.length == 0) {
			return false;
		}
	
		if (this.settings.mode == 'Polygon') {
			this.context.fillStyle = this.settings.color;
		}
		this.context.beginPath ();

		var firstCoord = this.coords[0];
		this.context.moveTo (firstCoord[0], firstCoord[1]);
		
		var i, vertex;
		for (i = 1; i < this.coords.length; i++) {
			vertex = this.coords[i];
			this.context.lineTo (vertex[0], vertex[1]);
		}
		
		if (!this.finished) {
			this.context.lineTo (this.current[0], this.current[1]);
		} else {
			if (this.settings.mode == 'Polygon') {
				this.context.lineTo (firstCoord[0], firstCoord[1]);
				this.context.fill ();
			}
		}
		
		this.context.stroke ();
		return true;
	},

	DrawMarker : function ()
	{
		if (this.coords.length == 0 || this.finished) {
			return false;
		}
	
		var marker = this.GetMarker ();
		if (this.CoordDistance (this.current, marker) > 10) {
			return false;
		}

		this.context.fillStyle = this.settings.color;
		this.context.beginPath();
		this.context.arc (marker[0], marker[1], 5, 0, 2.0 * Math.PI, true); 
		this.context.closePath();
		this.context.fill();

		return true;
	},

	GetMarker : function ()
	{
		if (this.coords.length == 0) {
			return [0, 0];
		}
		
		if (this.settings.mode == 'Polygon') {
			return this.coords[0];
		} else if (this.settings.mode == 'Polyline') {
			return this.coords[this.coords.length - 1];
		}
		return [0, 0];
	},

	GetMouseCoords : function (event)
	{
		var eventParameters = event;
		if (eventParameters === undefined) {
			eventParameters = window.event;
		}

		var x = eventParameters.clientX - this.canvas.offsetLeft;
		var y = eventParameters.clientY - this.canvas.offsetTop;
		return [x, y];
	},

	OnMouseDown : function (event)
	{
		if (this.finished) {
			this.coords = [];
			this.finished = false;
		}
	
		var mousePosition = this.GetMouseCoords (event);
		this.AddCoord (mousePosition);
		this.Draw ();
	},

	OnMouseMove : function (event)
	{
		var mousePosition = this.GetMouseCoords (event);
		this.current = mousePosition;
		this.Draw ();
	},
	
	CoordDistance : function (a, b)
	{
		var x1 = a[0];
		var y1 = a[1];
		var x2 = b[0];
		var y2 = b[1];
	
		return Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	}
};
