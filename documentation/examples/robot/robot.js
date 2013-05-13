JSM.RobotModule = function (rotationOrigo, rotationAxis, rotationAngle, minRotationAngle, maxRotationAngle, height)
{
	this.rotationOrigo = new THREE.Vector3 (rotationOrigo[0], rotationOrigo[1], rotationOrigo[2]);
	this.rotationAxis = new THREE.Vector3 (rotationAxis[0], rotationAxis[1], rotationAxis[2]);
	this.rotationAngle = rotationAngle;
	this.minRotationAngle = minRotationAngle;
	this.maxRotationAngle = maxRotationAngle;
	this.height = height;
	this.meshes = [];
};

JSM.RobotModule.prototype =
{
	AddMeshes : function (body, materials)
	{
		var meshes = JSM.ConvertBodyToThreeMeshes (body, materials);
		for (i = 0; i < meshes.length; i++) {
			this.meshes.push (meshes[i]);
		}
		this.SetPosition (this.rotationOrigo);
	},

	Rotate : function (matrix, angle)
	{
		var newAngle = this.rotationAngle + angle;
		
		var validAngle = false;
		if (this.minRotationAngle == 0.0 && this.maxRotationAngle == 0.0) {
			validAngle = true;
		} else if (newAngle >= this.minRotationAngle && newAngle <= this.maxRotationAngle) {
			validAngle = true;
		}
		
		if (validAngle) {
			this.rotationAngle = newAngle;
		}
		
		matrix.multiply (this.GetRotationMatrix ());
		this.RotateMeshes (matrix);
	},	

	SetPosition : function (position)
	{
		var i;
		for (i = 0; i < this.meshes.length; i++) {
			this.meshes[i].position = position.clone ();
		}
	},

	RotateMeshes : function (matrix)
	{
		var i;
		for (i = 0; i < this.meshes.length; i++) {
			this.meshes[i].matrix = matrix;
			this.meshes[i].rotation.setEulerFromRotationMatrix (matrix);
		}
	},

	GetRotationMatrix : function ()
	{
		var matrix = new THREE.Matrix4 ();
		matrix.makeRotationAxis (this.rotationAxis.normalize (), this.rotationAngle * JSM.DegRad);
		return matrix;
	}
}

JSM.RobotLogic = function ()
{
	this.modules = [];
};

JSM.RobotLogic.prototype =
{
	AddModule : function (rotationOrigo, rotationAxis, rotationAngle, minRotationAngle, maxRotationAngle, height)
	{
		this.modules.push (new JSM.RobotModule (rotationOrigo, rotationAxis, rotationAngle, minRotationAngle, maxRotationAngle, height));
	},

	ModuleCount : function ()
	{
		return this.modules.length;
	},
	
	GetCurrentHeight : function ()
	{
		if ( this.modules.length == 0) {
			return 0.0;
		}
		
		var height = this.modules[0].rotationOrigo.z;
		var i;
		for (i = 0; i < this.modules.length; i++) {
			height += this.modules[i].height;
		}
		return height;
	},
	
	RotateModule : function (index, angle)
	{
		if (this.modules.length == 0) {
			return;
		}
		
		this.SetModuleRotations (index, angle);
		this.SetModulePositions (index);
	},

	SetModuleRotations : function (index, angle)
	{
		var matrix = new THREE.Matrix4 ();
		
		var i;
		for (i = 0; i < this.modules.length; i++) {
			if (i < index) {
				matrix.multiply (this.modules[i].GetRotationMatrix ());
			} else if (i == index) {
				this.modules[i].Rotate (matrix, angle);
			} else {
				this.modules[i].Rotate (matrix, 0);
			}
		}
	},
	
	SetModulePositions : function (index)
	{
		var matrix = this.modules[0].GetRotationMatrix ();
		var position = this.modules[0].rotationOrigo.clone ();
		this.modules[0].SetPosition (position);

		var i, relative;
		for (i = 1; i < this.modules.length; i++) {
			relative = this.modules[i].rotationOrigo.clone ();
			relative.sub (this.modules[i - 1].rotationOrigo);
			relative.add (position);
			position = this.RotateAroundOrigo (relative, matrix, position);
			matrix.multiply (this.modules[i].GetRotationMatrix ());
			if (i > index) {
				this.modules[i].SetPosition (position);
			}
		}			
	},	
	
	RotateAroundOrigo : function (position, matrix, origo)
	{
		var currentPosition = position.clone ();
		currentPosition.sub (new THREE.Vector3 (origo.x, origo.y, origo.z));
		currentPosition.applyMatrix4 (matrix);
		currentPosition.add (new THREE.Vector3 (origo.x, origo.y, origo.z));
		return currentPosition;
	}
};

JSM.Robot = function ()
{
	this.logic = new JSM.RobotLogic ();
	this.armOffset = 0.1;

	this.logic.AddModule ([0.0, 0.0, 0.0], [0.0, 0.0, 1.0], 0.0, 0.0, 0.0, 0.1);
	this.logic.AddModule ([0.0, 0.0, this.armOffset + this.logic.GetCurrentHeight ()], [0.0, 1.0, 0.0], 0.0, -90.0, 90.0, 1.0);
	this.logic.AddModule ([0.0, 0.0, 2.0 * this.armOffset + this.logic.GetCurrentHeight ()], [0.0, 1.0, 0.0], 0.0, -90.0, 90.0, 0.3);
	this.logic.AddModule ([0.0, 0.0, 3.0 * this.armOffset + this.logic.GetCurrentHeight ()], [0.0, 0.0, 1.0], 0.0, 0.0, 0.0, 0.7);
	this.logic.AddModule ([0.0, 0.0, 4.0 * this.armOffset + this.logic.GetCurrentHeight ()], [0.0, 1.0, 0.0], 0.0, -90.0, 90.0, 1.0);
};

JSM.Robot.prototype =
{
	ModuleCount : function ()
	{
		return this.logic.ModuleCount ();
	},

	RotateModule : function (index, angle)
	{
		this.logic.RotateModule (index, angle);
	},

	CreateMeshes : function ()
	{
		var i, j;
		var meshes = [];

		for (i = 0; i < this.logic.modules.length; i++) {
			this.ConvertModule (i);
			for (j = 0; j < this.logic.modules[i].meshes.length; j++) {
				meshes.push (this.logic.modules[i].meshes[j]);
			}
		}

		return meshes;
	},
	
	ConvertModule : function (index)
	{
		var body;

		var mainModuleDim = {
			bottomCylinderRadius : 0.5,
			bottomCylinderHeight : 0.05,
			topCylinderRadius : 0.3,
			topCylinderWidth : 0.3,
			topCylinderHeight : 0.15,
			topCylinderCubeWidth : 0.3
		};
		
		var mainArmDim = {
			width : 0.2,
			height : 0.05,
		};
		
		var rotateArmDim = {
			width : 0.2,
			height : 0.05,
			topCylinderRadius : 0.2
		};
		
		var foreArmDim = {
			width : 0.2,
			height : 0.05,
			bottomCylinderRadius : 0.2,
			bottomSmallCylinderRadius : 0.1
		};
		
		var headArmDim = {
			width : 0.2,
			height : 0.05,
			coneHeight : 0.2
		};
		
		var materials = new JSM.Materials ();
		materials.AddMaterial (new JSM.Material (0xffcc33, 0xffcc33));
		materials.AddMaterial (new JSM.Material (0xcc3333, 0xcc3333));

		if (index == 0) {
			// bottom cylinder
			body = this.GetTransformedCylinder (
				mainModuleDim.bottomCylinderRadius,
				mainModuleDim.bottomCylinderHeight,
				0.0
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);
			
			// cube under top cylinder
			body = this.GetTransformedCube (
				2.0 * mainModuleDim.topCylinderRadius,
				mainModuleDim.topCylinderWidth,
				mainModuleDim.topCylinderHeight,
				0.0,
				mainModuleDim.bottomCylinderHeight
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);
			
			// top cylinder
			body = this.GetTransformedPie (
				mainModuleDim.topCylinderRadius,
				mainModuleDim.topCylinderWidth,
				Math.PI / 2.0,
				mainModuleDim.bottomCylinderHeight + mainModuleDim.topCylinderHeight
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);
		} else if (index == 1) {
			var height = this.logic.modules[index].height + 2.0 * this.armOffset;
			
			// left arm 1
			body = this.GetTransformedCube (
				mainArmDim.width,
				mainArmDim.height,
				height,
				(mainModuleDim.topCylinderWidth + mainArmDim.height) / 2.0,
				0.0
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);
			
			// right arm 1
			body = this.GetTransformedCube (
				mainArmDim.width,
				mainArmDim.height,
				height,
				-(mainModuleDim.topCylinderWidth + mainArmDim.height) / 2.0,
				0.0
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);

			// left arm 2
			body = this.GetTransformedCube (
				2.0 * mainArmDim.width / 3.0,
				mainArmDim.height,
				2.0 * height / 3.0,
				(mainModuleDim.topCylinderWidth + 3.0 * mainArmDim.height) / 2.0,
				height / 6.0
			);
			this.SetBodyMaterial (body, 1);
			this.AddMeshesToModule (index, body, materials);

			// right arm 2
			body = this.GetTransformedCube (
				2.0 * mainArmDim.width / 3.0,
				mainArmDim.height,
				2.0 * height / 3.0,
				-(mainModuleDim.topCylinderWidth + 3.0 * mainArmDim.height) / 2.0,
				height / 6.0
			);
			this.SetBodyMaterial (body, 1);
			this.AddMeshesToModule (index, body, materials);
		} else if (index == 2) {
			var height = this.logic.modules[index].height + this.armOffset;

			// cube between arms
			body = this.GetTransformedCube (
				mainModuleDim.topCylinderWidth - 2.0 * rotateArmDim.height,
				mainModuleDim.topCylinderWidth - 2.0 * rotateArmDim.height,
				2.0 * this.armOffset,
				0.0,
				-this.armOffset
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);
			
			// left arm
			body = this.GetTransformedCube (
				rotateArmDim.width,
				rotateArmDim.height,
				height,
				(mainModuleDim.topCylinderWidth - mainArmDim.height) / 2.0,
				-this.armOffset
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);
			
			// right arm
			body = this.GetTransformedCube (
				rotateArmDim.width,
				rotateArmDim.height,
				height,
				-(mainModuleDim.topCylinderWidth - mainArmDim.height) / 2.0,
				-this.armOffset
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);

			// top cylinder
			body = this.GetTransformedCylinder (
				rotateArmDim.topCylinderRadius,
				mainModuleDim.bottomCylinderHeight,
				height - 2.0 * mainModuleDim.bottomCylinderHeight
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);			
		} else if (index == 3) {
			var height = this.logic.modules[index].height + 3.0 * mainModuleDim.bottomCylinderHeight;
			
			// small cylinder
			body = this.GetTransformedCylinder (
				foreArmDim.bottomSmallCylinderRadius,
				mainModuleDim.bottomCylinderHeight,
				-mainModuleDim.bottomCylinderHeight
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);

			// large cylinder
			body = this.GetTransformedCylinder (
				foreArmDim.bottomCylinderRadius,
				mainModuleDim.bottomCylinderHeight,
				0.0
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);

			// left arm
			body = this.GetTransformedCube (
				foreArmDim.width,
				foreArmDim.height,
				height,
				(mainModuleDim.topCylinderWidth - foreArmDim.height) / 2.0,
				mainModuleDim.bottomCylinderHeight
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);
			
			// right arm
			body = this.GetTransformedCube (
				foreArmDim.width,
				foreArmDim.height,
				height,
				-(mainModuleDim.topCylinderWidth - foreArmDim.height) / 2.0,
				mainModuleDim.bottomCylinderHeight
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);
		} else if (index == 4) {
			var height = this.logic.modules[index].height + this.armOffset;

			// cube between arms
			body = this.GetTransformedCube (
				mainModuleDim.topCylinderWidth - 2.0 * headArmDim.height,
				mainModuleDim.topCylinderWidth - 4.0 * headArmDim.height,
				2.0 * this.armOffset,
				0.0,
				-this.armOffset
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);
			
			// left arm
			body = this.GetTransformedCube (
				headArmDim.width,
				headArmDim.height,
				height,
				(mainModuleDim.topCylinderWidth - 3.0 * headArmDim.height) / 2.0,
				-this.armOffset
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);
			
			// right arm
			body = this.GetTransformedCube (
				headArmDim.width,
				headArmDim.height,
				height,
				-(mainModuleDim.topCylinderWidth - 3.0 * headArmDim.height) / 2.0,
				-this.armOffset
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);

			// end cube between arms
			body = this.GetTransformedCube (
				mainModuleDim.topCylinderWidth - 2.0 * headArmDim.height,
				mainModuleDim.topCylinderWidth - 4.0 * headArmDim.height,
				2.0 * this.armOffset,
				0.0,
				height - 3.0 * this.armOffset
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);

			// end cone
			body = this.GetTransformedCone (
				Math.sqrt (headArmDim.width * headArmDim.width / 2.0),
				headArmDim.coneHeight,
				height - headArmDim.coneHeight / 2.0
			);
			this.SetBodyMaterial (body, 0);
			this.AddMeshesToModule (index, body, materials);
		} else {
			body = this.GetTransformedCube (
				0.2,
				0.2,
				this.logic.modules[index].height,
				0.0,
				0.0
			);
			this.AddMeshesToModule (index, body, materials);
		}
	},
	
	GetTransformedCube : function (xSize, ySize, zSize, translateY, translateZ)
	{
		var body = JSM.GenerateCuboid (xSize, ySize, zSize);
		body.Transform (JSM.TranslationTransformation (new JSM.Vector (0.0, translateY, zSize / 2.0 + translateZ)));
		return body;
	},

	GetTransformedCylinder : function (radius, height, translateZ)
	{
		var body = JSM.GenerateCylinder (radius, height, 50, true, true);
		body.Transform (JSM.TranslationTransformation (new JSM.Vector (0.0, 0.0, height / 2.0 + translateZ)));
		return body;
	},

	GetTransformedPie : function (radius, height, rotateX, translateZ)
	{
		var body = JSM.GeneratePie (radius, height, Math.PI, 50, true, true);
		var transformation = new JSM.Transformation ();
		transformation.Append (JSM.RotationXTransformation (rotateX));
		transformation.Append (JSM.TranslationTransformation (new JSM.Vector (0.0, 0.0, translateZ)));
		body.Transform (transformation);
		return body;
	},

	GetTransformedCone : function (radius, height, translateZ)
	{
		var body = JSM.GenerateCone (0.0, radius, height, 4, true, false);
		var transformation = new JSM.Transformation ();
		transformation.Append (JSM.RotationZTransformation (45.0 * JSM.DegRad));
		transformation.Append (JSM.TranslationTransformation (new JSM.Vector (0.0, 0.0, height / 2.0 + translateZ)));
		body.Transform (transformation);
		return body;
	},

	AddMeshesToModule : function (index, body, materials)
	{
		this.logic.modules[index].AddMeshes (body, materials);
	},
	
	SetBodyMaterial : function (body, index)
	{
		body.SetPolygonsMaterialIndex (index);
	}
};
