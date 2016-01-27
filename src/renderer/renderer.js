JSM.Renderer = function ()
{
	this.canvas = null;
	this.context = null;
	this.shader = null;
	
	this.lights = null;
	this.bodies = null;
};

JSM.Renderer.prototype.Init = function (canvas)
{
	if (!JSM.IsWebGLEnabled ()) {
		return false;
	}

	if (!this.InitContext (canvas)) {
		return false;
	}

	if (!this.InitView ()) {
		return false;
	}

	if (!this.InitShaders ()) {
		return false;
	}

	if (!this.InitLights ()) {
		return false;
	}	
	
	if (!this.InitBodies ()) {
		return false;
	}

	return true;
};

JSM.Renderer.prototype.InitContext = function (canvas)
{
	this.canvas = canvas;
	if (this.canvas === null) {
		return false;
	}
	
	if (this.canvas.getContext === undefined) {
		return false;
	}

	this.context = this.canvas.getContext ('webgl') || this.canvas.getContext ('experimental-webgl');
	if (this.context === null) {
		return false;
	}

	this.context = JSM.WebGLInitContext (canvas);
	if (this.context === null) {
		return false;
	}

	return true;
};

JSM.Renderer.prototype.InitShaders = function ()
{
	this.shader = new JSM.ShaderProgram (this.context);
	return this.shader.Init ();
};

JSM.Renderer.prototype.InitLights = function ()
{
	this.lights = [];
	return true;
};

JSM.Renderer.prototype.InitBodies = function ()
{
	this.bodies = [];
	return true;
};

JSM.Renderer.prototype.InitView = function ()
{
	this.lights = [];
	return true;
};

JSM.Renderer.prototype.SetClearColor = function (red, green, blue)
{
	this.context.clearColor (red, green, blue, 1.0);
};

JSM.Renderer.prototype.AddLight = function (light)
{
	var maxLightCount = this.shader.GetMaxLightCount ();
	if (this.lights.length >= maxLightCount) {
		return -1;
	}
	this.lights.push (light);
	return this.lights.length - 1;
};

JSM.Renderer.prototype.RemoveLight = function (light)
{
	var index = this.lights.indexOf (light);
	if (index != -1) {
		this.lights.splice (index, 1);
	}
};

JSM.Renderer.prototype.RemoveLights = function ()
{
	this.lights = [];
};

JSM.Renderer.prototype.GetLight = function (index)
{
	return this.lights[index];
};

JSM.Renderer.prototype.AddBody = function (renderBody, textureLoaded)
{
	var shader = this.shader;
	renderBody.EnumerateMeshes (function (mesh) {
		shader.CompileMaterial (mesh.GetMaterial (), textureLoaded);
		shader.CompileMesh (mesh);
	});
	this.bodies.push (renderBody);
};

JSM.Renderer.prototype.AddBodies = function (renderBodies, textureLoaded)
{
	var i, body;
	for (i = 0; i < renderBodies.length; i++) {
		body = renderBodies[i];
		this.AddBody (body, textureLoaded);
	}
};

JSM.Renderer.prototype.EnumerateBodies = function (onBodyFound)
{
	var i;
	for (i = 0; i < this.bodies.length; i++) {
		onBodyFound (this.bodies[i]);
	}
};

JSM.Renderer.prototype.RemoveBody = function (body)
{
	var index = this.bodies.indexOf (body);
	if (index != -1) {
		this.bodies.splice (index, 1);
	}
};

JSM.Renderer.prototype.RemoveBodies = function ()
{
	this.bodies = [];
};

JSM.Renderer.prototype.GetBody = function (index)
{
	return this.bodies[index];
};

JSM.Renderer.prototype.Resize = function ()
{
	this.context.viewport (0, 0, this.canvas.width, this.canvas.height);
};

JSM.Renderer.prototype.FindObjects = function (camera, screenX, screenY)
{
	var screenCoord = new JSM.Coord (screenX, this.canvas.height - screenY, 0.5);
	var aspectRatio = this.canvas.width / this.canvas.height;
	var viewPort = [0, 0, this.canvas.width, this.canvas.height];
	var unprojected = JSM.Unproject (screenCoord, camera.eye, camera.center, camera.up, camera.fieldOfView * JSM.DegRad, aspectRatio, camera.nearClippingPlane, camera.farClippingPlane, viewPort);
	var ray = new JSM.Ray (camera.eye, JSM.CoordSub (unprojected, camera.eye), null);
	
	var result = [];
	this.EnumerateBodies (function (body) {
		var transformation = body.GetTransformation ();
		body.EnumerateMeshesWithFlag (JSM.RenderMaterialFlags.Polygon, function (mesh) {
			var vertexCount = mesh.VertexCount ();
			var i, v0, v1, v2, intersection;
			for (i = 0; i < vertexCount; i += 3) {
				v0 = mesh.GetTransformedVertex (i + 0, transformation);
				v1 = mesh.GetTransformedVertex (i + 1, transformation);
				v2 = mesh.GetTransformedVertex (i + 2, transformation);
				intersection = JSM.RayTriangleIntersection (ray, v0, v1, v2);
				if (intersection !== null) {
					result.push ({
						renderBody : body,
						renderMesh : mesh,
						triangleIndex : parseInt (i / 3, 10),
						intersection : intersection
					});
				}
			}
		});
	});
	result.sort (function (a, b) {
		return a.intersection.distance - b.intersection.distance;
	});
	return result;
};

JSM.Renderer.prototype.Render = function (camera)
{
	function DrawMeshes (renderer, materialType, viewMatrix, projectionMatrix)
	{
		function MaterialTypeToShaderType (materialType)
		{
			function HasFlag (type, flag)
			{
				return type & flag;
			}
			
			if (HasFlag (materialType, JSM.RenderMaterialFlags.Polygon)) {
				if (HasFlag (materialType, JSM.RenderMaterialFlags.Textured)) {
					return JSM.ShaderType.TexturedTriangle;
				} else if (!HasFlag (materialType, JSM.RenderMaterialFlags.Textured)) {
					return JSM.ShaderType.Triangle;
				}
			} else if (HasFlag (materialType, JSM.RenderMaterialFlags.Line)) {
				return JSM.ShaderType.Line;
			}
			return null;
		}

		var shaderType = MaterialTypeToShaderType (materialType);
		var modifyParams = true;
		renderer.EnumerateBodies (function (body) {
			if (body.HasTypedMeshes (materialType)) {
				var matrix = body.GetTransformationMatrix ();
				body.EnumerateTypedMeshes (materialType, function (mesh) {
					if (modifyParams) {
						renderer.shader.UseShader (shaderType);
						renderer.shader.SetParameters (renderer.lights, viewMatrix, projectionMatrix);
						modifyParams = false;
					}
					var material = mesh.GetMaterial ();
					var vertexBuffer = mesh.GetVertexBuffer ();
					var normalBuffer = mesh.GetNormalBuffer ();
					var uvBuffer = mesh.GetUVBuffer ();
					renderer.shader.DrawArrays (material, matrix, vertexBuffer, normalBuffer, uvBuffer);
				});
			}
		});
	}

	this.context.clear (this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
	
	var viewMatrix = JSM.MatrixView (camera.eye, camera.center, camera.up);
	var projectionMatrix = JSM.MatrixPerspective (camera.fieldOfView * JSM.DegRad, this.canvas.width / this.canvas.height, camera.nearClippingPlane, camera.farClippingPlane);

	DrawMeshes (this, JSM.RenderMaterialFlags.Polygon, viewMatrix, projectionMatrix);
	DrawMeshes (this, JSM.RenderMaterialFlags.Polygon + JSM.RenderMaterialFlags.Textured, viewMatrix, projectionMatrix);
	DrawMeshes (this, JSM.RenderMaterialFlags.Line, viewMatrix, projectionMatrix);
	DrawMeshes (this, JSM.RenderMaterialFlags.Polygon + JSM.RenderMaterialFlags.Transparent, viewMatrix, projectionMatrix);
	DrawMeshes (this, JSM.RenderMaterialFlags.Polygon + JSM.RenderMaterialFlags.Transparent + JSM.RenderMaterialFlags.Textured, viewMatrix, projectionMatrix);
};
