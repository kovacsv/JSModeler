JSM.BSPPolygonUserData = function ()
{
	this.id = null;
	this.material = null;
};

JSM.AddBodyToBSPTree = function (body, bspTree, id)
{
	function ConvertBodyPolygonToPolygon (body, index, userData)
	{
		var polygon = body.GetPolygon (index);
		userData.material = polygon.GetMaterialIndex ();
		var result = new JSM.Polygon ();
		var i, coord;
		for (i = 0; i < polygon.VertexIndexCount (); i++) {
			coord = body.GetVertexPosition (polygon.GetVertexIndex (i));
			result.AddVertex (coord.x, coord.y, coord.z);
		}
		return result;
	}

	var i, polygon, userData;
	for (i = 0; i < body.PolygonCount (); i++) {
		userData = new JSM.BSPPolygonUserData (id, 0);
		userData.id = id;
		polygon = ConvertBodyPolygonToPolygon (body, i, userData);
		bspTree.AddPolygon (polygon, userData);
	}
};

JSM.BooleanOperation = function (operation, aBody, bBody)
{
	function AddPolygonToBody (node, body, reversed)
	{
		function AddBodyVertex (coord)
		{
			var merge = false;
			if (merge) {
				var i, current;
				for (i = 0; i < body.VertexCount (); i++) {
					current = body.GetVertexPosition (i);
					if (JSM.CoordIsEqual (current, coord)) {
						return i;
					}
				}
			}

			body.AddVertex (new JSM.BodyVertex (coord));
			return body.VertexCount () - 1;
		}

		var polygon = node.polygon;
		var bodyPolygon = new JSM.BodyPolygon ();

		var i, vertexIndex;
		if (!reversed) {
			for (i = 0; i < polygon.VertexCount (); i++) {
				vertexIndex = AddBodyVertex (polygon.GetVertex (i));
				bodyPolygon.AddVertexIndex (vertexIndex);
			}
		} else {
			for (i = polygon.VertexCount () - 1; i >= 0; i--) {
				vertexIndex = AddBodyVertex (polygon.GetVertex (i));
				bodyPolygon.AddVertexIndex (vertexIndex);
			}
		}
		
		if (node.userData.material !== null) {
			bodyPolygon.SetMaterialIndex (node.userData.material);
		}
		body.AddPolygon (bodyPolygon);
	}

	function IsNodeInTheSideOf (node, side, id)
	{
		var current = node;
		var parent = node.parent;
		while (parent !== null) {
			if (parent.userData.id == id) {
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
	
	function IsNodeOutsideOf (node, id)
	{
		return IsNodeInTheSideOf (node, -1, id);
	}	
	
	function IsNodeInsideOf (node, id)
	{
		return IsNodeInTheSideOf (node, 1, id);
	}
	
	var result = new JSM.Body ();

	var bspTreeBToA = new JSM.BSPTree ();
	JSM.AddBodyToBSPTree (bBody, bspTreeBToA, 'b');
	JSM.AddBodyToBSPTree (aBody, bspTreeBToA, 'a');
	bspTreeBToA.Traverse (function (node) {
		if (operation == 'Union') {
			if (node.userData.id == 'a') {
				if (IsNodeOutsideOf (node, 'b')) {
					AddPolygonToBody (node, result, false);
				}
			}
		} else if (operation == 'Difference') {
			if (node.userData.id == 'a') {
				if (IsNodeOutsideOf (node, 'b')) {
					AddPolygonToBody (node, result, false);
				}
			}
		} else if (operation == 'Intersection') {
			if (node.userData.id == 'a') {
				if (IsNodeInsideOf (node, 'b')) {
					AddPolygonToBody (node, result, false);
				}
			}
		}
	});

	var bspTreeAToB = new JSM.BSPTree ();
	JSM.AddBodyToBSPTree (aBody, bspTreeAToB, 'a');
	JSM.AddBodyToBSPTree (bBody, bspTreeAToB, 'b');
	bspTreeAToB.Traverse (function (node) {
		if (operation == 'Union') {
			if (node.userData.id == 'b') {
				if (IsNodeOutsideOf (node, 'a')) {
					AddPolygonToBody (node, result, false);
				}
			}
		} else if (operation == 'Difference') {
			if (node.userData.id == 'b') {
				if (IsNodeInsideOf (node, 'a')) {
					AddPolygonToBody (node, result, true);
				}
			}
		} else if (operation == 'Intersection') {
			if (node.userData.id == 'b') {
				if (IsNodeInsideOf (node, 'a')) {
					AddPolygonToBody (node, result, false);
				}
			}
		}
	});

	return result;
};
