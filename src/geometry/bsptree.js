JSM.BSPNode = function ()
{
	this.polygon = null;
	this.userData = null;
	this.plane = null;
	this.inside = null;
	this.outside = null;
};

JSM.BSPNode.prototype =
{
	AddPolygon : function (polygon, userData)
	{
		if (polygon.VertexCount () < 3) {
			return false;
		}
		
		var normal = JSM.CalculateNormal (polygon.vertices);
		var plane = JSM.GetPlaneFromCoordAndDirection (polygon.GetVertex (0), normal);
		if (this.polygon === null) {
			this.polygon = polygon;
			if (userData !== undefined) {
				this.userData = userData;
			}
			this.plane = plane;
		} else {
			// If a polygon being pushed through the tree is coplanar with a node plane,
			// test the polygon normal so see if it matches the plane normal.
			// If they match, push it down the inside. If they don't, push it down the outside. 
		
			var insidePolygons = [];
			var outsidePolygons = [];
			var cutSucceeded = JSM.CutPolygonWithPlane (polygon, this.plane, outsidePolygons, insidePolygons);
			JSM.Assert (cutSucceeded, 'Cut not succeeded.');
			
			if (cutSucceeded) {
				var i;
				if (insidePolygons.length > 0) {
					if (this.inside === null) {
						this.inside = new JSM.BSPNode ();
					}
					for (i = 0; i < insidePolygons.length; i++) {
						this.inside.AddPolygon (insidePolygons[i], userData);
					}
				}
				if (outsidePolygons.length > 0) {
					if (this.outside === null) {
						this.outside = new JSM.BSPNode ();
					}
					for (i = 0; i < outsidePolygons.length; i++) {
						this.outside.AddPolygon (outsidePolygons[i], userData);
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
		function TraverseNode (node, nodeFound)
		{
			if (node !== null) {
				nodeFound (node);
				TraverseNode (node.inside, nodeFound);
				TraverseNode (node.outside, nodeFound);
			}
		}
	
		TraverseNode (this.root, nodeFound);
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
