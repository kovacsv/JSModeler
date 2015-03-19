/**
* Function: AddVertexToBody
* Description: Adds a vertex to an existing body.
* Parameters:
*	body {TriangleBody} the body
* Returns:
*	{Octree} the result
*/
JSM.ConvertTriangleBodyToOctree = function (body)
{
	var result = new JSM.TriangleOctree (body.GetBoundingBox ());
	var i, triangle, v0, v1, v2;
	for (i = 0; i < body.TriangleCount (); i++) {
		triangle = body.GetTriangle (i);
		v0 = body.GetVertex (triangle.v0);
		v1 = body.GetVertex (triangle.v1);
		v2 = body.GetVertex (triangle.v2);
		result.AddTriangle (v0, v1, v2, {
			triangleIndex : i
		});
	}
	return result;
};
