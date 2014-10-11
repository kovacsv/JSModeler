JSM.StaticControl = function ()
{
	this.input = null;
	this.styles = null;
};

JSM.StaticControl.prototype.Create = function (div, parameter)
{
	this.InitStyles ();
	
	this.input = document.createElement ('span');
	div.appendChild (this.input);
	this.input.innerHTML = parameter.value;
};

JSM.StaticControl.prototype.GetValue = function (parameter)
{
	parameter.value = this.input.innerHTML;
};

JSM.StaticControl.prototype.InitStyles = function ()
{

};

JSM.InputControl = function (type)
{
	this.type = type;
	this.input = null;
	this.styles = null;
};

JSM.InputControl.prototype.Create = function (div, parameter)
{
	this.InitStyles ();
	
	this.input = document.createElement ('input');
	div.appendChild (this.input);
	this.input.type = 'text';
	this.input.value = parameter.value;
	this.input.style.width = this.styles.inputs.width;
};

JSM.InputControl.prototype.GetValue = function (parameter)
{
	if (this.type == 'number') {
		parameter.value = parseFloat (this.input.value);
		if (isNaN (parameter.value)) {
			parameter.value = 0.0;
		}
	} else if (this.type == 'integer') {
		parameter.value = parseInt (this.input.value, 10);
		if (isNaN (parameter.value)) {
			parameter.value = 0;
		}
	} else {
		parameter.value = this.input.value;
	}
};

JSM.InputControl.prototype.InitStyles = function ()
{
	this.styles = {
		inputs : {
			width : '175px'
		}
	};
};

JSM.SelectControl = function ()
{
	this.input = null;
	this.styles = null;
};

JSM.SelectControl.prototype.Create = function (div, parameter)
{
	this.InitStyles ();
	
	this.input = document.createElement ('select');
	div.appendChild (this.input);
	
	var options = parameter.value[1];
	var i, option;
	for (i = 0; i < options.length; i++) {
		option = document.createElement ('option');
		option.text = options[i][1];
		this.input.add (option);
	}
	this.input.selectedIndex = parameter.value[0];
	this.input.style.width = this.styles.inputs.width;
};

JSM.SelectControl.prototype.GetValue = function (parameter)
{
	parameter.value[0] = this.input.selectedIndex;
};

JSM.SelectControl.prototype.InitStyles = function ()
{
	this.styles = {
		inputs : {
			width : '225px'
		}
	};
};

JSM.CheckControl = function ()
{
	this.input = null;
	this.styles = null;
};

JSM.CheckControl.prototype.Create = function (div, parameter)
{
	this.InitStyles ();
	
	this.input = document.createElement ('input');
	div.appendChild (this.input);
	this.input.type = 'checkbox';
	this.input.checked = parameter.value;
};

JSM.CheckControl.prototype.GetValue = function (parameter)
{
	parameter.value = this.input.checked;
};

JSM.CheckControl.prototype.InitStyles = function ()
{
	
};

JSM.CoordControl = function ()
{
	this.inputs = null;
	this.styles = null;
};

JSM.CoordControl.prototype.Create = function (div, parameter)
{
	this.inputs = [];
	this.InitStyles ();
	
	var xInput = document.createElement ('input');
	div.appendChild (xInput);
	xInput.type = 'text';
	xInput.value = parameter.value.x;
	xInput.style.width = this.styles.inputs.width;
	xInput.style.marginRight = this.styles.inputs.margin;
	this.inputs.push (xInput);

	var yInput = document.createElement ('input');
	div.appendChild (yInput);
	yInput.type = 'text';
	yInput.value = parameter.value.y;
	yInput.style.width = this.styles.inputs.width;
	yInput.style.marginRight = this.styles.inputs.margin;
	this.inputs.push (yInput);

	var zInput = document.createElement ('input');
	div.appendChild (zInput);
	zInput.type = 'text';
	zInput.value = parameter.value.z;
	zInput.style.width = this.styles.inputs.width;
	this.inputs.push (zInput);
};

JSM.CoordControl.prototype.GetValue = function (parameter)
{
	parameter.value.x = parseFloat (this.inputs[0].value);
	parameter.value.y = parseFloat (this.inputs[1].value);
	parameter.value.z = parseFloat (this.inputs[2].value);
};

JSM.CoordControl.prototype.InitStyles = function ()
{
	this.styles = {
		inputs : {
			width : '50px',
			margin : '6px'
		}
	};
};

JSM.ColorControl = function ()
{
	this.input = null;
	this.preview = null;
	this.styles = null;
};

JSM.ColorControl.prototype.Create = function (div, parameter)
{
	this.InitStyles ();
	
	this.input = document.createElement ('input');
	div.appendChild (this.input);
	this.input.type = 'text';
	this.input.value = parameter.value;
	this.input.style.width = this.styles.inputs.width;
	this.input.style.marginRight = this.styles.inputs.margin;
	if (this.input.addEventListener) {
		var myThis = this;
		this.input.addEventListener ('keyup', function () {myThis.ColorChanged ();});
	}
	
	this.preview = document.createElement ('div');
	div.appendChild (this.preview);
	this.preview.style.width = this.styles.preview.width;
	this.preview.style.height = this.styles.preview.height;
	this.preview.style.cssFloat = this.styles.preview.cssFloat;
	this.ColorChanged ();
};

JSM.ColorControl.prototype.GetValue = function (parameter)
{
	parameter.value = this.input.value;
};

JSM.ColorControl.prototype.ColorChanged = function ()
{
	if (this.input.value.length == 6) {
		this.preview.style.background = '#' + this.input.value;
	}
};

JSM.ColorControl.prototype.InitStyles = function ()
{
	this.styles = {
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
};

JSM.PolygonControl = function (type)
{
	this.type = 'polygon';
	if (type !== undefined && type !== null) {
		this.type = type;
	}

	this.canvas = null;
	this.context = null;
	this.scaleInput = null;
	this.snapInput = null;
	this.coordViewer = null;
	this.styles = null;
	
	this.coords = null;
	this.current = null;
	this.marker = null;
	this.moved = null;

	this.mode = null;
};

JSM.PolygonControl.prototype.Create = function (div, parameter)
{
	this.InitStyles ();

	var controlsTable = document.createElement ('table');
	div.appendChild (controlsTable);
	controlsTable.style.marginBottom = this.styles.controls.margin;
	controlsTable.style.width = this.styles.controls.tableWidth;
	controlsTable.style.cellPadding = this.styles.controls.tableCellPadding;
	
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
	this.scaleInput.style.width = this.styles.controls.scaleInputWidth;
	
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
	this.canvas.width = this.styles.editor.width;
	this.canvas.height = this.styles.editor.height;
	this.canvas.style.border = this.styles.editor.border;
	if (this.canvas.addEventListener) {
		var myThis = this;
		this.canvas.addEventListener ('mousemove', function (event) {myThis.MouseMove (event);});
		this.canvas.addEventListener ('mousedown', function (event) {myThis.MouseDown (event);});
		this.canvas.addEventListener ('mouseup', function (event) {myThis.MouseUp (event);});
	}

	this.coordViewer = document.createElement ('div');
	div.appendChild (this.coordViewer);
	this.coordViewer.style.marginTop = this.styles.coordViewer.margin;
	this.coordViewer.style.textAlign = this.styles.coordViewer.textAlign;
	
	this.SetCurrentCoord (new JSM.Coord2D (0.0, 0.0));
	this.context = this.canvas.getContext ('2d');
	this.coords = [];
	var i;
	for (i = 0; i < parameter.value[1].length; i++) {
		this.coords.push (this.GetEditorCoord (parameter.value[1][i]));
	}
	
	this.mode = 'Finished';
	this.marker = -1;
	this.moved = -1;
	this.Draw ();
};

JSM.PolygonControl.prototype.GetValue = function (parameter)
{
	parameter.value = [this.scaleInput.value, []];
	if (this.mode == 'Finished') {
		var i;
		for (i = 0; i < this.coords.length; i++) {
			parameter.value[1].push (this.GetModelCoord (this.coords[i]));
		}
	}
};

JSM.PolygonControl.prototype.GetMouseCoord = function (event)
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
		xCoord -= xCoord % this.styles.editor.gridStep;
		yCoord -= yCoord % this.styles.editor.gridStep;
	}
	return new JSM.Coord2D (xCoord, yCoord);
};

JSM.PolygonControl.prototype.MouseMove = function (event)
{
	var mouseCoord = this.GetMouseCoord (event);
	this.SetCurrentCoord (mouseCoord);
	if (this.mode == 'Move') {
		this.MoveCoord (mouseCoord);
	}
	this.UpdateMarker (mouseCoord);
	this.Draw ();
};

JSM.PolygonControl.prototype.MouseDown = function (event)
{
	var mouseCoord = this.GetMouseCoord (event);
	if (this.mode == 'Create') {
		this.AddCoord (this.current);
	} else if (this.mode == 'Finished') {
		if (this.coords.length < 2 || this.marker == -1) {
			this.coords = [];
			this.mode = 'Create';
			this.AddCoord (this.current);
		} else if (this.marker != -1) {
			this.mode = 'Move';
			this.moved = this.marker;
		}
	}
	this.UpdateMarker (mouseCoord);
	this.Draw ();
};

JSM.PolygonControl.prototype.MouseUp = function ()
{
	if (this.mode == 'Move') {
		this.mode = 'Finished';
	}
};

JSM.PolygonControl.prototype.AddCoord = function (mouseCoord)
{
	if (this.mode == 'Create') {
		if (this.coords.length < 2 || this.marker == -1) {
			var canAddCoord = false;
			if (this.coords.length === 0) {
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
			this.mode = 'Finished';
		}
	}
};

JSM.PolygonControl.prototype.MoveCoord = function (mouseCoord)
{
	if (this.mode == 'Move') {
		this.coords[this.moved] = mouseCoord;
	}
};

JSM.PolygonControl.prototype.UpdateMarker = function (mouseCoord)
{
	this.marker = -1;
	if (this.type == 'polygon') {
		if (this.coords.length < 3) {
			return;
		}
	} else if (this.type == 'polyline') {
		if (this.coords.length < 2) {
			return;
		}
	} else {
		return;
	}
	
	if (this.mode == 'Create') {
		var refCoordIndex = 0;
		if (this.type == 'polygon') {
			refCoordIndex = 0;
		} else if (this.type == 'polyline') {
			refCoordIndex = this.coords.length - 1;
		}
		var refCoord = this.coords[refCoordIndex];
		if (JSM.CoordDistance2D (mouseCoord, refCoord) < this.styles.editor.gridStep) {
			this.marker = refCoordIndex;
		}
	} else if (this.mode == 'Finished') {
		var i;
		for (i = 0; i < this.coords.length; i++) {
			if (JSM.CoordDistance2D (mouseCoord, this.coords[i]) < this.styles.editor.gridStep) {
				this.marker = i;
				break;
			}
		}
	}
};

JSM.PolygonControl.prototype.SetCurrentCoord = function (mouseCoord)
{
	this.current = mouseCoord;
	
	var modelCoord = this.GetModelCoord (this.current);
	modelCoord.x = Math.round (modelCoord.x * 100) / 100;
	modelCoord.y = Math.round (modelCoord.y * 100) / 100;
	this.coordViewer.innerHTML = '(' + modelCoord.x + ', ' + modelCoord.y  + ')';
};

JSM.PolygonControl.prototype.GetModelCoord = function (original)
{
	var coord = new JSM.Coord2D (original.x - this.canvas.width / 2.0, -(original.y - this.canvas.height / 2.0));
	coord.x *= this.scaleInput.value;
	coord.y *= this.scaleInput.value;
	return coord;
};

JSM.PolygonControl.prototype.GetEditorCoord = function (original)
{
	var coord = new JSM.Coord2D (original.x, original.y);
	coord.x /= this.scaleInput.value;
	coord.y /= this.scaleInput.value;
	coord.x = parseInt (coord.x + this.canvas.width / 2.0, 10);
	coord.y = parseInt (this.canvas.height - (coord.y + this.canvas.height / 2.0), 10);
	return coord;
};

JSM.PolygonControl.prototype.Draw = function ()
{
	this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
	this.context.fillStyle = '#ffffff';
	this.context.fillRect (0, 0, this.canvas.width, this.canvas.height);

	this.DrawGrid ();
	this.DrawCoords ();
	this.DrawMarker ();
};

JSM.PolygonControl.prototype.DrawGrid = function ()
{
	this.context.beginPath ();
	this.context.strokeStyle = this.styles.editor.gridStrokeColor;

	var i, coord;
	var step = this.styles.editor.gridStep;
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
};

JSM.PolygonControl.prototype.DrawCoords = function ()
{
	if (this.coords.length === 0) {
		return false;
	}
	
	this.context.fillStyle = this.styles.editor.polygonColor;
	this.context.strokeStyle = this.styles.editor.polygonStrokeColor;
	this.context.beginPath ();

	var firstCoord = this.coords[0];
	this.ContextMoveTo (firstCoord);

	var i, vertex;
	for (i = 1; i < this.coords.length; i++) {
		vertex = this.coords[i];
		this.ContextLineTo (vertex);
	}

	if (this.mode == 'Create') {
		this.ContextLineTo (this.current);
	} else {
		if (this.type == 'polygon') {
			this.ContextLineTo (firstCoord);
			this.context.fill ();
		}
	}
	
	this.context.stroke ();
	return true;
};

JSM.PolygonControl.prototype.ContextMoveTo = function (coord)
{
	this.context.moveTo (coord.x + 0.5, coord.y + 0.5);
};

JSM.PolygonControl.prototype.ContextLineTo = function (coord)
{
	this.context.lineTo (coord.x + 0.5, coord.y + 0.5);
};

JSM.PolygonControl.prototype.DrawMarker = function ()
{
	if (this.marker == -1) {
		return false;
	}

	var markerCoord = this.coords[this.marker];
	this.context.fillStyle = this.styles.editor.markerColor;
	this.context.beginPath();
	this.context.arc (markerCoord.x, markerCoord.y, 5, 0, 2.0 * Math.PI, true);
	this.context.closePath();
	this.context.fill();

	return true;
};

JSM.PolygonControl.prototype.InitStyles = function ()
{
	this.styles = {
		editor : {
			width : 260,
			height : 260,
			gridStep : 10,
			border : '1px solid #cccccc',
			polygonColor : '#eeeeee',
			polygonStrokeColor : '#222222',
			markerColor : '#222222',
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
};
