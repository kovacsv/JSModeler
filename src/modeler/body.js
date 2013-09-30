JSM.BodyVertex = function (position)
{
	this.position = JSM.ValueOrDefault (position, new JSM.Coord ());
};

JSM.BodyPolygon = function (vertices)
{
	this.vertices = JSM.ValueOrDefault (vertices, []);
	this.material = -1;
	this.curved = -1;
};

JSM.Body = function ()
{
	this.vertices = [];
	this.polygons = [];
	this.projection = 'Cubic';
	this.coords = new JSM.CoordSystem (
		new JSM.Coord (0.0, 0.0, 0.0),
		new JSM.Coord (1.0, 0.0, 0.0),
		new JSM.Coord (0.0, 1.0, 0.0),
		new JSM.Coord (0.0, 0.0, 1.0)
	);
};

JSM.BodyVertex.prototype =
{
	GetPosition : function ()
	{
		return this.position;
	},

	SetPosition : function (position)
	{
		this.position = position;
	},
	
	Clone : function ()
	{
		return new JSM.BodyVertex (this.position.Clone ());
	}
};

JSM.BodyPolygon.prototype =
{
	AddVertexIndex : function (index)
	{
		this.vertices.push (index);
	},

	GetVertexIndex : function (index)
	{
		return this.vertices[index];
	},

	VertexIndexCount : function ()
	{
		return this.vertices.length;
	},
	
	HasMaterialIndex : function ()
	{
		return this.material !== -1;
	},
	
	GetMaterialIndex : function ()
	{
		return this.material;
	},
	
	SetMaterialIndex : function (material)
	{
		this.material = material;
	},

	HasCurveGroup : function ()
	{
		return this.curved !== -1;
	},
	
	GetCurveGroup : function ()
	{
		return this.curved;
	},
	
	SetCurveGroup : function (group)
	{
		this.curved = group;
	},
	
	InheritAttributes : function (source)
	{
		this.material = source.material;
		this.curved = source.curved;
	},
	
	Clone : function ()
	{
		var result = new JSM.BodyPolygon ();
		var i;
		for (i = 0; i < this.vertices.length; i++) {
			result.vertices.push (this.vertices[i]);
		}
		result.material = this.material;
		result.curved = this.curved;
		return result;
	}
};

JSM.Body.prototype =
{
	AddVertex : function (vertex)
	{
		this.vertices.push (vertex);
		return this.vertices.length - 1;
	},

	AddPolygon : function (polygon)
	{
		this.polygons.push (polygon);
		return this.polygons.length - 1;
	},

	GetVertex : function (index)
	{
		return this.vertices[index];
	},
	
	GetVertexPosition : function (index)
	{
		return this.vertices[index].position;
	},

	GetPolygon : function (index)
	{
		return this.polygons[index];
	},

	VertexCount : function ()
	{
		return this.vertices.length;
	},
	
	PolygonCount : function ()
	{
		return this.polygons.length;
	},
	
	SetVertexPosition : function (index, position)
	{
		this.vertices[index].position = position;
	},
	
	SetPolygonsMaterialIndex : function (material)
	{
		var i;
		for (i = 0; i < this.polygons.length; i++) {
			this.polygons[i].SetMaterialIndex (material);
		}
	},

	SetPolygonsCurveGroup : function (group)
	{
		var i;
		for (i = 0; i < this.polygons.length; i++) {
			this.polygons[i].SetCurveGroup (group);
		}
	},
	
	GetTextureProjectionType : function ()
	{
		return this.projection;
	},

	SetTextureProjectionType : function (projection)
	{
		this.projection = projection;
	},

	GetTextureProjectionCoords : function ()
	{
		return this.coords;
	},
	
	SetTextureProjectionCoords : function (coords)
	{
		this.coords = coords;
	},

	Transform : function (transformation)
	{
		var i;
		for (i = 0; i < this.vertices.length; i++) {
			this.vertices[i].position = transformation.Apply (this.vertices[i].position);
		}
		
		if (this.coords !== null) {
			var absoluteSystem = JSM.CoordSystemToAbsoluteCoords (this.coords);
			absoluteSystem.origo = transformation.Apply (absoluteSystem.origo);
			absoluteSystem.e1 = transformation.Apply (absoluteSystem.e1);
			absoluteSystem.e2 = transformation.Apply (absoluteSystem.e2);
			absoluteSystem.e3 = transformation.Apply (absoluteSystem.e3);
			this.coords = JSM.CoordSystemToDirectionVectors (absoluteSystem);
		}
	},

	GetCenter : function ()
	{
		var boundingBox = this.GetBoundingBox ();
		return JSM.MidCoord (boundingBox[0], boundingBox[1]);
	},
	
	GetBoundingBox : function ()
	{
		var min = new JSM.Coord (JSM.Inf, JSM.Inf, JSM.Inf);
		var max = new JSM.Coord (-JSM.Inf, -JSM.Inf, -JSM.Inf);
	
		var i, coord;
		for (i = 0; i < this.vertices.length; i++) {
			coord = this.vertices[i].position;
			min.x = JSM.Minimum (min.x, coord.x);
			min.y = JSM.Minimum (min.y, coord.y);
			min.z = JSM.Minimum (min.z, coord.z);
			max.x = JSM.Maximum (max.x, coord.x);
			max.y = JSM.Maximum (max.y, coord.y);
			max.z = JSM.Maximum (max.z, coord.z);
		}
		
		return [min, max];
	},
	
	GetBoundingSphereRadius : function ()
	{
		var center = this.GetCenter ();
		var radius = 0.0;
		
		var i, current;
		for (i = 0; i < this.vertices.length; i++) {
			current = JSM.CoordDistance (center, this.vertices[i].position);
			if (JSM.IsGreater (current, radius)) {
				radius = current;
			}
		}
		
		return radius;
	},
		
	OffsetToOrigo : function ()
	{
		var center = this.GetCenter ();
		center = JSM.VectorMultiply (center, -1.0);

		var i;
		for (i = 0; i < this.vertices.length; i++) {
			this.vertices[i].position = JSM.CoordAdd (this.vertices[i].position, center);
		}
	},

	Merge : function (body)
	{
		var oldVertexCount = this.vertices.length;
		
		var i, j;
		for (i = 0; i < body.VertexCount (); i++) {
			this.vertices.push (body.GetVertex (i).Clone ());
		}
		
		var newPolygon;
		for (i = 0; i < body.PolygonCount (); i++) {
			newPolygon = body.GetPolygon (i).Clone ();
			for (j = 0; j < newPolygon.VertexIndexCount (); j++) {
				newPolygon.vertices[j] += oldVertexCount;
			}
			this.polygons.push (newPolygon);
		}
	},
	
	Clear : function ()
	{
		this.vertices = [];
		this.polygons = [];
		this.projection = null;
		this.coords = null;
	}
};
