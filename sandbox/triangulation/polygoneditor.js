function DrawSimplePolygon (context, polygon, fillStyle, extraLineEnd, alpha)
{
	context.beginPath ();
	context.fillStyle = fillStyle;
	context.strokeStyle = '#222222';
	context.globalAlpha = 1.0;
	if (alpha !== undefined && alpha !== null) {
		context.globalAlpha = alpha;
	}
	
	var vertexIndex, vertex;
	for (vertexIndex = 0; vertexIndex < polygon.VertexCount (); vertexIndex++) {
		vertex = polygon.GetVertex (vertexIndex);
		if (vertexIndex === 0) {
			context.moveTo (vertex.x, vertex.y);
		} else {
			context.lineTo (vertex.x, vertex.y);
		}
	}	

	if (extraLineEnd !== undefined && extraLineEnd !== null) {
		context.lineTo (extraLineEnd.x, extraLineEnd.y);
	}

	context.closePath ();
	context.fill ();
	context.stroke ();		
	
	var coordToText = {};
	var canvasCoord;
	var showVertexIndices = true;
	if (showVertexIndices) {
		for (vertexIndex = 0; vertexIndex < polygon.VertexCount (); vertexIndex++) {
			vertex = polygon.GetVertex (vertexIndex);
			canvasCoord = {
				x : parseInt (vertex.x),
				y : parseInt (vertex.y)
			};
			if (coordToText[canvasCoord.x] === undefined) {
				coordToText[canvasCoord.x] = {};
			}
			if (coordToText[canvasCoord.x][canvasCoord.y] === undefined) {
				coordToText[canvasCoord.x][canvasCoord.y] = vertexIndex;
			} else {
				coordToText[canvasCoord.x][canvasCoord.y] += ', ' + vertexIndex;
			}
		}
		
		var xCoord, yCoord;
		context.beginPath ();
		context.fillStyle = '#cc0000';
		for (xCoord in coordToText) {
			for (yCoord in coordToText[xCoord]) {
				context.fillText (coordToText[xCoord][yCoord], xCoord, yCoord);
			}
		}
		context.closePath ();
		context.fill ();
	}

	context.globalAlpha = 1.0;
}

function DrawPolygon (context, polygon, extraLineEnd, alpha)
{
	var contourIndex, contour, fillStyle, myExtraLineEnd;
	for (contourIndex = 0; contourIndex < polygon.ContourCount (); contourIndex++) {
		contour = polygon.GetContour (contourIndex);
		fillStyle = (contourIndex === 0 ? '#dedecd' :  '#ffffff');
		myExtraLineEnd = null;
		if (extraLineEnd !== null && contourIndex == polygon.ContourCount () - 1) {
			myExtraLineEnd = extraLineEnd;
		}
		DrawSimplePolygon (context, contour, fillStyle, myExtraLineEnd, alpha);
	}
}

function DrawLine (context, from, to)
{
	context.beginPath ();
	context.fillStyle = '#0000aa';
	context.strokeStyle = '#0000aa';	
	context.arc (from.x, from.y, 2, 0, 2 * Math.PI, false);
	context.arc (to.x, to.y, 2, 0, 2 * Math.PI, false);
	context.closePath ();
	context.fill ();
	
	context.beginPath ();
	context.fillStyle = '#0000aa';
	context.strokeStyle = '#0000aa';	
	context.moveTo (from.x, from.y);
	context.lineTo (to.x, to.y);
	context.closePath ();
	context.fill ();
	context.stroke ();		
}

PolygonEditor = function ()
{
	this.canvas = null;
	this.context = null;
	this.polygon = null;
	this.prevCoord = null;
	this.mouseCoord = null;
	this.editing = null;
};

PolygonEditor.prototype.Init = function (canvas)
{
	function AddVertex (x, y)
	{
		polygon.AddVertex (100 + x * 10, 200 + y * 10);
	}
	
	this.canvas = canvas;
	this.context = this.canvas.getContext ('2d');
	this.context.translate (0.5, 0.5);
	
	this.polygon = new JSM.ContourPolygon2D ();

	this.prevCoord = { x : -1, y : -1 };
	this.mouseCoord = { x : -1, y : -1 };
	this.editing = false;
	
	this.canvas.addEventListener ('click', this.MouseClick.bind (this));
	this.canvas.addEventListener ('mousemove', this.MouseMove.bind (this));
	
	this.Draw ();	
};

PolygonEditor.prototype.GetPolygon = function ()
{
	return this.polygon;
};

PolygonEditor.prototype.ConvertToSimplePolygon = function ()
{
	var simple = JSM.ConvertContourPolygonToPolygon2D (this.polygon);
	if (simple === null) {
		return;
	}
	this.polygon.Clear ();
	this.polygon.AddContour ();
	var i;
	for (i = 0; i < simple.VertexCount (); i++) {
		this.polygon.AddVertexCoord (simple.GetVertex (i));
	}
	this.Draw ();
};

PolygonEditor.prototype.GenerateRandomPolygon = function ()
{
	var simple = null;
	while (simple === null) {
		simple = GenerateRandomSimplePolygon ();
	}
	this.polygon.Clear ();
	this.polygon.AddContour (simple);
	this.Draw ();
};

PolygonEditor.prototype.Clear = function ()
{
	this.polygon.Clear ();
	this.prevCoord = { x : -1, y : -1 };
	this.editing = false;
	this.Draw ();
};

PolygonEditor.prototype.MouseClick = function (event)
{
	if (!this.editing) {
		this.editing = true;
		this.polygon.AddContour ();
	}
	if (this.prevCoord.x == this.mouseCoord.x && this.prevCoord.y == this.mouseCoord.y) {
		this.editing = false;
	} else {
		this.editing = true;
		this.polygon.AddVertex (this.mouseCoord.x, this.mouseCoord.y);
		this.prevCoord = { x : this.mouseCoord.x, y : this.mouseCoord.y };
	}
		
	this.Draw ();
};

PolygonEditor.prototype.MouseMove = function (event)
{
	this.mouseCoord = {
		x : event.clientX - this.canvas.offsetLeft,
		y : event.clientY - this.canvas.offsetTop
	};
	if (this.editing) {
		this.Draw ();
	}
};

PolygonEditor.prototype.Draw = function ()
{
	this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);

	var extraLineEnd = null;
	if (this.editing) {
		extraLineEnd = this.mouseCoord;
	}
	DrawPolygon (this.context, this.polygon, extraLineEnd);
};

PolygonEditor.prototype.DrawAdditionalTriangle = function (v0, v1, v2)
{
	this.context.beginPath ();
	this.context.fillStyle = 'rgba(0, 0, 0, 0.2)';
	this.context.strokeStyle = '#222222';
	this.context.moveTo (v0.x, v0.y);
	this.context.lineTo (v1.x, v1.y);
	this.context.lineTo (v2.x, v2.y);
	this.context.closePath ();
	this.context.fill ();
	this.context.stroke ();
};
