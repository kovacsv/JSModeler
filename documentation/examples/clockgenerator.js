JSM.GenerateClock = function (radius, segmentation)
{
	var OffsetBody = function (body, offset)
	{
		var i, vertex;
		for (i = 0; i < body.VertexCount (); i++) {
			vertex = body.GetVertex (i);
			vertex.position = JSM.CoordAdd (vertex.position, offset);
		}
	};

	var RotateBody = function (body, angle)
	{
		body.Transform (JSM.RotationTransformation (new JSM.Vector (0.0, 0.0, 1.0), angle));
	};

	var GenerateClockBody = function ()
	{
		var clockBack = JSM.GenerateCylinder (radius, height, segmentation, true, isCurved);
		clockBack.SetPolygonsMaterialIndex (0);
		clockBack.GetPolygon (segmentation).SetMaterialIndex (1);
		model.AddBody (clockBack);
		
		var clockBorder = JSM.GenerateCylinderShell (radius, height, height, segmentation, true, isCurved);
		clockBorder.SetPolygonsMaterialIndex (0);
		OffsetBody (clockBorder, new JSM.Coord (0.0, 0.0, height));
		model.AddBody (clockBorder);
	};

	var GenerateMarkers = function (length)
	{
		var i, marker, angle;
		for (i = 0; i < 12; i++) {
			marker = JSM.GenerateCuboid (length, height, height / 3.0);
			marker.SetPolygonsMaterialIndex (2);
			angle = i * 30;
			OffsetBody (marker, new JSM.Coord (radius - 2.0 * height - length / 2.0, 0.0, height));
			RotateBody (marker, -angle * JSM.DegRad);
			model.AddBody (marker);
		}
	}
	
	var GeneratePointer = function (length, zOffset)
	{
		var pointer = JSM.GenerateCuboid (length + height / 2.0, height, height / 3.0);
		pointer.SetPolygonsMaterialIndex (2);
		OffsetBody (pointer, new JSM.Coord (length / 2.0 - height / 2.0, 0.0, height + zOffset));
		model.AddBody (pointer);
	};
	
	var model = new JSM.Model ();
	var materials = new JSM.MaterialSet ();
	materials.AddMaterial (new JSM.Material ({ambient : 0xbbbbbb, diffuse : 0xbbbbbb}));
	materials.AddMaterial (new JSM.Material ({ambient : 0xffffff, diffuse : 0xffffff}));
	materials.AddMaterial (new JSM.Material ({ambient : 0x222222, diffuse : 0x222222}));
	
	var height = radius / 20;
	var isCurved = true;
	var markerLength = 2.0 * height;
	
	GenerateClockBody ();
	GenerateMarkers (markerLength);

	var pointerMaxLength = radius - markerLength - 3.0 * height;
	GeneratePointer (pointerMaxLength / 3.0, height / 3.0);
	GeneratePointer (pointerMaxLength * 2.0 / 3.0, height * 2.0 / 3.0);
	GeneratePointer (pointerMaxLength, height);

	return [model, materials];
};
