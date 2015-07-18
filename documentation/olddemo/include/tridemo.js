JSMTriangulationDemo = function ()
{
	this.uiDiv = null;
	this.editor = null;
};

JSMTriangulationDemo.prototype =
{
	Initialize : function (canvasName, uiDivName)
	{
		this.uiDiv = document.getElementById (uiDivName);

		var settings = {
			mode : 'Polygon',
			color : '#00aa00'
		};
		
		this.editor = new Editor ();
		this.editor.Initialize (canvasName, settings);
		
		this.editor.AddCoord ([350, 150]);
		this.editor.AddCoord ([350, 350]);
		this.editor.AddCoord ([150, 350]);
		this.editor.AddCoord ([150, 450]);
		this.editor.AddCoord ([450, 450]);
		this.editor.AddCoord ([450, 150]);
		this.editor.AddCoord ([350, 150]);
		
		this.editor.Draw ();		
		return true;
	},
	
	GenerateTriangulationUI : function ()
	{
		this.ClearUI ();

		this.GenerateUITitleElement ('Triangulation');
		
		var myThis = this;
		this.GenerateUIButtonElement ('triangulate', function () {myThis.Triangulate ();});
	},

	DrawTriangulation : function (result)
	{
		if (result === null || result.length < 1) {
			return false;
		}
	
		this.editor.context.clearRect (0, 0, this.editor.canvas.width, this.editor.canvas.height);
		this.editor.context.fillStyle = this.editor.settings.color;		
		
		var i, j, current, first, vertex;
		for (i = 0; i < result.length; i++) {
			this.editor.context.beginPath ();		
			current = result[i];
			first = this.editor.coords[current[0]];
			this.editor.context.moveTo (first[0], first[1]);
			for (j = 0; j < current.length; j++) {
				vertex = this.editor.coords[current[j]];
				this.editor.context.lineTo (vertex[0], vertex[1]);
			}
			this.editor.context.lineTo (first[0], first[1]);
			this.editor.context.fill ();
			this.editor.context.stroke ();
		}

		return true;
	},
	
	Triangulate : function ()
	{
		var coords = this.editor.coords;
		if (!this.editor.finished || coords.length < 3) {
			return false;
		}
		
		var polygon = new JSM.Polygon2D ();
		
		var i, current;
		for (i = 0; i < coords.length; i++) {
			current = coords[i];
			polygon.AddVertex (current[0], current[1]);
		}
		
		var result = JSM.TriangulatePolygon2D (polygon);
		this.editor.Enable (false);
		this.DrawTriangulation (result);
		return true;
	},

	ClearUI : function ()
	{
		this.uiDiv.innerHTML = '';
	},

	GenerateUITextElement : function (text)
	{
		var div = document.createElement ('div');
		div.innerHTML = text;
		div.className = 'text';
		this.uiDiv.appendChild (div);
	},

	GenerateUITitleElement : function (text)
	{
		var div = document.createElement ('div');
		div.innerHTML = text;
		div.className = 'title';
		this.uiDiv.appendChild (div);
	},

	GenerateUIButtonElement : function (text, callback)
	{
		var myThis = this;

		var div = document.createElement ('div');
		var input = document.createElement ('input');
		input.type = 'button';
		input.value = text;
		input.onclick = callback;
		div.className = 'button';
		div.appendChild (input);
		this.uiDiv.appendChild (div);
	},

	Resize : function ()
	{
		this.editor.Enable (true);
		this.editor.Draw ();
	},
	
	Draw : function ()
	{
		this.editor.Draw ();
	}
};
