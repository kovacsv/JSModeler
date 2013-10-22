JSM.AddBodyToBSPTree = function (body, bspTree, userData)
{
	function ConvertBodyPolygonToPolygon (body, index)
	{
		var polygon = body.GetPolygon (index);
		var result = new JSM.Polygon ();
		var i, coord;
		for (i = 0; i < polygon.VertexIndexCount (); i++) {
			coord = body.GetVertexPosition (polygon.GetVertexIndex (i));
			result.AddVertex (coord.x, coord.y, coord.z);
		}
		return result;
	}

	var i, polygon;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = ConvertBodyPolygonToPolygon (body, i);
		bspTree.AddPolygon (polygon, userData);
	}
};

JSM.BooleanOperation = function (operation, aBody, bBody)
{
	function AddPolygonToBody (polygon, body, reversed)
	{
		var oldVertexCount = body.VertexCount ();
		
		var i;
		if (!reversed) {
			for (i = 0; i < polygon.VertexCount (); i++) {
				body.AddVertex (new JSM.BodyVertex (polygon.GetVertex (i)));
			}
		} else {
			for (i = polygon.VertexCount () - 1; i >= 0; i--) {
				body.AddVertex (new JSM.BodyVertex (polygon.GetVertex (i)));
			}
		}
		
		var bodyPolygon = new JSM.BodyPolygon ();
		for (i = 0; i < polygon.VertexCount (); i++) {
			bodyPolygon.AddVertexIndex (oldVertexCount + i);
		}
		body.AddPolygon (bodyPolygon);
	}

	function IsNodeInTheSideOf (node, side, userData)
	{
		var current = node;
		var parent = node.parent;
		while (parent !== null) {
			if (parent.userData == userData) {
				if (side == -1) {
					if (parent.inside == current) {
						return false;
					} else if (parent.outside == current) {
						return true;
					}
				} else if (side == 1) {
					if (parent.outside == current) {
						return false;
					} else if (parent.inside == current) {
						return true;
					}
				}
			}
			current = parent;
			parent = current.parent;
		}
		return false;	
	}
	
	function IsNodeOutsideOf (node, userData)
	{
		return IsNodeInTheSideOf (node, -1, userData);
	}	
	
	function IsNodeInsideOf (node, userData)
	{
		return IsNodeInTheSideOf (node, 1, userData);
	}
	
	var result = new JSM.Body ();

	var bspTreeBToA = new JSM.BSPTree ();
	JSM.AddBodyToBSPTree (bBody, bspTreeBToA, 'b');
	JSM.AddBodyToBSPTree (aBody, bspTreeBToA, 'a');
	bspTreeBToA.Traverse (function (node) {
		if (operation == 'Union') {
			if (node.userData == 'a') {
				if (IsNodeOutsideOf (node, 'b')) {
					AddPolygonToBody (node.polygon, result, false);
				}
			}
		} else if (operation == 'Difference') {
			if (node.userData == 'a') {
				if (IsNodeOutsideOf (node, 'b')) {
					AddPolygonToBody (node.polygon, result, false);
				}
			}
		} else if (operation == 'Intersection') {
			if (node.userData == 'a') {
				if (IsNodeInsideOf (node, 'b')) {
					AddPolygonToBody (node.polygon, result, false);
				}
			}
		}
	});

	var bspTreeAToB = new JSM.BSPTree ();
	JSM.AddBodyToBSPTree (aBody, bspTreeAToB, 'a');
	JSM.AddBodyToBSPTree (bBody, bspTreeAToB, 'b');
	bspTreeAToB.Traverse (function (node) {
		if (operation == 'Union') {
			if (node.userData == 'b') {
				if (IsNodeOutsideOf (node, 'a')) {
					AddPolygonToBody (node.polygon, result, false);
				}
			}
		} else if (operation == 'Difference') {
			if (node.userData == 'b') {
				if (IsNodeInsideOf (node, 'a')) {
					AddPolygonToBody (node.polygon, result, true);
				}
			}
		} else if (operation == 'Intersection') {
			if (node.userData == 'b') {
				if (IsNodeInsideOf (node, 'a')) {
					AddPolygonToBody (node.polygon, result, false);
				}
			}
		}
	});

	return result;
};
