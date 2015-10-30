JSM.Renderer = function ()
{
	this.canvas = null;
	this.context = null;
	this.shaders = null;
	
	this.light = null;
	this.bodies = null;
};

JSM.Renderer.prototype.Init = function (canvas, light)
{
	if (!JSM.IsWebGLEnabled ()) {
		return false;
	}

	if (!this.InitContext (canvas)) {
		return false;
	}

	if (!this.InitView (light)) {
		return false;
	}

	if (!this.InitShaders ()) {
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

	this.context.enable (this.context.DEPTH_TEST);
	this.context.depthFunc (this.context.LEQUAL);
	
	this.context.enable (this.context.BLEND);
	this.context.blendEquation (this.context.FUNC_ADD);
	this.context.blendFunc (this.context.SRC_ALPHA, this.context.ONE_MINUS_SRC_ALPHA);
	
	return true;
};

JSM.Renderer.prototype.InitShaders = function ()
{
	this.shaders = new JSM.ShaderStore ();
	return this.shaders.Init (this.context);
};

JSM.Renderer.prototype.InitBodies = function ()
{
	this.bodies = [];
	return true;
};

JSM.Renderer.prototype.InitView = function (light)
{
	var theLight = JSM.ValueOrDefault (light, new JSM.Light ());
	this.light = new JSM.RenderLight (theLight.ambient, theLight.diffuse, theLight.specular, theLight.direction);
	if (!this.light) {
		return false;
	}
	
	return true;
};

JSM.Renderer.prototype.SetClearColor = function (red, green, blue)
{
	this.context.clearColor (red, green, blue, 1.0);
};

JSM.Renderer.prototype.AddRenderBody = function (renderBody, textureLoaded)
{
	function CompileMaterial (material, context, textureLoaded)
	{
		if (material.texture !== null) {
			material.textureBuffer = context.createTexture ();
			material.textureImage = new Image ();
			material.textureImage.src = material.texture;
			material.textureImage.onload = function () {
				var textureImage = JSM.ResizeImageToPowerOfTwoSides (material.textureImage);
				context.bindTexture (context.TEXTURE_2D, material.textureBuffer);
				context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
				context.texParameteri (context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_LINEAR);
				context.texImage2D (context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, textureImage);
				context.generateMipmap (context.TEXTURE_2D);
				context.bindTexture (context.TEXTURE_2D, null);
				if (textureLoaded !== undefined && textureLoaded !== null) {
					textureLoaded ();
				}
			};
		}
	}
	
	function CompileMesh (mesh, context)
	{
		mesh.vertexBuffer = context.createBuffer ();
		context.bindBuffer (context.ARRAY_BUFFER, mesh.vertexBuffer);
		context.bufferData (context.ARRAY_BUFFER, mesh.vertexArray, context.STATIC_DRAW);
		mesh.vertexBuffer.itemSize = 3;
		mesh.vertexBuffer.numItems = parseInt (mesh.vertexArray.length / 3, 10);

		mesh.normalBuffer = context.createBuffer ();
		context.bindBuffer (context.ARRAY_BUFFER, mesh.normalBuffer);
		context.bufferData (context.ARRAY_BUFFER, mesh.normalArray, context.STATIC_DRAW);
		mesh.normalBuffer.itemSize = 3;
		mesh.normalBuffer.numItems = parseInt (mesh.normalArray.length / 3, 10);

		if (mesh.uvArray !== null) {
			mesh.uvBuffer = context.createBuffer ();
			context.bindBuffer (context.ARRAY_BUFFER, mesh.uvBuffer);
			context.bufferData (context.ARRAY_BUFFER, mesh.uvArray, context.STATIC_DRAW);
			mesh.uvBuffer.itemSize = 2;
			mesh.uvBuffer.numItems = parseInt (mesh.uvArray.length / 2, 10);
		}
	}

	var renderer = this;
	renderBody.EnumerateMeshes (function (mesh) {
		CompileMaterial (mesh.material, renderer.context, textureLoaded);
		CompileMesh (mesh, renderer.context);
	});
	this.bodies.push (renderBody);
};

JSM.Renderer.prototype.AddRenderBodies = function (renderBodies, textureLoaded)
{
	var i, body;
	for (i = 0; i < renderBodies.length; i++) {
		body = renderBodies[i];
		this.AddRenderBody (body, textureLoaded);
	}
};

JSM.Renderer.prototype.EnumerateBodies = function (onBodyFound)
{
	var i;
	for (i = 0; i < this.bodies.length; i++) {
		onBodyFound (this.bodies[i]);
	}
};

JSM.Renderer.prototype.RemoveBodies = function ()
{
	this.InitBodies ();
};

JSM.Renderer.prototype.Resize = function ()
{
	this.context.viewportWidth = this.canvas.width;
	this.context.viewportHeight = this.canvas.height;
	this.context.viewport (0, 0, this.context.viewportWidth, this.context.viewportHeight);
};

JSM.Renderer.prototype.Render = function (camera)
{
	function SetShaderParameters (context, shader, light, viewMatrix, projectionMatrix)
	{
		context.uniformMatrix4fv (shader.pMatrixUniform, false, projectionMatrix);
		context.uniformMatrix4fv (shader.vMatrixUniform, false, viewMatrix);

		context.uniform3f (shader.lightDirectionUniform, light.direction.x, light.direction.y, light.direction.z);
		context.uniform3f (shader.lightAmbientColorUniform, light.ambient[0], light.ambient[1], light.ambient[2]);
		context.uniform3f (shader.lightDiffuseColorUniform, light.diffuse[0], light.diffuse[1], light.diffuse[2]);
		context.uniform3f (shader.lightSpecularColorUniform, light.specular[0], light.specular[1], light.specular[2]);
	}
	
	function DrawMesh (context, shader, mesh, matrix)
	{
		var material = mesh.material;
		context.uniform3f (shader.polygonAmbientColorUniform, material.ambient[0], material.ambient[1], material.ambient[2]);
		context.uniform3f (shader.polygonDiffuseColorUniform, material.diffuse[0], material.diffuse[1], material.diffuse[2]);
		context.uniform3f (shader.polygonSpecularColorUniform, material.specular[0], material.specular[1], material.specular[2]);
		context.uniform1f (shader.polygonShininessUniform, material.shininess);
		context.uniform1f (shader.polygonOpacityUniform, material.opacity);

		context.uniformMatrix4fv (shader.tMatrixUniform, false, matrix);

		var vertexBuffer = mesh.GetVertexBuffer ();
		context.bindBuffer (context.ARRAY_BUFFER, vertexBuffer);
		context.enableVertexAttribArray (shader.vertexPositionAttribute);
		context.vertexAttribPointer (shader.vertexPositionAttribute, vertexBuffer.itemSize, context.FLOAT, false, 0, 0);
		
		var normalBuffer = mesh.GetNormalBuffer ();
		context.bindBuffer (context.ARRAY_BUFFER, normalBuffer);
		context.enableVertexAttribArray (shader.vertexNormalAttribute);
		context.vertexAttribPointer (shader.vertexNormalAttribute, normalBuffer.itemSize, context.FLOAT, false, 0, 0);

		var uvBuffer = mesh.GetUVBuffer ();
		if (uvBuffer !== null) {
			context.activeTexture (context.TEXTURE0);
			context.bindTexture (context.TEXTURE_2D, mesh.material.textureBuffer);
			context.bindBuffer (context.ARRAY_BUFFER, uvBuffer);
			context.vertexAttribPointer (shader.vertexUVAttribute, uvBuffer.itemSize, context.FLOAT, false, 0, 0);
			context.enableVertexAttribArray (shader.vertexUVAttribute);
			context.uniform1i (shader.samplerUniform, 0);
		}
		
		context.drawArrays (context.TRIANGLES, 0, vertexBuffer.numItems);
	}
	
	function DrawMeshes (renderer, materialType, viewMatrix, projectionMatrix)
	{
		function MaterialTypeToShaderType (materialType)
		{
			if (materialType == JSM.RenderMaterialType.Normal || materialType == JSM.RenderMaterialType.NormalTransparent) {
				return JSM.ShaderType.Normal;
			} else if (materialType == JSM.RenderMaterialType.Textured || materialType == JSM.RenderMaterialType.TexturedTransparent) {
				return JSM.ShaderType.Textured;
			}
			return null;
		}
		
		var shaderType = MaterialTypeToShaderType (materialType);
		var shader = renderer.shaders.GetShader (shaderType);
		var modifyParams = true;
		renderer.EnumerateBodies (function (body) {
			var matrix = body.GetTransformationMatrix ();
			body.EnumerateTypedMeshes (materialType, function (mesh) {
				if (modifyParams) {
					renderer.shaders.UseShader (renderer.context, shaderType);
					SetShaderParameters (renderer.context, shader, renderer.light, viewMatrix, projectionMatrix);
					modifyParams = false;
				}
				DrawMesh (renderer.context, shader, mesh, matrix);
			});
		});
	}
	
	this.context.clear (this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
	
	var viewMatrix = JSM.MatrixView (camera.eye, camera.center, camera.up);
	var projectionMatrix = JSM.MatrixPerspective (camera.fieldOfView * JSM.DegRad, this.context.viewportWidth / this.context.viewportHeight, camera.nearClippingPlane, camera.farClippingPlane);

	DrawMeshes (this, JSM.RenderMaterialType.Normal, viewMatrix, projectionMatrix);
	DrawMeshes (this, JSM.RenderMaterialType.Textured, viewMatrix, projectionMatrix);
	DrawMeshes (this, JSM.RenderMaterialType.NormalTransparent, viewMatrix, projectionMatrix);
	DrawMeshes (this, JSM.RenderMaterialType.TexturedTransparent, viewMatrix, projectionMatrix);
};
