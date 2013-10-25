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
	function AddPolygonToBody (polygon, body, reversed)
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
		
		if (polygon.userData !== undefined) {
			bodyPolygon.SetMaterialIndex (polygon.userData.material);
		}
		body.AddPolygon (bodyPolygon);
	}

	function AddPolygonsToBody (polygons, body, reversed)
	{
		var i;
		for (i = 0; i < polygons.length; i++) {
			AddPolygonToBody (polygons[i], body, reversed);
		}
	}
	
	function ClipNodePolygonsWithTree (nodes, tree, frontPolygons, backPolygons, planarFrontPolygons, planarBackPolygons)
	{
		function SetPolygonsUserData (polygons, userData)
		{
			var i;
			for (i = 0; i < polygons.length; i++) {
				polygons[i].userData = userData;
			}
		}
	
		var i, node;
		for (i = 0; i < nodes.length; i++) {
			node = nodes[i];
			JSM.ClipPolygonWithBSPTree (node.polygon, tree, frontPolygons, backPolygons, planarFrontPolygons, planarBackPolygons);
			SetPolygonsUserData (frontPolygons, node.userData);
			SetPolygonsUserData (backPolygons, node.userData);
			SetPolygonsUserData (planarFrontPolygons, node.userData);
			SetPolygonsUserData (planarBackPolygons, node.userData);
		}
	}

	var aTree = new JSM.BSPTree ();
	var bTree = new JSM.BSPTree ();
	JSM.AddBodyToBSPTree (aBody, aTree, 'a');
	JSM.AddBodyToBSPTree (bBody, bTree, 'b');

	var result = new JSM.Body ();
	
	var aFrontPolygons = [];
	var aBackPolygons = [];
	var aPlanarFrontPolygons = [];
	var aPlanarBackPolygons = [];	
	ClipNodePolygonsWithTree (aTree.GetNodes (), bTree, aFrontPolygons, aBackPolygons, aPlanarFrontPolygons, aPlanarBackPolygons);

	var bFrontPolygons = [];
	var bBackPolygons = [];
	var bPlanarFrontPolygons = [];
	var bPlanarBackPolygons = [];	
	ClipNodePolygonsWithTree (bTree.GetNodes (), aTree, bFrontPolygons, bBackPolygons, bPlanarFrontPolygons, bPlanarBackPolygons);

	if (operation == 'Union') {
		AddPolygonsToBody (aFrontPolygons, result, false);
		AddPolygonsToBody (bFrontPolygons, result, false);
		AddPolygonsToBody (bPlanarBackPolygons, result, false);
	} else if (operation == 'Difference') {
		AddPolygonsToBody (aFrontPolygons, result, false);
		AddPolygonsToBody (aPlanarFrontPolygons, result, false);
		AddPolygonsToBody (bBackPolygons, result, true);
	} else if (operation == 'Intersection') {
		AddPolygonsToBody (aBackPolygons, result, false);
		AddPolygonsToBody (aPlanarBackPolygons, result, false);
		AddPolygonsToBody (bBackPolygons, result, false);
	}

	return result;
};
