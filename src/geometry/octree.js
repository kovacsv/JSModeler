/**
* Function: TraverseOctreeNodes
* Description:
*	Traverses the nodes of the tree, and calls the given callback when a node found. The return value
*	of the callback determines if we need to continue traverse along that given node.
* Parameters:
*	nodeFound {function} the callback
*/
JSM.TraverseOctreeNodes = function (octree, nodeFound)
{
	function TraverseNode (node, nodeFound)
	{
		if (!nodeFound (node)) {
			return;
		}
		
		if (node.children === null) {
			return;
		}
		
		var i, child;
		for (i = 0; i < node.children.length; i++) {
			child = node.children[i];
			TraverseNode (child, nodeFound);
		}
	}

	TraverseNode (octree.root, nodeFound);
};

/**
* Function: CreateOctreeChildNodes
* Description:
*	Create child nodes for an octree node. It calls a callback function
*	which should create a new node element for the octree.
* Parameters:
*	originalBox {Box} the box of the original node
*	createNodeCallback {function} the callback function
* Returns:
*	{object[*]} the result
*/
JSM.CreateOctreeChildNodes = function (originalBox, createNodeCallback)
{
	function CreateNode (originalBox, createNodeCallback, dirX, dirY, dirZ)
	{
		var size = originalBox.GetSize ().Clone ();
		size.MultiplyScalar (0.5);
		var min = new JSM.Coord (
			originalBox.min.x + dirX * size.x,
			originalBox.min.y + dirY * size.y,
			originalBox.min.z + dirZ * size.z
		);
		var max = JSM.CoordAdd (min, size);
		var box = new JSM.Box (min, max);
		return createNodeCallback (box);
	}

	var size = originalBox.GetSize ();
	if (JSM.IsZero (size.x) && JSM.IsZero (size.y) && JSM.IsZero (size.z)) {
		return null;
	}
	
	var result = [
		CreateNode (originalBox, createNodeCallback, 0.0, 0.0, 0.0),
		CreateNode (originalBox, createNodeCallback, 1.0, 0.0, 0.0),
		CreateNode (originalBox, createNodeCallback, 1.0, 1.0, 0.0),
		CreateNode (originalBox, createNodeCallback, 0.0, 1.0, 0.0),
		CreateNode (originalBox, createNodeCallback, 0.0, 0.0, 1.0),
		CreateNode (originalBox, createNodeCallback, 1.0, 0.0, 1.0),
		CreateNode (originalBox, createNodeCallback, 1.0, 1.0, 1.0),
		CreateNode (originalBox, createNodeCallback, 0.0, 1.0, 1.0),
	];
	return result;
};

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
	this.root = this.CreateNewNode (null, box);
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
	var node = this.FindNodeForCoord (coord, this.root);
	if (node === null) {
		return -1;
	}
	return this.FindCoordInNode (coord, node);
};

/**
* Function: Octree.FindCoordInNode
* Description: Finds a coordinate in a node.
* Parameters:
*	coord {Coord} the coordinate
*	node {object} the node
* Returns:
*	{integer} the stored index of the coordinate
*/
JSM.Octree.prototype.FindCoordInNode = function (coord, node)
{
	var i, current;
	for (i = 0; i < node.coords.length; i++) {
		current = node.coords[i];
		if (coord.IsEqual (this.coords[current])) {
			return current;
		}
	}
	return -1;
};

/**
* Function: Octree.AddCoordToNode
* Description: Adds a coordinate to a node.
* Parameters:
*	coord {Coord} the coordinate
*	root {object} the root node
* Returns:
*	{integer} the stored index of the coordinate
*/
JSM.Octree.prototype.AddCoordToNode = function (coord, root)
{
	var node = this.FindNodeForCoord (coord, root);
	if (node === null) {
		return -1;
	}
	
	var found = this.FindCoordInNode (coord, node);
	if (found != -1) {	
		return found;
	}
	
	if (node.coords.length >= this.maxCoordNumInNodes) {
		if (this.SplitNode (node)) {
			return this.AddCoordToNode (coord, node);
		}
	}
	
	var index = this.coords.length;
	this.coords.push (coord);
	node.coords.push (index);
	return index;
};

/**
* Function: Octree.FindNodeForCoord
* Description: Finds a node for a coordinate.
* Parameters:
*	coord {Coord} the coordinate
*	node {object} the starting node
* Returns:
*	{object} the found node
*/
JSM.Octree.prototype.FindNodeForCoord = function (coord, node)
{
	if (node.children === null) {
		return node;
	}
	
	var center = node.box.GetCenter ();
	var xGreater = coord.x > center.x;
	var yGreater = coord.y > center.y;
	var zGreater = coord.z > center.z;
	
	if (!xGreater && !yGreater && !zGreater) {
		return this.FindNodeForCoord (coord, node.children[0]);
	} else if (xGreater && !yGreater && !zGreater) {
		return this.FindNodeForCoord (coord, node.children[1]);
	} else if (xGreater && yGreater && !zGreater) {
		return this.FindNodeForCoord (coord, node.children[2]);
	} else if (!xGreater && yGreater && !zGreater) {
		return this.FindNodeForCoord (coord, node.children[3]);
	} else if (!xGreater && !yGreater && zGreater) {
		return this.FindNodeForCoord (coord, node.children[4]);
	} else if (xGreater && !yGreater && zGreater) {
		return this.FindNodeForCoord (coord, node.children[5]);
	} else if (xGreater && yGreater && zGreater) {
		return this.FindNodeForCoord (coord, node.children[6]);
	} else if (!xGreater && yGreater && zGreater) {
		return this.FindNodeForCoord (coord, node.children[7]);
	}
	
	return null;
};

/**
* Function: Octree.SplitNode
* Description: Splits a node to subnodes.
* Parameters:
*	node {object} the node
* Returns:
*	{boolean} success
*/
JSM.Octree.prototype.SplitNode = function (node)
{
	var myThis = this;
	var children = JSM.CreateOctreeChildNodes (node.box, function (nodeBox) {
		return myThis.CreateNewNode (node, nodeBox);
	});
	
	if (children === null) {
		return false;
	}
	
	node.children = children;
	var nodeCoords = node.coords;
	node.coords = [];
	
	var i, newNode;
	for (i = 0; i < nodeCoords.length; i++) {
		newNode = this.FindNodeForCoord (this.coords[nodeCoords[i]], node);
		newNode.coords.push (nodeCoords[i]);
	}
	
	return true;
};

/**
* Function: Octree.CreateNewNode
* Description: Creates a new node.
* Parameters:
*	parent {object} the parent node
*	box {Box} the box of the node
* Returns:
*	{object} the result
*/
JSM.Octree.prototype.CreateNewNode = function (parent, box)
{
	var newNode = {
		parent : parent,
		box : box,
		coords : [],
		children : null
	};
	return newNode;	
};

/**
* Class: TriangleOctree
* Description:
*	Defines an octree which stores triangles. Every triangle is placed in
*	the smallest possible node which contains all of its vertices.
* Parameters:
*	box {Box} bounding box
*/
JSM.TriangleOctree = function (box)
{
	this.root = this.CreateNewNode (null, box);
};

/**
* Function: TriangleOctree.AddTriangle
* Description: Adds a triangle to the octree.
* Parameters:
*	v0, v1, v2 {Coord} the vertices of the triangle
*	userData {anything} user data for the triangle
*/
JSM.TriangleOctree.prototype.AddTriangle = function (v0, v1, v2, userData)
{
	return this.AddTriangleToNode (v0, v1, v2, this.root, userData);
};

/**
* Function: TriangleOctree.AddTriangleToNode
* Description: Adds a coordinate to a node.
* Parameters:
*	v0, v1, v2 {Coord} the vertices of the triangle
*	root {object} the root node
* Returns:
*	{boolean} success
*/
JSM.TriangleOctree.prototype.AddTriangleToNode = function (v0, v1, v2, root, userData)
{
	function IsTriangleInNode (v0, v1, v2, node)
	{
		return JSM.IsCoordInBox (v0, node.box) && JSM.IsCoordInBox (v1, node.box) && JSM.IsCoordInBox (v2, node.box);
	}
	
	if (!IsTriangleInNode (v0, v1, v2, root)) {
		return false;
	}
	
	if (root.children === null) {
		var myThis = this;
		root.children = JSM.CreateOctreeChildNodes (root.box, function (nodeBox) {
			return myThis.CreateNewNode (root, nodeBox);
		});
	}
	
	if (root.children !== null) {
		var i, node;
		for (i = 0; i < root.children.length; i++) {
			node = root.children[i];
			if (this.AddTriangleToNode (v0, v1, v2, node, userData)) {
				return true;
			}
		}
	}
	
	root.triangles.push ({
		v0 : v0,
		v1 : v1,
		v2 : v2,
		userData : userData
	});
	return true;
};

/**
* Function: TriangleOctree.CreateNewNode
* Description: Creates a new node.
* Parameters:
*	parent {object} the parent node
*	box {Box} the box of the node
* Returns:
*	{object} the result
*/
JSM.TriangleOctree.prototype.CreateNewNode = function (parent, box)
{
	var newNode = {
		parent : parent,
		box : box,
		triangles : [],
		children : null
	};
	return newNode;	
};
