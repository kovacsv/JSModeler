JSM.LegoDimensions = function ()
{
	this.legoWidth = 0.78;
	this.legoSmallHeight = 0.32;
	this.legoLargeHeight = 0.96;
	this.legoWallWidth = 0.16;
	this.legoCylinderWidth = 0.5;
	this.legoCylinderHeight = 0.17;
	this.legoBottomSmallCylinderWidth = 0.3
	this.legoBottomLargeCylinderWidth = 0.6;
	this.legoBottomLargeCylinderWallWidth = 0.1;
};

JSM.GenerateLegoBrick = function (rows, columns, isLarge, hasTopCylinders, hasBottomCylinders, segmentation, isCurved)
{
	var OffsetBody = function (body, offset)
	{
		var i, vertex;
		for (i = 0; i < body.VertexCount (); i++) {
			vertex = body.GetVertex (i);
			vertex.position = JSM.CoordAdd (vertex.position, offset);
		}
	};
	
	var legoDimensions = new JSM.LegoDimensions ();

	var scale = 1.0;
	var normal = new THREE.Vector3 (0.0, 0.0, 1.0);
	var unitWidth = legoDimensions.legoWidth * scale;
	var unitHeight = legoDimensions.legoLargeHeight * scale;
	if (!isLarge) {
		unitHeight = legoDimensions.legoSmallHeight * scale;
	}
	var wallWidth = legoDimensions.legoWallWidth * scale;
	var topCylinderWidth = legoDimensions.legoCylinderWidth * scale;
	var topCylinderHeight = legoDimensions.legoCylinderHeight * scale;
	var bottomSmallCylinderWidth = legoDimensions.legoBottomSmallCylinderWidth * scale;
	var bottomLargeCylinderWidth = legoDimensions.legoBottomLargeCylinderWidth * scale;
	var bottomLargeCylinderWallWidth = legoDimensions.legoBottomLargeCylinderWallWidth * scale;

	var basePolygon = [];
	basePolygon.push (new JSM.Coord (0.0, 0.0, 0.0));
	basePolygon.push (new JSM.Coord (unitWidth * rows, 0.0, 0.0));
	basePolygon.push (new JSM.Coord (unitWidth * rows, unitWidth * columns, 0.0));
	basePolygon.push (new JSM.Coord (0.0, unitWidth * columns, 0.0));

	var result = new JSM.Body ();
	
	var walls = JSM.GeneratePrismShell (basePolygon, normal, unitHeight - wallWidth, wallWidth, true);
	result.Merge (walls);
		
	var i, j, k;
	for (i = 0; i < 4; i++) {
		basePolygon[i].z = unitHeight - wallWidth;
	}
	
	var top = JSM.GeneratePrism (basePolygon, normal, wallWidth, true);
	result.Merge (top);
	
	var cylinderCenter, cylinder;
	if (hasTopCylinders) {
		for (i = 0; i < rows; i++) {
			for (j = 0; j < columns; j++) {
				cylinderCenter = new JSM.Coord (unitWidth * i + unitWidth / 2.0, unitWidth * j + unitWidth / 2.0, unitHeight + topCylinderHeight / 2.0);
				cylinder = JSM.GenerateCylinder (topCylinderWidth / 2.0, topCylinderHeight, segmentation, true, isCurved);
				OffsetBody (cylinder, cylinderCenter);
				result.Merge (cylinder);
			}
		}
	}
	
	if (hasBottomCylinders) {
		var circle, bigger, columnWise;
		if ((rows === 1 && columns > 1) || (columns === 1 && rows > 1)) {
			bigger = columns;
			columnWise = true;
			if (rows > columns) {
				bigger = rows;
				columnWise = false;
			}
			for (i = 0; i < bigger - 1; i++) {
				cylinderCenter;
				if (columnWise) {
					cylinderCenter = new JSM.Coord (unitWidth / 2.0, unitWidth * (i + 1), (unitHeight - wallWidth) / 2.0);
				} else {
					cylinderCenter = new JSM.Coord (unitWidth * (i + 1), unitWidth / 2.0, (unitHeight - wallWidth) / 2.0);
				}
				cylinder = JSM.GenerateCylinder (bottomSmallCylinderWidth / 2.0, unitHeight - wallWidth, segmentation, true, isCurved);
				OffsetBody (cylinder, cylinderCenter);
				result.Merge (cylinder);
			}
		} else if (rows > 1 && columns > 1) {
			for (i = 0; i < rows - 1; i++) {
				for (j = 0; j < columns - 1; j++) {
					circle = [];
					cylinderCenter = new JSM.Coord (unitWidth * (i + 1), unitWidth * (j + 1), (unitHeight - wallWidth) / 2.0);
					cylinder = JSM.GenerateCylinderShell (bottomLargeCylinderWidth / 2.0, unitHeight - wallWidth, bottomLargeCylinderWallWidth, segmentation, true, isCurved);
					OffsetBody (cylinder, cylinderCenter);
					result.Merge (cylinder);
				}
			}
		}
	}

	result.SetTextureProjectionType ('Cubic');
	result.SetTextureProjectionCoords (new JSM.CoordSystem (
		new JSM.Coord (0.0, 0.0, 0.0),
		new JSM.Coord (1.0, 0.0, 0.0),
		new JSM.Coord (0.0, 1.0, 0.0),
		new JSM.Coord (0.0, 0.0, 1.0)
	));
	
	return result;
};

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
		
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material (brick.color, brick.color));
		
		var body = this.GetLegoBrickBody (brick, index === 0);
		body.SetPolygonsMaterialIndex (0);
		
		return [body, materials];
	},

	GetModelAndMaterials : function ()
	{
		var model = new JSM.Model ();
		var materials = new JSM.Materials ();
		
		var colorToIndex = [];
		var i, brick;
		for (i = 0; i < this.bricks.length; i++) {
			brick = this.bricks[i];
			if (colorToIndex[brick.color] == undefined) {
				materials.AddMaterial (new JSM.Material (brick.color, brick.color));
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
