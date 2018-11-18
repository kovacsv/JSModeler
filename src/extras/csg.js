/**
* Function: BooleanOperation
* Description: Makes a boolean operation on the given bodies.
* Parameters:
*	operation {string} the operation ('Union', 'Difference', or 'Intersection')
*	aBody {Body} the first body
*	bBody {Body} the second body
* Returns:
*	{Body} the result
*/
JSM.BooleanOperation = function (operation, aBody, bBody)
{
	function AddPolygonToBody (polygon, body, octree, reversed)
	{
		function AddBodyVertex (coord, octree)
		{
			var merge = false;
			if (merge) {
				var index = octree.FindCoord (coord);
				if (index == -1) {
					index = body.AddVertex (new JSM.BodyVertex (coord));
					octree.AddCoord (coord);
				}
				return index;
			}
			
			return body.AddVertex (new JSM.BodyVertex (coord));
		}

		var bodyPolygon = new JSM.BodyPolygon ([]);

		var i, vertexIndex;
		if (!reversed) {
			for (i = 0; i < polygon.VertexCount (); i++) {
				vertexIndex = AddBodyVertex (polygon.GetVertex (i), octree);
				bodyPolygon.AddVertexIndex (vertexIndex);
			}
		} else {
			for (i = polygon.VertexCount () - 1; i >= 0; i--) {
				vertexIndex = AddBodyVertex (polygon.GetVertex (i), octree);
				bodyPolygon.AddVertexIndex (vertexIndex);
			}
		}
		
		if (polygon.userData !== undefined) {
			bodyPolygon.SetMaterialIndex (polygon.userData.material);
		}
		body.AddPolygon (bodyPolygon);
	}

	function AddPolygonsToBody (polygons, body, octree, reversed)
	{
		var i;
		for (i = 0; i < polygons.length; i++) {
			AddPolygonToBody (polygons[i], body, octree, reversed);
		}
	}
	
	function ClipNodePolygonsWithTree (nodes, tree, frontPolygons, backPolygons, planarFrontPolygons, planarBackPolygons)
	{
		function SetPolygonsUserData (polygons, userData)
		{
			var i, polygon;
			for (i = 0; i < polygons.length; i++) {
				polygon = polygons[i];
				if (polygon.userData === undefined) {
					polygon.userData = userData;
				}
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

	var result = new JSM.Body ();
	var resultOctree = new JSM.Octree (JSM.BoxUnion (aBody.GetBoundingBox (), bBody.GetBoundingBox ()));
	
	if (operation == 'Union') {
		AddPolygonsToBody (aFrontPolygons, result, resultOctree, false);
		AddPolygonsToBody (aPlanarFrontPolygons, result, resultOctree, false);
		AddPolygonsToBody (aPlanarBackPolygons, result, resultOctree, false);
		AddPolygonsToBody (bFrontPolygons, result, resultOctree, false);
		AddPolygonsToBody (bPlanarFrontPolygons, result, resultOctree, false);
	} else if (operation == 'Difference') {
		AddPolygonsToBody (aFrontPolygons, result, resultOctree, false);
		AddPolygonsToBody (aPlanarFrontPolygons, result, resultOctree, false);
		AddPolygonsToBody (bBackPolygons, result, resultOctree, true);
	} else if (operation == 'Intersection') {
		AddPolygonsToBody (aBackPolygons, result, resultOctree, false);
		AddPolygonsToBody (aPlanarBackPolygons, result, resultOctree, false);
		AddPolygonsToBody (bBackPolygons, result, resultOctree, false);
	}

	return result;
};
