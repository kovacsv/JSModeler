/**
* Class: Octree
* Description: Defines an octree. The octree contains each coordinate only once.
* Parameters:
*	box {Box} bounding box
*	maxCoordNumInNodes {integer} maximum number of coordinates in a node
*/
JSM.Octree = function (box, maxCoordNumInNodes)
{
	this.coords = [];
	this.root = {
		center : JSM.MidCoord (box.min, box.max),
		size : JSM.CoordSub (box.max, box.min),
		coords : [],
		children : null
	};
	this.maxCoordNumInNodes = maxCoordNumInNodes;
	if (this.maxCoordNumInNodes === undefined || this.maxCoordNumInNodes === null || this.maxCoordNumInNodes === 0) {
		this.maxCoordNumInNodes = 50;
	}
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
	return this.FindCoordInNode (coord, node);
};

JSM.Octree.prototype.FindCoordInNode = function (coord, node)
{
	var i, current;
	for (i = 0; i < node.coords.length; i++) {
		current = node.coords[i];
		if (JSM.CoordIsEqual (coord, this.coords[current])) {
			return current;
		}
	}
	return -1;
};

JSM.Octree.prototype.AddCoordToNode = function (coord, root)
{
	var node = this.FindNode (coord, root);
	if (node === null) {
		return -1;
	}
	
	var found = this.FindCoordInNode (coord, node);
	if (found != -1) {	
		return found;
	}
	
	if (node.coords.length < this.maxCoordNumInNodes) {
		var index = this.coords.length;
		this.coords.push (coord);
		node.coords.push (index);
		return index;
	}
	
	if (!this.SplitNode (node)) {
		return -1;
	}
	
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
	function CreateNode (originalNode, dirX, dirY, dirZ)
	{
		var center = originalNode.center.Clone ();
		var size = JSM.VectorMultiply (originalNode.size, 0.5);
		center.x += dirX * size.x * 0.5;
		center.y += dirY * size.y * 0.5;
		center.z += dirZ * size.z * 0.5;
		
		var newNode = {
			center : center,
			size : size,
			coords : [],
			children : null
		};
		return newNode;
	}

	if (JSM.IsZero (node.size.x) && JSM.IsZero (node.size.y) && JSM.IsZero (node.size.z)) {
		return false;
	}
	
	node.children = [
		CreateNode (node, -1.0, -1.0, -1.0),
		CreateNode (node, +1.0, -1.0, -1.0),
		CreateNode (node, +1.0, +1.0, -1.0),
		CreateNode (node, -1.0, +1.0, -1.0),
		CreateNode (node, -1.0, -1.0, +1.0),
		CreateNode (node, +1.0, -1.0, +1.0),
		CreateNode (node, +1.0, +1.0, +1.0),
		CreateNode (node, -1.0, +1.0, +1.0)
	];
	
	var nodeCoords = node.coords;
	node.coords = [];
	
	var i;
	for (i = 0; i < nodeCoords.length; i++) {
		var newNode = this.FindNode (this.coords[nodeCoords[i]], node);
		newNode.coords.push (nodeCoords[i]);
	}
	
	return true;
};
