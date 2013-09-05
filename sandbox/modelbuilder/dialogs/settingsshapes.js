function GetMaterials (body, color)
{
	var materials = new JSM.Materials ();
	var color = '0x' + color;
	var colorInt = parseInt (color);
	materials.AddMaterial (new JSM.Material (colorInt, colorInt, 1.0));
	body.SetPolygonsMaterialIndex (0);		
	return materials;
}

function TransformBody (body, rotation, offset)
{
	var transformation = new JSM.Transformation ();
	var rotationX = parseFloat (rotation[0]) * JSM.DegRad;
	var rotationY = parseFloat (rotation[1]) * JSM.DegRad;
	var rotationZ = parseFloat (rotation[2]) * JSM.DegRad;
	if (rotationX != 0.0 || rotationY != 0.0 || rotationZ != 0.0) {
		var rotation = JSM.RotationXYZTransformation (rotationX, rotationY, rotationZ);
		transformation.Append (rotation);
	}
	var offsetX = parseFloat (offset[0]);
	var offsetY = parseFloat (offset[1]);
	var offsetZ = parseFloat (offset[2]);
	if (offsetX != 0.0 || offsetY != 0.0 || offsetZ != 0.0) {
		var translation = JSM.TranslationTransformation (new JSM.Coord (offsetX, offsetY, offsetZ));
		transformation.Append (translation);
	}
	body.Transform (transformation);	
}

Cube = function ()
{
	this.meshes = null;
	this.parameters = {
		name : new JSM.Parameter ('name', 'text', 'Cube', 'left'),
		color : new JSM.Parameter ('color', 'color', '008ab8', 'left'),
		xSize : new JSM.Parameter ('x size', 'text', 1, 'left'),
		ySize : new JSM.Parameter ('y size', 'text', 1, 'left'),
		zSize : new JSM.Parameter ('z size', 'text', 1, 'left'),
		rotation : new JSM.Parameter ('rotation', 'coord', [0, 0, 0], 'left'),
		offset : new JSM.Parameter ('offset', 'coord', [0, 0, 0], 'left')
	};
};

Cube.prototype =
{
	Settings : function (existing)
	{
		var settingsDialog = new JSM.SettingsDialog ();
		var myThis = this;
		settingsDialog.OnClosed = function () {
			GenerateShape (myThis, existing);
		};

		settingsDialog.Open ('set cube parameters', this.parameters);
	},
	
	GetBodyAndMaterials : function ()
	{
		var xSize = parseFloat (this.parameters.xSize.value);
		var ySize = parseFloat (this.parameters.ySize.value);
		var zSize = parseFloat (this.parameters.zSize.value);
		var body = null;
		var materials = null;
		if (xSize > 0.0 && ySize > 0.0 && zSize > 0.0) {
			body = JSM.GenerateCuboid (xSize, ySize, zSize);
			materials = GetMaterials (body, this.parameters.color.value);
			TransformBody (body, this.parameters.rotation.value, this.parameters.offset.value);
		}
		
		return [body, materials];
	}
}

Sphere = function ()
{
	this.meshes = null;
	this.parameters = {
		name : new JSM.Parameter ('name', 'text', 'Sphere', 'left'),
		color : new JSM.Parameter ('color', 'color', '008ab8', 'left'),
		radius : new JSM.Parameter ('radius', 'text', 0.5, 'left'),
		segmentation : new JSM.Parameter ('segmentation', 'text', 25, 'left'),
		curved : new JSM.Parameter ('smooth surface', 'check', true, 'left'),
		rotation : new JSM.Parameter ('rotation', 'coord', [0, 0, 0], 'left'),
		offset : new JSM.Parameter ('offset', 'coord', [0, 0, 0], 'left'),
	};
};

Sphere.prototype =
{
	Settings : function (existing)
	{
		var settingsDialog = new JSM.SettingsDialog ();
		var myThis = this;
		settingsDialog.OnClosed = function () {
			GenerateShape (myThis, existing);
		};

		settingsDialog.Open ('set sphere parameters', this.parameters);
	},
	
	GetBodyAndMaterials : function ()
	{
		var radius = parseFloat (this.parameters.radius.value);
		var segmentation = parseInt (this.parameters.segmentation.value);
		var curved = this.parameters.curved.value;
		var body = null;
		var materials = null;
		if (radius > 0.0 && segmentation >= 3) {
			body = JSM.GenerateSphere (radius, segmentation, curved);
			materials = GetMaterials (body, this.parameters.color.value);
			TransformBody (body, this.parameters.rotation.value, this.parameters.offset.value);
		}
		
		return [body, materials];
	}
}

Cylinder = function ()
{
	this.meshes = null;
	this.parameters = {
		name : new JSM.Parameter ('name', 'text', 'Cylinder', 'left'),
		color : new JSM.Parameter ('color', 'color', '008ab8', 'left'),
		radius : new JSM.Parameter ('radius', 'text', 0.5, 'left'),
		height : new JSM.Parameter ('height', 'text', 1, 'left'),
		segmentation : new JSM.Parameter ('segmentation', 'text', 25, 'left'),
		topBottom : new JSM.Parameter ('top and bottom', 'check', true, 'left'),
		curved : new JSM.Parameter ('smooth surface', 'check', true, 'left'),
		rotation : new JSM.Parameter ('rotation', 'coord', [0, 0, 0], 'left'),
		offset : new JSM.Parameter ('offset', 'coord', [0, 0, 0], 'left'),
	};
};

Cylinder.prototype =
{
	Settings : function (existing)
	{
		var settingsDialog = new JSM.SettingsDialog ();
		var myThis = this;
		settingsDialog.OnClosed = function () {
			GenerateShape (myThis, existing);
		};

		settingsDialog.Open ('set cylinder parameters', this.parameters);
	},
	
	GetBodyAndMaterials : function ()
	{
		var radius = parseFloat (this.parameters.radius.value);
		var height = parseFloat (this.parameters.height.value);
		var segmentation = parseInt (this.parameters.segmentation.value);
		var topBottom = this.parameters.topBottom.value;
		var curved = this.parameters.curved.value;
		var body = null;
		var materials = null;
		if (radius > 0.0 && height > 0.0 && segmentation >= 3) {
			body = JSM.GenerateCylinder (radius, height, segmentation, topBottom, curved);
			materials = GetMaterials (body, this.parameters.color.value);
			TransformBody (body, this.parameters.rotation.value, this.parameters.offset.value);
		}
		
		return [body, materials];
	}
}

Pie = function ()
{
	this.meshes = null;
	this.parameters = {
		name : new JSM.Parameter ('name', 'text', 'Pie', 'left'),
		color : new JSM.Parameter ('color', 'color', '008ab8', 'left'),
		radius : new JSM.Parameter ('radius', 'text', 1.0, 'left'),
		height : new JSM.Parameter ('height', 'text', 0.5, 'left'),
		angle : new JSM.Parameter ('angle', 'text', 270, 'left'),
		segmentation : new JSM.Parameter ('segmentation', 'text', 25, 'left'),
		topBottom : new JSM.Parameter ('top and bottom', 'check', true, 'left'),
		curved : new JSM.Parameter ('smooth surface', 'check', true, 'left'),
		rotation : new JSM.Parameter ('rotation', 'coord', [0, 0, 0], 'left'),
		offset : new JSM.Parameter ('offset', 'coord', [0, 0, 0], 'left'),
	};
};

Pie.prototype =
{
	Settings : function (existing)
	{
		var settingsDialog = new JSM.SettingsDialog ();
		var myThis = this;
		settingsDialog.OnClosed = function () {
			GenerateShape (myThis, existing);
		};

		settingsDialog.Open ('set pie parameters', this.parameters);
	},
	
	GetBodyAndMaterials : function ()
	{
		var radius = parseFloat (this.parameters.radius.value);
		var height = parseFloat (this.parameters.height.value);
		var angle = parseInt (this.parameters.angle.value) * JSM.DegRad;
		var segmentation = parseInt (this.parameters.segmentation.value);
		var topBottom = this.parameters.topBottom.value;
		var curved = this.parameters.curved.value;
		var body = null;
		var materials = null;
		if (radius > 0.0 && height > 0.0 && angle > 0 && segmentation >= 3) {
			body = JSM.GeneratePie (radius, height, angle, segmentation, topBottom, curved);
			materials = GetMaterials (body, this.parameters.color.value);
			TransformBody (body, this.parameters.rotation.value, this.parameters.offset.value);
		}
		
		return [body, materials];
	}
}

Cone = function ()
{
	this.meshes = null;
	this.parameters = {
		name : new JSM.Parameter ('name', 'text', 'Cone', 'left'),
		color : new JSM.Parameter ('color', 'color', '008ab8', 'left'),
		topRadius : new JSM.Parameter ('top radius', 'text', 0.3, 'left'),
		bottomRadius : new JSM.Parameter ('bottom radius', 'text', 0.5, 'left'),
		height : new JSM.Parameter ('height', 'text', 1, 'left'),
		segmentation : new JSM.Parameter ('segmentation', 'text', 25, 'left'),
		topBottom : new JSM.Parameter ('top and bottom', 'check', true, 'left'),
		curved : new JSM.Parameter ('smooth surface', 'check', true, 'left'),
		rotation : new JSM.Parameter ('rotation', 'coord', [0, 0, 0], 'left'),
		offset : new JSM.Parameter ('offset', 'coord', [0, 0, 0], 'left'),
	};
};

Cone.prototype =
{
	Settings : function (existing)
	{
		var settingsDialog = new JSM.SettingsDialog ();
		var myThis = this;
		settingsDialog.OnClosed = function () {
			GenerateShape (myThis, existing);
		};

		settingsDialog.Open ('set cone parameters', this.parameters);
	},
	
	GetBodyAndMaterials : function ()
	{
		var topRadius = parseFloat (this.parameters.topRadius.value);
		var bottomRadius = parseFloat (this.parameters.bottomRadius.value);
		var height = parseFloat (this.parameters.height.value);
		var segmentation = parseInt (this.parameters.segmentation.value);
		var topBottom = this.parameters.topBottom.value;
		var curved = this.parameters.curved.value;
		var body = null;
		var materials = null;
		if (topRadius >= 0.0 && bottomRadius >= 0.0 && (topRadius > 0 || bottomRadius > 0) && height > 0.0 && segmentation >= 3) {
			body = JSM.GenerateCone (topRadius, bottomRadius, height, segmentation, topBottom, curved)
			materials = GetMaterials (body, this.parameters.color.value);
			TransformBody (body, this.parameters.rotation.value, this.parameters.offset.value);
		}
		
		return [body, materials];
	}
}

Torus = function ()
{
	this.meshes = null;
	this.parameters = {
		name : new JSM.Parameter ('name', 'text', 'Torus', 'left'),
		color : new JSM.Parameter ('color', 'color', '008ab8', 'left'),
		outerRadius : new JSM.Parameter ('outer radius', 'text', 0.5, 'left'),
		innerRadius : new JSM.Parameter ('inner radius', 'text', 0.25, 'left'),
		outerSegmentation : new JSM.Parameter ('outer segmentation', 'text', 30, 'left'),
		innerSegmentation : new JSM.Parameter ('inner segmentation', 'text', 30, 'left'),
		curved : new JSM.Parameter ('smooth surface', 'check', true, 'left'),
		rotation : new JSM.Parameter ('rotation', 'coord', [0, 0, 0], 'left'),
		offset : new JSM.Parameter ('offset', 'coord', [0, 0, 0], 'left')
	};
};

Torus.prototype =
{
	Settings : function (existing)
	{
		var settingsDialog = new JSM.SettingsDialog ();
		var myThis = this;
		settingsDialog.OnClosed = function () {
			GenerateShape (myThis, existing);
		};

		settingsDialog.Open ('set torus parameters', this.parameters);
	},
	
	GetBodyAndMaterials : function ()
	{
		var outerRadius = parseFloat (this.parameters.outerRadius.value);
		var innerRadius = parseFloat (this.parameters.innerRadius.value);
		var outerSegmentation = parseInt (this.parameters.outerSegmentation.value);
		var innerSegmentation = parseInt (this.parameters.innerSegmentation.value);
		var curved = this.parameters.curved.value;
		var body = null;
		var materials = null;
		if (outerRadius > 0.0 && innerRadius > 0.0 && outerSegmentation >= 3 && innerSegmentation >= 3) {
			body = JSM.GenerateTorus (outerRadius, innerRadius, outerSegmentation, innerSegmentation, curved);
			materials = GetMaterials (body, this.parameters.color.value);
			TransformBody (body, this.parameters.rotation.value, this.parameters.offset.value);
		}
		
		return [body, materials];
	}
}

Prism = function ()
{
	this.meshes = null;
	
	this.parameters = {
		basePolygon : new JSM.Parameter (null, 'polygon', [0.01, []], 'left'),
		name : new JSM.Parameter ('name', 'text', 'Prism', 'right'),
		color : new JSM.Parameter ('color', 'color', '008ab8', 'right'),
		height : new JSM.Parameter ('height', 'text', 1.0, 'right'),
		topBottom : new JSM.Parameter ('top and bottom', 'check', true, 'right'),
		rotation : new JSM.Parameter ('rotation', 'coord', [0, 0, 0], 'right'),
		offset : new JSM.Parameter ('offset', 'coord', [0, 0, 0], 'right')
	};
	
	this.parameters.basePolygon.value[1] = [
		new JSM.Coord2D (-0.5, -0.5),
		new JSM.Coord2D (0.5, -0.5),
		new JSM.Coord2D (0.5, 0.5),
		new JSM.Coord2D (0, 0.5),
		new JSM.Coord2D (0, 0),
		new JSM.Coord2D (-0.5, 0)
	];
};

Prism.prototype =
{
	Settings : function (existing)
	{
		var settingsDialog = new JSM.SettingsDialog ();
		var myThis = this;
		settingsDialog.OnClosed = function () {
			GenerateShape (myThis, existing);
		};

		settingsDialog.Open ('set prism parameters', this.parameters);
	},
	
	GetBodyAndMaterials : function ()
	{
		var direction = new JSM.Vector (0.0, 0.0, 1.0);
		var height = parseFloat (this.parameters.height.value);

		var coords = this.parameters.basePolygon.value[1];
		var basePoints = [];
		var i, coord;
		for (i = 0; i < coords.length; i++) {
			coord = coords[i];
			basePoints.push (new JSM.Coord (coord.x, coord.y, -height / 2.0));
		}
	
		var topBottom = this.parameters.topBottom.value;
		var body = null;
		var materials = null;
		if (basePoints.length >= 3 && height > 0.0) {
			body = JSM.GeneratePrism (basePoints, direction, height, topBottom);
			materials = GetMaterials (body, this.parameters.color.value);
			TransformBody (body, this.parameters.rotation.value, this.parameters.offset.value);
		}

		return [body, materials];
	}
}

PrismShell = function ()
{
	this.meshes = null;
	
	this.parameters = {
		basePolygon : new JSM.Parameter (null, 'polygon', [0.01, []], 'left'),
		name : new JSM.Parameter ('name', 'text', 'Prismshell', 'right'),
		color : new JSM.Parameter ('color', 'color', '008ab8', 'right'),
		height : new JSM.Parameter ('height', 'text', 1.0, 'right'),
		width : new JSM.Parameter ('width', 'text', 0.1, 'right'),
		topBottom : new JSM.Parameter ('top and bottom', 'check', true, 'right'),
		rotation : new JSM.Parameter ('rotation', 'coord', [0, 0, 0], 'right'),
		offset : new JSM.Parameter ('offset', 'coord', [0, 0, 0], 'right')
	};
	
	this.parameters.basePolygon.value[1] = [
		new JSM.Coord2D (-0.5, -0.5),
		new JSM.Coord2D (0.5, -0.5),
		new JSM.Coord2D (0.5, 0.5),
		new JSM.Coord2D (0, 0.5),
		new JSM.Coord2D (0, 0),
		new JSM.Coord2D (-0.5, 0)
	];
};

PrismShell.prototype =
{
	Settings : function (existing)
	{
		var settingsDialog = new JSM.SettingsDialog ();
		var myThis = this;
		settingsDialog.OnClosed = function () {
			GenerateShape (myThis, existing);
		};

		settingsDialog.Open ('set prismshell parameters', this.parameters);
	},
	
	GetBodyAndMaterials : function ()
	{
		var direction = new JSM.Vector (0.0, 0.0, 1.0);
		var height = parseFloat (this.parameters.height.value);
		var width = parseFloat (this.parameters.width.value);

		var coords = this.parameters.basePolygon.value[1];
		var basePoints = [];
		var i, coord;
		for (i = 0; i < coords.length; i++) {
			coord = coords[i];
			basePoints.push (new JSM.Coord (coord.x, coord.y, -height / 2.0));
		}
	
		var topBottom = this.parameters.topBottom.value;
		var body = null;
		var materials = null;
		if (basePoints.length >= 3 && height > 0.0) {
			body = JSM.GeneratePrismShell (basePoints, direction, height, width, topBottom);
			materials = GetMaterials (body, this.parameters.color.value);
			TransformBody (body, this.parameters.rotation.value, this.parameters.offset.value);
		}

		return [body, materials];
	}
}
