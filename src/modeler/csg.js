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

JSM.Difference = function (aBody, bBody)
{
	function AddPolygonToBody (polygon, body)
	{
		var oldVertexCount = body.VertexCount ();
		var bodyPolygon = new JSM.BodyPolygon ();
		
		var i;
		for (i = 0; i < polygon.VertexCount (); i++) {
			body.AddVertex (new JSM.BodyVertex (polygon.GetVertex (i)));
			bodyPolygon.AddVertexIndex (oldVertexCount + i);
		}
		
		body.AddPolygon (bodyPolygon);
	}

	function AddAllOutside (bspTree, body, parentNode, userData)
	{
		bspTree.TraverseNode (parentNode.outside, function (node) {
			if (node.userData == userData) {
				AddPolygonToBody (node.polygon, body);
			}
		});
	}
	
	function AddAllInside (bspTree, body, parentNode, userData)
	{
		bspTree.TraverseNode (parentNode.inside, function (node) {
			if (node.userData == userData) {
				AddPolygonToBody (node.polygon, body);
			}
		});
	}
	
	var bspTree = new JSM.BSPTree ();
	JSM.AddBodyToBSPTree (bBody, bspTree, 'b');
	JSM.AddBodyToBSPTree (aBody, bspTree, 'a');
	
	var result = new JSM.Body ();
	bspTree.Traverse (function (node) {
		if (node.userData == 'b') {
			AddAllOutside (bspTree, result, node, 'a');
		}
	});

	var bspTree = new JSM.BSPTree ();
	JSM.AddBodyToBSPTree (aBody, bspTree, 'a');
	JSM.AddBodyToBSPTree (bBody, bspTree, 'b');
	bspTree.Traverse (function (node) {
		if (node.userData == 'a') {
			//AddAllInside (bspTree, result, node, 'b');
		}
	});

	return result;
};
