JSM.Parameter = function (name, type, value, side)
{
	this.name = name;
	this.type = type;
	this.value = value;
	this.side = side;
};

JSM.TextControl = function ()
{
	this.input = null;
	this.settings = null;
};

JSM.TextControl.prototype =
{
	Create : function (div, parameter)
	{
		this.InitSettings ();
		
		this.input = document.createElement ('input');
		div.appendChild (this.input);
		this.input.type = 'text';
		this.input.value = parameter.value;
		this.input.style.width = this.settings.inputs.width;
	},

	GetValue : function (parameter)
	{
		parameter.value = this.input.value;
	},
	
	InitSettings : function ()
	{
		this.settings = {
			inputs : {
				width : '175px'
			}
		};
	}
}

JSM.CheckControl = function ()
{
	this.input = null;
	this.settings = null;
};

JSM.CheckControl.prototype =
{
	Create : function (div, parameter)
	{
		this.InitSettings ();
		
		this.input = document.createElement ('input');
		div.appendChild (this.input);
		this.input.type = 'checkbox';
		this.input.checked = parameter.value;
	},

	GetValue : function (parameter)
	{
		parameter.value = this.input.checked;
	},
	
	InitSettings : function ()
	{
		
	}
}

JSM.CoordControl = function ()
{
	this.inputs = null;
	this.settings = null;
};

JSM.CoordControl.prototype =
{
	Create : function (div, parameter)
	{
		this.inputs = [];
		this.InitSettings ();
		
		var xInput = document.createElement ('input');
		div.appendChild (xInput);
		xInput.type = 'text';
		xInput.value = parameter.value[0];
		xInput.style.width = this.settings.inputs.width;
		xInput.style.marginRight = this.settings.inputs.margin;
		this.inputs.push (xInput);

		var yInput = document.createElement ('input');
		div.appendChild (yInput);
		yInput.type = 'text';
		yInput.value = parameter.value[1];
		yInput.style.width = this.settings.inputs.width;
		yInput.style.marginRight = this.settings.inputs.margin;
		this.inputs.push (yInput);

		var zInput = document.createElement ('input');
		div.appendChild (zInput);
		zInput.type = 'text';
		zInput.value = parameter.value[2];
		zInput.style.width = this.settings.inputs.width;
		this.inputs.push (zInput);
	},

	GetValue : function (parameter)
	{
		parameter.value[0] = this.inputs[0].value;
		parameter.value[1] = this.inputs[1].value;
		parameter.value[2] = this.inputs[2].value;
	},
	
	InitSettings : function ()
	{
		this.settings = {
			inputs : {
				width : '50px',
				margin : '6px'
			}
		};
	}
}

JSM.ColorControl = function ()
{
	this.input = null;
	this.preview = null;
	this.settings = null;
};

JSM.ColorControl.prototype =
{
	Create : function (div, parameter)
	{
		this.InitSettings ();
		
		this.input = document.createElement ('input');
		div.appendChild (this.input);
		this.input.type = 'text';
		this.input.value = parameter.value;
		this.input.style.width = this.settings.inputs.width;
		this.input.style.marginRight = this.settings.inputs.margin;
		if (this.input.addEventListener) {
			var myThis = this;
			this.input.addEventListener ('keyup', function () {myThis.ColorChanged ();});
		}
		
		this.preview = document.createElement ('div');
		div.appendChild (this.preview);
		this.preview.style.width = this.settings.preview.width;
		this.preview.style.height = this.settings.preview.height;
		this.preview.style.cssFloat = this.settings.preview.cssFloat;
		this.ColorChanged ();
	},
	
	GetValue : function (parameter)
	{
		parameter.value = this.input.value;
	},

	ColorChanged : function ()
	{
		if (this.input.value.length == 6) {
			this.preview.style.background = '#' + this.input.value;
		}
	},
	
	InitSettings : function ()
	{
		this.settings = {
			inputs : {
				width : '125px',
				margin : '5px'
			},
			preview : {
				width : '42px',
				height : '21px',
				cssFloat : 'right'
			}
		};
	}
}

JSM.PolygonControl = function ()
{
	this.canvas = null;
	this.context = null;
	this.scaleInput = null;
	this.snapInput = null;
	this.coordViewer = null;
	this.settings = null;
	
	this.coords = null;
	this.current = null;
	this.marker = null;
	this.moved = null;

	this.mode = null;
};

JSM.PolygonControl.prototype =
{
	Create : function (div, parameter)
	{
		this.InitSettings ();

		var controlsTable = document.createElement ('table');
		div.appendChild (controlsTable);
		controlsTable.style.marginBottom = this.settings.controls.margin;
		controlsTable.style.width = this.settings.controls.tableWidth;
		controlsTable.style.cellPadding = this.settings.controls.tableCellPadding;
		
		var controlsTopRow = document.createElement ('tr');
		controlsTable.appendChild (controlsTopRow);

		var controlsLeft = document.createElement ('td');
		controlsTopRow.appendChild (controlsLeft);
		controlsLeft.style.textAlign = 'left';
		
		var scaleText = document.createElement ('span');
		controlsLeft.appendChild (scaleText);
		scaleText.innerHTML = 'scale: ';
		
		this.scaleInput = document.createElement ('input');
		controlsLeft.appendChild (this.scaleInput);
		this.scaleInput.type = 'text';
		this.scaleInput.value = parameter.value[0];
		this.scaleInput.style.width = this.settings.controls.scaleInputWidth;
		
		var controlsRight = document.createElement ('td');
		controlsTopRow.appendChild (controlsRight);
		controlsRight.style.textAlign = 'right';
	
		this.snapInput = document.createElement ('input');
		controlsRight.appendChild (this.snapInput);
		this.snapInput.type = 'checkbox';
		this.snapInput.checked = false;

		var snapText = document.createElement ('span');
		controlsRight.appendChild (snapText);
		snapText.innerHTML = 'snap to grid';

		this.canvas = document.createElement ('canvas');
		div.appendChild (this.canvas);
		this.canvas.width = this.settings.editor.width;
		this.canvas.height = this.settings.editor.height;
		this.canvas.style.border = this.settings.editor.border;
		if (this.canvas.addEventListener) {
			var myThis = this;
			this.canvas.addEventListener ('mousemove', function (event) {myThis.MouseMove (event);});
			this.canvas.addEventListener ('mousedown', function (event) {myThis.MouseDown (event);});
			this.canvas.addEventListener ('mouseup', function (event) {myThis.MouseUp (event);});
		}

		this.coordViewer = document.createElement ('div');
		div.appendChild (this.coordViewer);
		this.coordViewer.style.marginTop = this.settings.coordViewer.margin;
		this.coordViewer.style.textAlign = this.settings.coordViewer.textAlign;
		
		this.SetCurrentCoord (new JSM.Coord2D ());
		this.context = this.canvas.getContext ('2d');
		this.coords = [];
		var i;
		for (i = 0; i < parameter.value[1].length; i++) {
			this.coords.push (this.GetEditorCoord (parameter.value[1][i]));
		}
		
		this.mode = 'HasPolygon';
		this.marker = -1;
		this.moved = -1;
		this.Draw ();
	},
	
	GetValue : function (parameter)
	{
		parameter.value = [this.scaleInput.value, []];
		if (this.mode == 'HasPolygon') {
			for (i = 0; i < this.coords.length; i++) {
				parameter.value[1].push (this.GetModelCoord (this.coords[i]));
			}
		}
	},

	GetMouseCoord : function (event)
	{
		var eventParameters = event;
		if (eventParameters === undefined) {
			eventParameters = window.event;
		}
		
		var xCoord = eventParameters.clientX;
		var yCoord = eventParameters.clientY;
		var parent = this.canvas;
		while (parent) {
			xCoord -= parent.offsetLeft;
			yCoord -= parent.offsetTop;
			parent = parent.offsetParent;
		}
		
		if (this.snapInput.checked) {
			xCoord -= xCoord % this.settings.editor.gridStep;
			yCoord -= yCoord % this.settings.editor.gridStep;
		}		
		return new JSM.Coord2D (xCoord, yCoord);
	},

	MouseMove : function (event)
	{
		var mouseCoord = this.GetMouseCoord (event);
		this.SetCurrentCoord (mouseCoord);
		if (this.mode == 'MoveCoord') {
			this.MoveCoord (mouseCoord);
		}
		this.UpdateMarker (mouseCoord);
		this.Draw ();
	},
	
	MouseDown : function (event)
	{
		var mouseCoord = this.GetMouseCoord (event);
		if (this.mode == 'CreatePolygon') {
			this.AddCoord (this.current);
		} else if (this.mode == 'HasPolygon') {
			if (this.coords.length < 2 || this.marker == -1) {
				this.coords = [];
				this.mode = 'CreatePolygon';
				this.AddCoord (this.current);
			} else if (this.marker != -1) {
				this.mode = 'MoveCoord';
				this.moved = this.marker;
			}
		}
		this.UpdateMarker (mouseCoord);
		this.Draw ();
	},
	
	MouseUp : function (event)
	{
		if (this.mode == 'MoveCoord') {
			this.mode = 'HasPolygon';
		}
	},

	AddCoord : function (mouseCoord)
	{
		if (this.mode == 'CreatePolygon') {
			if (this.coords.length < 2 || this.marker == -1) {
				var canAddCoord = false;
				if (this.coords.length == 0) {
					canAddCoord = true;
				} else {
					var lastCoord = this.coords[this.coords.length - 1];
					if (!JSM.CoordIsEqual2D (lastCoord, mouseCoord)) {
						canAddCoord = true;
					}
				}
				if (canAddCoord) {
					this.coords.push (mouseCoord);
				}
			} else {
				this.mode = 'HasPolygon';
			}
		}
	},
	
	MoveCoord : function (mouseCoord)
	{
		if (this.mode == 'MoveCoord') {
			this.coords[this.moved] = mouseCoord;
		}
	},

	UpdateMarker : function (mouseCoord)
	{
		this.marker = -1;
		if (this.coords.length < 3) {
			return;
		}
		
		if (this.mode == 'CreatePolygon') {
			if (JSM.CoordDistance2D (mouseCoord, this.coords[0]) < this.settings.editor.gridStep) {
				this.marker = 0;
			}
		} else if (this.mode == 'HasPolygon') {
			var i;
			for (i = 0; i < this.coords.length; i++) {
				if (JSM.CoordDistance2D (mouseCoord, this.coords[i]) < this.settings.editor.gridStep) {
					this.marker = i;
					break;
				}
			}
		}
	},
	
	SetCurrentCoord : function (mouseCoord)
	{
		this.current = mouseCoord;
		var modelCoord = this.GetModelCoord (this.current);
		modelCoord.x = Math.round (modelCoord.x * 100) / 100;
		modelCoord.y = Math.round (modelCoord.y * 100) / 100;
		this.coordViewer.innerHTML = '(' + modelCoord.x + ', ' + modelCoord.y  + ')';
	},
	
	GetModelCoord : function (original)
	{
		var coord = new JSM.Coord2D (original.x - this.canvas.width / 2.0, -(original.y - this.canvas.height / 2.0));
		coord.x *= this.scaleInput.value;
		coord.y *= this.scaleInput.value;
		return coord;
	},
	
	GetEditorCoord : function (original)
	{
		var coord = new JSM.Coord2D (original.x, original.y);
		coord.x /= this.scaleInput.value;
		coord.y /= this.scaleInput.value;
		coord.x = parseInt (coord.x + this.canvas.width / 2.0);
		coord.y = parseInt (this.canvas.height - (coord.y + this.canvas.height / 2.0));
		return coord;
	},

	Draw : function ()
	{
		this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
		this.context.fillStyle = '#ffffff';
		this.context.fillRect (0, 0, this.canvas.width, this.canvas.height);

		this.DrawGrid ();
		this.DrawCoords ();
		this.DrawMarker ();
	},

	DrawGrid : function ()
	{
		this.context.beginPath ();
		this.context.strokeStyle = this.settings.editor.gridStrokeColor;

		var i;
		var step = this.settings.editor.gridStep;
		for (i = step; i < this.canvas.width; i += step) {
			coord = new JSM.Coord2D (i, 0);
			this.ContextMoveTo (coord);
			coord = new JSM.Coord2D (i, this.canvas.height);
			this.ContextLineTo (coord);
		}
		
		for (i = step; i < this.canvas.height; i += step) {
			coord = new JSM.Coord2D (0, i);
			this.ContextMoveTo (coord);
			coord = new JSM.Coord2D (this.canvas.width, i);
			this.ContextLineTo (coord);
		}

		this.context.stroke ();
	},
	
	DrawCoords : function ()
	{
		if (this.coords.length == 0) {
			return false;
		}
		
		this.context.fillStyle = this.settings.editor.polygonColor;
		this.context.strokeStyle = this.settings.editor.polygonStrokeColor;
		this.context.beginPath ();

		var firstCoord = this.coords[0];
		this.ContextMoveTo (firstCoord);
	
		var i, vertex;
		for (i = 1; i < this.coords.length; i++) {
			vertex = this.coords[i];
			this.ContextLineTo (vertex);
		}

		if (this.mode == 'CreatePolygon') {
			this.ContextLineTo (this.current);
		} else {
			this.ContextLineTo (firstCoord);
			this.context.fill ();
		}
		
		this.context.stroke ();
		return true;	
	},
	
	ContextMoveTo : function (coord)
	{
		this.context.moveTo (coord.x + 0.5, coord.y + 0.5);
	},
	
	ContextLineTo : function (coord)
	{
		this.context.lineTo (coord.x + 0.5, coord.y + 0.5);
	},
	
	DrawMarker : function ()
	{
		if (this.marker == -1) {
			return false;
		}
	
		var markerCoord = this.coords[this.marker];
		this.context.fillStyle = this.settings.editor.markerColor;
		this.context.beginPath();
		this.context.arc (markerCoord.x, markerCoord.y, 5, 0, 2.0 * Math.PI, true); 
		this.context.closePath();
		this.context.fill();

		return true;
	},

	InitSettings : function ()
	{
		this.settings = {
			editor : {
				width : 260,
				height : 260,
				gridStep : 10,
				border : '1px solid #cccccc',
				polygonColor : '#eeeeee',
				polygonStrokeColor : '#333333',
				markerColor : '#cc0000',
				gridStrokeColor : '#cccccc'
			},
			coordViewer : {
				margin : '5px',
				textAlign : 'right'
			},
			controls : {
				margin : '5px',
				tableWidth : '100%',
				tableCellPadding : '5px',
				scaleInputWidth : '50px'
			}
		};
	}
}
