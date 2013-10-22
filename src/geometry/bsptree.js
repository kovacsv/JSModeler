JSM.BSPNode = function ()
{
	this.polygon = null;
	this.userData = null;
	this.plane = null;
	this.parent = null;
	this.inside = null;
	this.outside = null;
};

JSM.BSPNode.prototype =
{
	AddPolygon : function (polygon, userData)
	{
		function AddInsidePolygons (node, polygons, userData)
		{
			if (node.inside === null) {
				node.inside = new JSM.BSPNode ();
				node.inside.parent = node;
			}
			var i;
			for (i = 0; i < polygons.length; i++) {
				node.inside.AddPolygon (polygons[i], userData);
			}		
		}
	
		function AddOutsidePolygons (node, polygons, userData)
		{
			if (node.outside === null) {
				node.outside = new JSM.BSPNode ();
				node.outside.parent = node;
			}
			var i;
			for (i = 0; i < polygons.length; i++) {
				node.outside.AddPolygon (polygons[i], userData);
			}		
		}

		if (polygon.VertexCount () < 3) {
			return false;
		}
		
		var normal;
		if (this.polygon === null) {
			normal = JSM.CalculateNormal (polygon.vertices);
			var plane = JSM.GetPlaneFromCoordAndDirection (polygon.GetVertex (0), normal);
			this.polygon = polygon;
			if (userData !== undefined) {
				this.userData = userData;
			}
			this.plane = plane;
		} else {
			var backPolygons = [];
			var frontPolygons = [];
			var planePolygons = [];
			var cutSucceeded = JSM.CutPolygonWithPlane (polygon, this.plane, frontPolygons, backPolygons, planePolygons);
			if (cutSucceeded) {
				var i;
				if (backPolygons.length > 0) {
					AddInsidePolygons (this, backPolygons, userData);
				}
				if (frontPolygons.length > 0) {
					AddOutsidePolygons (this, frontPolygons, userData);
				}
				if (planePolygons.length > 0) {
					normal = JSM.CalculateNormal (polygon.vertices);
					if (JSM.CoordIsEqual (normal, this.plane.GetNormal ())) {
						AddInsidePolygons (this, planePolygons, userData);
					} else {
						AddOutsidePolygons (this, planePolygons, userData);
					}
				}
			}
		}
		
		return true;
	},
	
	IsLeaf : function ()
	{
		return this.inside === null && this.outside === null;
	}
};

JSM.BSPTree = function ()
{
	this.root = null;
};

JSM.BSPTree.prototype =
{
	AddPolygon : function (polygon, userData)
	{
		if (this.root === null) {
			this.root = new JSM.BSPNode ();
		}
		
		var succeeded = this.root.AddPolygon (polygon, userData);
		return succeeded;
	},
	
	Traverse : function (nodeFound)
	{
		this.TraverseNode (this.root, nodeFound);
	},
	
	TraverseNode : function (node, nodeFound)
	{
		if (node !== null) {
			nodeFound (node);
			this.TraverseNode (node.inside, nodeFound);
			this.TraverseNode (node.outside, nodeFound);
		}
	},
	
	NodeCount : function ()
	{
		var nodeCount = 0;
		this.Traverse (function (node) {
			nodeCount++;
		});
		return nodeCount;
	}
};
