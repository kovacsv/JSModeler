JSM.LegoTable = function (rows, columns, color)
{
	this.rows = rows || 10;
	this.columns = columns || 10;
	this.color = color || 0xdddddd;
	this.ResetZOffsets ();
};

JSM.LegoTable.prototype =
{
	ResetZOffsets : function ()
	{
		this.zOffsets = [];
		var i, j, current;	
		for (i = 0; i < this.rows; i++) {
			current = [];
			for (j = 0; j < this.columns; j++) {
				current.push (0);
			}
			this.zOffsets.push (current);
		}
	}	
};

JSM.LegoBrick = function (positionX, positionY, rows, columns, large, color)
{
	this.positionX = positionX || 0;
	this.positionY = positionY || 0;
	this.rows = rows || 1;
	this.columns = columns || 1;
	this.large = large || false;
	this.color = color || 0xcc0000;
	this.zOffset = 0;
};

JSM.LegoBuild = function (table, segmentation)
{
	this.table = table || new JSM.LegoTable (15, 15, 0xdddddd);
	this.bricks = [];
	this.segmentation = segmentation || 25;
	
	this.AddLegoBrick (new JSM.LegoBrick (0, 0, this.table.rows, this.table.columns, false, this.table.color));
};

JSM.LegoBuild.prototype =
{
	AddLegoBrick : function (brick)
	{
		this.AddLegoBrickInternal (brick, false);
	},
	
	BrickCount : function ()
	{
		return this.bricks.length;
	},
	
	RemoveLastBrick : function ()
	{
		if (this.bricks.length > 1) {
			this.bricks.pop ();
		}
		
		this.table.ResetZOffsets ();
		
		var i, brick;
		for (i = 0; i < this.bricks.length; i++) {
			brick = this.bricks[i];
			this.AddLegoBrickInternal (brick, true);
		}
	},
	
	RemoveAllBricks : function ()
	{
		while (this.bricks.length > 1) {
			this.bricks.pop ();
		}
		
		this.table.ResetZOffsets ();
		
		var brick = this.bricks[0];
		this.AddLegoBrickInternal (brick, true);
	},

	AddLegoBrickInternal : function (brick, onlyRepair)
	{
		this.SetBrickZOffset (brick);
		if (brick.zOffset >= 0) {
			if (!onlyRepair) {
				this.bricks.push (brick);
			}
			this.RepairZOffsets (brick);
		}
	},
	
	GetBodyAndMaterials : function (index)
	{
		var brick = this.bricks[index];
		
		var materials = new JSM.MaterialSet ();
		materials.AddMaterial (new JSM.Material ({ambient : brick.color, diffuse : brick.color}));
		
		var body = this.GetLegoBrickBody (brick, index === 0);
		body.SetPolygonsMaterialIndex (0);
		
		return [body, materials];
	},

	GetModelAndMaterials : function ()
	{
		var model = new JSM.Model ();
		var materials = new JSM.MaterialSet ();
		
		var colorToIndex = [];
		var i, brick;
		for (i = 0; i < this.bricks.length; i++) {
			brick = this.bricks[i];
			if (colorToIndex[brick.color] == undefined) {
				materials.AddMaterial (new JSM.Material ({ambient: brick.color, diffuse: brick.color}));
				material = materials.Count () - 1;
				colorToIndex[brick.color] = material;
			}
		}
		
		var brickBody, material, polygon;
		for (i = 0; i < this.bricks.length; i++) {
			brick = this.bricks[i];
			brickBody = this.GetLegoBrickBody (brick, i === 0);
			brickBody.SetPolygonsMaterialIndex (colorToIndex[brick.color]);
			model.AddBody (brickBody);
		}

		return [model, materials];
	},
	
	SetBrickZOffset : function (brick)
	{
		var zOffset = -1;
		
		var i, j, currX, currY, currZOffset;
		for (i = 0; i < brick.rows; i++) {
			for (j = 0; j < brick.columns; j++) {
				currX = brick.positionX + i;
				currY = brick.positionY + j;
				if (currX >= 0 && currX < this.table.rows && currY >= 0 && currY < this.table.columns) {
					currZOffset = this.table.zOffsets[currX][currY];
					if (currZOffset > zOffset) {
						zOffset = currZOffset;
					}
				}
			}
		}
		
		brick.zOffset = zOffset;
	},
	
	RepairZOffsets : function (brick)
	{
		var newZOffset = brick.zOffset;
		if (brick.large) {
			newZOffset += 3;
		} else {
			newZOffset += 1;
		}

		var i, j, currX, currY, currZOffset, addZOffset;
		for (i = 0; i < brick.rows; i++) {
			for (j = 0; j < brick.columns; j++) {
				currX = brick.positionX + i;
				currY = brick.positionY + j;
				if (currX >= 0 && currX < this.table.rows && currY >= 0 && currY < this.table.columns) {
					this.table.zOffsets[currX][currY] = newZOffset;
				}
			}
		}
	},

	GetLegoBrickBodyOffset : function (brick)
	{
		var legoDimensions = new JSM.LegoDimensions ();
		var xOffset = brick.positionX * legoDimensions.legoWidth;
		var yOffset = brick.positionY * legoDimensions.legoWidth;
		var zOffset = brick.zOffset * legoDimensions.legoSmallHeight;
		return new JSM.Coord (xOffset, yOffset, zOffset);
	},
	
	GetLegoBrickBody : function (brick, isTable)
	{
		var OffsetBody = function (body, offset)
		{
			var i, vertex;
			for (i = 0; i < body.VertexCount (); i++) {
				vertex = body.GetVertex (i);
				vertex.position = JSM.CoordAdd (vertex.position, offset);
			}
		};

		var brickBody = JSM.GenerateLegoBrick (brick.rows, brick.columns, brick.large, true, !isTable, this.segmentation, true);
		OffsetBody (brickBody, this.GetLegoBrickBodyOffset (brick));
		
		return brickBody;
	}
};

JSM.GenerateRandomLegoBuild = function (tableRows, tableColumns)
{
	var R = function (from, to)
	{
		return JSM.RandomInt (from, to);
	};

	var legoBuild = new JSM.LegoBuild (new JSM.LegoTable (tableRows, tableColumns));
	
	var i, rows, columns;
	for (i = 0; i < 50; i++) {
		rows = R (1, 4);
		columns = R (1, 4);
		legoBuild.AddLegoBrick (new JSM.LegoBrick (R (0, tableRows - rows), R (0, tableColumns - columns), rows, columns, R (0, 1), R(0, 16777215)));
	}
	
	return legoBuild.GetModelAndMaterials ();
};
