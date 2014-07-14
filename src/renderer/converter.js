JSM.ConvertBodyToRenderGeometries = function (body, materials, geometries)
{
	function OnGeometryStart (material)
	{
		function ConvertToShaderRGB (hexColor)
		{
			var hexString = hexColor.toString (16);
			while (hexString.length < 6) {
				hexString = '0' + hexString;
			}
			var r = parseInt (hexString.substr (0, 2), 16) / 255.0;
			var g = parseInt (hexString.substr (2, 2), 16) / 255.0;
			var b = parseInt (hexString.substr (4, 2), 16) / 255.0;
			return [r, g, b];
		}

		geometry = new JSM.RenderGeometry ();
		vertices = [];
		normals = [];
		
		geometry.SetMaterial (ConvertToShaderRGB (material.ambient), ConvertToShaderRGB (material.diffuse));
		geometries.push (geometry);
	}

	function OnGeometryEnd (/*material*/)
	{
		geometry.SetVertexArray (vertices);
		geometry.SetNormalArray (normals);
	}

	function OnTriangle (vertex1, vertex2, vertex3, normal1, normal2, normal3/*, uv1, uv2, uv3*/)
	{
		vertices.push (vertex1.x, vertex1.y, vertex1.z);
		vertices.push (vertex2.x, vertex2.y, vertex2.z);
		vertices.push (vertex3.x, vertex3.y, vertex3.z);
		normals.push (normal1.x, normal1.y, normal1.z);
		normals.push (normal2.x, normal2.y, normal2.z);
		normals.push (normal3.x, normal3.y, normal3.z);
	}
	
	var explodeData = {
		hasConvexPolygons : false,
		onGeometryStart : OnGeometryStart,
		onGeometryEnd : OnGeometryEnd,
		onTriangle : OnTriangle
	};
	
	var geometry = null;
	var vertices = null;
	var normals = null;
	JSM.ExplodeBodyToTriangles (body, materials, explodeData);
};

JSM.ConvertModelToRenderGeometries = function (model, materials, geometries)
{
	var i, body;
	for (i = 0; i < model.BodyCount (); i++) {
		body = model.GetBody (i);
		JSM.ConvertBodyToRenderGeometries (body, materials, geometries);
	}
};
