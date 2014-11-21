JSM.BodySmartBuilder = function (box)
{
	this.body = new JSM.Body ();
	this.octree = new JSM.Octree (box);
	this.normals = [];
};

JSM.BodySmartBuilder.prototype.AddVertex = function (coord)
{
	var index = this.octree.FindCoord (coord);
	if (index == -1) {
		this.octree.AddCoord (coord);
		index = this.body.AddVertex (new JSM.BodyVertex (coord));
	}
	return index;
};

JSM.BodySmartBuilder.prototype.AddPolygon = function (coords)
{
	function MergePolygons (body, aPolygonIndex, bPolygonIndex)
	{
		function MergeToAnother (body, aPolygonIndex, bPolygonIndex)
		{
			function GetPolygonVertexIndicesOnSector (body, sector, vertices)
			{
				var result = [];
				var i, index, coord;
				for (i = 0; i < vertices.length; i++) {
					index = vertices[i];
					coord = body.GetVertexPosition (index);
					if (JSM.CoordSectorPosition (coord, sector) == 'CoordInsideOfSector') {
						result.push (index);
					}
				}
				return result;
			}

			function GetEdgeSector (body, vertices, fromIndex)
			{
				var from = vertices[fromIndex];
				var to = aVertices[fromIndex < vertices.length - 1 ? fromIndex + 1 : 0];
				return new JSM.Sector (body.GetVertexPosition (from), body.GetVertexPosition (to));
			}
			
			var aPolygon = body.GetPolygon (aPolygonIndex);
			var bPolygon = body.GetPolygon (bPolygonIndex);
			var aVertices = aPolygon.GetVertexIndices ();
			var bVertices = bPolygon.GetVertexIndices ();

			var newVertices = [];
			var i, j, sector, verticesOnEdge;
			for (i = 0; i < aVertices.length; i++) {
				sector = GetEdgeSector (body, aVertices, i);
				newVertices.push (aVertices[i]);
				verticesOnEdge = GetPolygonVertexIndicesOnSector (body, sector, bVertices);
				for (j = 0; j < verticesOnEdge.length; j++) {
					newVertices.push (verticesOnEdge[j]);
				}
			}
			aPolygon.SetVertexIndices (newVertices);
		}
	
		if (aPolygonIndex == bPolygonIndex) {
			return;
		}
		
		MergeToAnother (body, aPolygonIndex, bPolygonIndex);
		MergeToAnother (body, bPolygonIndex, aPolygonIndex);
	}

	var polygon = new JSM.BodyPolygon ([]);
	var i, index;
	for (i = 0; i < coords.length; i++) {
		index = this.AddVertex (coords[i]);
		polygon.AddVertexIndex (index);
	}
	
	var pgonIndex = this.body.AddPolygon (polygon);
	for (i = 0; i < this.body.PolygonCount (); i++) {
		MergePolygons (this.body, i, pgonIndex);
	}
};

JSM.BodySmartBuilder.prototype.GetBody = function ()
{
	return this.body;
};
