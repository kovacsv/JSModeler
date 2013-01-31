LegoEditorBrick = function (positionX, positionY, rows, columns, isLarge, color)
{
	this.positionX = positionX || 0;
	this.positionY = positionY || 0;
	this.rows = rows || 1;
	this.columns = columns || 1;
	this.isLarge = (isLarge != undefined ? isLarge : true);
	this.color = (color != undefined ? color : '#dddddd');
};

LegoEditor = function ()
{
	this.canvas = null;
	this.context = null;
	this.bricks = [];
	this.tableSize = 15;
	this.brickAddedCallback = null;
	
	this.currentBrick = null;
	this.currentBrickPosition = null;
	
	this.legoWidth = 20;
	this.legoCylinderWidth = this.legoWidth * 0.6;

	this.defaultColor = '#cc0000';
	this.defaultIsLarge = true;
};

LegoEditor.prototype =
{
	Initialize : function (canvasName, tableSize, brickAddedCallback)
	{
		this.canvas = document.getElementById (canvasName);
		if (!this.canvas || !this.canvas.getContext) {
			return false;
		}
		
		this.context = this.canvas.getContext ('2d');
		if (!this.context) {
			return false;
		}

		var myThis = this;
		this.canvas.onmousedown = function (event) {myThis.OnMouseDown (event);};
		document.onmousemove = function (event) {myThis.OnMouseMove (event);};
		document.onmouseup = function (event) {myThis.OnMouseUp (event);};

		this.tableSize = tableSize;
		this.brickAddedCallback = brickAddedCallback;
		this.AddBrick (new LegoEditorBrick (0, 0, this.tableSize, this.tableSize, false, '#dddddd'));
		this.Draw ();
		return true;
	},

	AddBrick : function (brick)
	{
		var newBrick = new LegoEditorBrick (brick.positionX, brick.positionY, brick.rows, brick.columns, brick.isLarge, brick.color);
		this.bricks.push (newBrick);
		if (this.bricks.length > 1) {
			this.brickAddedCallback (newBrick);
		}
		this.Draw ();
	},
	
	SetDefaultColor : function (color)
	{
		this.defaultColor = color;
	},
	
	SetDefaultIsLarge : function (isLarge)
	{
		this.defaultIsLarge = isLarge;
	},
	
	GetTableSize : function ()
	{
		return this.tableSize;
	},
	
	BrickCount : function ()
	{
		return this.bricks.length;
	},
	
	RemoveLastBrick : function ()
	{
		if (this.bricks.length > 1) {
			this.bricks.pop ();
			this.Draw ();
		}
	},
	
	RemoveAllBricks : function ()
	{
		while (this.bricks.length > 1) {
			this.bricks.pop ();
		}
		this.Draw ();
	},

	Draw : function ()
	{
		this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);

		this.context.fillStyle = '#ffffff';
		this.context.fillRect (0, 0, this.canvas.width, this.canvas.height);

		var i;
		for (i = 0; i < this.bricks.length; i++) {
			this.DrawBrick (this.bricks[i]);
		}

		if (this.currentBrick != null) {
			this.DrawBrick (this.currentBrick);
		}
	
		return true;
	},
	
	DrawBrick : function (brick)
	{
		function ColorShader (hex, shade)
		{
			var source = hex.substr (1);
			var result = "#";
			var i, c;
			for (i = 0; i < 3; i++) {
				c = parseInt (source.substr (i * 2, 2), 16);
				c = parseInt (c * shade).toString (16);
				result += ("00"+c).substr (c.length);
			}
			return result;
		};
	
		this.context.fillStyle = brick.color;
		this.context.strokeStyle = ColorShader (brick.color, 0.7);

		this.context.beginPath();
		this.context.fillRect (
			this.legoWidth * brick.positionX,
			this.legoWidth * brick.positionY,
			this.legoWidth * brick.rows,
			this.legoWidth * brick.columns);
		this.context.rect (
			this.legoWidth * brick.positionX,
			this.legoWidth * brick.positionY,
			this.legoWidth * brick.rows,
			this.legoWidth * brick.columns);
		this.context.closePath();
		this.context.stroke ();
		
		var i, j;
		for (i = 0; i < brick.rows; i++) {
			for (j = 0; j < brick.columns; j++) {
				this.context.beginPath();
				this.context.arc (
					this.legoWidth * (brick.positionX + i + 0.5),
					this.legoWidth * (brick.positionY + j + 0.5),
					this.legoCylinderWidth / 2.0, 0, 2 * Math.PI, true);
				this.context.closePath();
				this.context.stroke ();
			}
		}
		
		return true;
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

	GetRowsAndColumns : function (mousePosition)
	{
		var rows = parseInt (mousePosition[0] / this.legoWidth);
		var columns = parseInt (mousePosition[1] / this.legoWidth);

		if (rows < 0) {
			rows = 0;
		}
		if (rows > this.tableSize - 1) {
			rows = this.tableSize - 1;
		}
		
		if (columns < 0) {
			columns = 0;
		}
		if (columns > this.tableSize - 1) {
			columns = this.tableSize - 1;
		}

		return [rows, columns];
	},
	
	OnMouseDown : function (event)
	{
		var mousePosition = this.GetMouseCoords (event);
		var rowsAndColumns = this.GetRowsAndColumns (mousePosition);
		this.currentBrick = new LegoEditorBrick (rowsAndColumns[0], rowsAndColumns[1], 1, 1, this.defaultIsLarge, this.defaultColor);
		this.currentBrickPosition = rowsAndColumns;
		this.Draw ();
	},

	OnMouseMove : function (event)
	{
		if (this.currentBrick == null) {
			return;
		}
		
		var mousePosition = this.GetMouseCoords (event);
		var rowsAndColumns = this.GetRowsAndColumns (mousePosition);
		
		var newRows = rowsAndColumns[0] - this.currentBrickPosition[0] + 1;
		if (newRows > 0) {
			this.currentBrick.positionX = this.currentBrickPosition[0];
			this.currentBrick.rows = newRows;
		} else {
			this.currentBrick.positionX = rowsAndColumns[0];
			this.currentBrick.rows = -newRows + 2;
		}
		
		var newColumns = rowsAndColumns[1] - this.currentBrickPosition[1] + 1;
		if (newColumns > 0) {
			this.currentBrick.positionY = this.currentBrickPosition[1];
			this.currentBrick.columns = newColumns;
		} else {
			this.currentBrick.positionY = rowsAndColumns[1];
			this.currentBrick.columns = -newColumns + 2;
		}
		
		this.Draw ();
	},
	
	OnMouseUp : function (event)
	{
		if (this.currentBrick == null) {
			return;
		}
	
		var mousePosition = this.GetMouseCoords (event);
		this.AddBrick (this.currentBrick);
		this.currentBrick = null;
		this.Draw ();
	}
};
