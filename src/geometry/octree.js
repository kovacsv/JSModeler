/**
* Class: Octree
* Description:
*	Defines an octree.
* Parameters:
*	min {Coord} bounding box minimum
*	max {Coord} bounding box maximum
*/
JSM.Octree = function (min, max)
{
	this.coords = [];
	this.root = {
		center : JSM.MidCoord (min, max),
		size : JSM.CoordSub (max, min),
		coord : -1,
		children : null
	};
};

/**
* Function: Octree.AddCoord
* Description:
*	Adds a coordinate to the octree. The return value is the stored index of the coordinate.
*	If the coordinate was already in the octree, it returns the existing index.
* Parameters:
*	coord {Coord} the coordinate
* Returns:
*	{integer} the stored index of the coordinate
*/
JSM.Octree.prototype.AddCoord = function (coord)
{
	return this.AddCoordToNode (coord, this.root);
};

/**
* Function: Octree.FindCoord
* Description:
*	Finds a coordinate in the octree, and returns the stored index of it.
*	The return value is -1 if the coordinate does not exist.
* Parameters:
*	coord {Coord} the coordinate
* Returns:
*	{integer} the stored index of the coordinate
*/
JSM.Octree.prototype.FindCoord = function (coord)
{
	var node = this.FindNode (coord, this.root);
	if (node === null) {
		return -1;
	}
	return node.coord;
};

JSM.Octree.prototype.AddCoordToNode = function (coord, root)
{
	var node = this.FindNode (coord, root);
	if (node === null) {
		return -1;
	}
	
	if (node.coord == -1) {
		node.coord = this.coords.length;
		this.coords.push (coord);
		return node.coord;
	}
	
	if (JSM.CoordIsEqual (coord, this.coords[node.coord])) {	
		return node.coord;
	}
	
	this.SplitNode (node);
	return this.AddCoordToNode (coord, node);
};

JSM.Octree.prototype.FindNode = function (coord, node)
{
	if (node.children === null) {
		return node;
	}
	
	var xGreater = coord.x > node.center.x;
	var yGreater = coord.y > node.center.y;
	var zGreater = coord.z > node.center.z;
	
	if (!xGreater && !yGreater && !zGreater) {
		return this.FindNode (coord, node.children[0]);
	} else if (xGreater && !yGreater && !zGreater) {
		return this.FindNode (coord, node.children[1]);
	} else if (xGreater && yGreater && !zGreater) {
		return this.FindNode (coord, node.children[2]);
	} else if (!xGreater && yGreater && !zGreater) {
		return this.FindNode (coord, node.children[3]);
	} else if (!xGreater && !yGreater && zGreater) {
		return this.FindNode (coord, node.children[4]);
	} else if (xGreater && !yGreater && zGreater) {
		return this.FindNode (coord, node.children[5]);
	} else if (xGreater && yGreater && zGreater) {
		return this.FindNode (coord, node.children[6]);
	} else if (!xGreater && yGreater && zGreater) {
		return this.FindNode (coord, node.children[7]);
	}
	
	return null;
};

JSM.Octree.prototype.SplitNode = function (node)
{
	function CreateNode (originalNode, direction)
	{
		var center = originalNode.center.Clone ();
		var size = JSM.VectorMultiply (originalNode.size, 0.5);
		center.x += direction.x * size.x * 0.5;
		center.y += direction.y * size.y * 0.5;
		center.z += direction.z * size.z * 0.5;
		
		var newNode = {
			center : center,
			size : size,
			coord : -1,
			children : null
		};
		return newNode;
	}

	node.children = [
		CreateNode (node, new JSM.Coord (-1.0, -1.0, -1.0)),
		CreateNode (node, new JSM.Coord (+1.0, -1.0, -1.0)),
		CreateNode (node, new JSM.Coord (+1.0, +1.0, -1.0)),
		CreateNode (node, new JSM.Coord (-1.0, +1.0, -1.0)),
		CreateNode (node, new JSM.Coord (-1.0, -1.0, +1.0)),
		CreateNode (node, new JSM.Coord (+1.0, -1.0, +1.0)),
		CreateNode (node, new JSM.Coord (+1.0, +1.0, +1.0)),
		CreateNode (node, new JSM.Coord (-1.0, +1.0, +1.0))
	];
	
	var newNode = this.FindNode (this.coords[node.coord], node);
	newNode.coord = node.coord;
	node.coord = -1;
};
