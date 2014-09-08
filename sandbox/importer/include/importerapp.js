ImporterApp = function ()
{
	this.generator = null;
	this.meshVisibility = null;
};

ImporterApp.prototype.Init = function (canvasName, callbacks)
{
	window.onresize = this.Resize.bind (this);
	this.Resize ();

	this.generator = new ImporterGenerator ();
	this.generator.Init ('example');

	window.addEventListener ('dragover', this.DragOver.bind (this), false);
	window.addEventListener ('drop', this.Drop.bind (this), false);
	
	// debug
	var myThis = this;
	JSM.GetArrayBufferFromURL ('cube.3ds', function (arrayBuffer) {
		var jsonData = myThis.generator.LoadArrayBuffer (arrayBuffer);
		myThis.JsonLoaded (jsonData);
		myThis.generator.LoadJsonData ();
	});
};

ImporterApp.prototype.Resize = function ()
{
	var left = document.getElementById ('left');
	var canvas = document.getElementById ('example');
	canvas.width = document.body.clientWidth - left.clientWidth - 1;
	canvas.height = document.body.clientHeight;
};

ImporterApp.prototype.JsonLoaded = function (jsonData)
{
	function GenerateMenu (jsonData, app)
	{
		function ClearMenu (parent)
		{
			while (parent.lastChild) {
				parent.removeChild (parent.lastChild);
			}	
		}

		function AddGroup (parent, name)
		{
			var title = document.createElement ('div');
			title.className = 'menuitem';
			title.innerHTML = name;
			parent.appendChild (title);
			
			var content = document.createElement ('div');
			content.className = 'menugroup';
			parent.appendChild (content);

			return content;
		}	

		function GenerateMaterials (parent, materials)
		{
			function AddMaterialItem (parent, material)
			{
				var div = document.createElement ('div');
				div.className = 'menuitem';

				var colorDiv = document.createElement ('div');
				colorDiv.className = 'colorbutton';
				
				var color = JSM.RGBComponentsToHexColor (material.diffuse[0] * 255, material.diffuse[1] * 255, material.diffuse[2] * 255);
				var colorString = color.toString (16);
				while (colorString.length < 6) {
					colorString = '0' + colorString;
				}
				colorDiv.style.background = '#' + colorString;
				div.appendChild (colorDiv);
				
				var text = document.createElement ('div');
				text.className = 'menutext';
				text.innerHTML = material.name.substr (0, 20);
				div.appendChild (text);

				parent.appendChild (div);
			}

			var i, material;
			for (i = 0; i < materials.length; i++) {
				material = materials[i];
				AddMaterialItem (parent, material);
			}
		}
		
		function GenerateMeshes (parent, meshes)
		{
			function AddMeshItem (parent, mesh, meshIndex)
			{
				var div = document.createElement ('div');
				div.className = 'menuitem';

				var infoImage = document.createElement ('img');
				infoImage.className = 'menubutton';
				infoImage.src = 'images/info.png';
				infoImage.onclick = function (i) {
					return function () {
						
					};
				} (i);
				div.appendChild (infoImage);

				var visibleImage = document.createElement ('img');
				visibleImage.className = 'menubutton';
				visibleImage.src = 'images/visible.png';
				visibleImage.onclick = function (i) {
					return function () {
						app.meshVisibility[i] = !app.meshVisibility[i];
						if (app.meshVisibility[i]) {
							visibleImage.src = 'images/visible.png';
						} else {
							visibleImage.src = 'images/hidden.png';
						}
						app.Generate ();
					};
				} (i);
				div.appendChild (visibleImage);
				
				var text = document.createElement ('div');
				text.className = 'menutext';
				text.innerHTML = mesh.name.substr (0, 20);
				div.appendChild (text);

				parent.appendChild (div);
			}

			var i, mesh;
			for (i = 0; i < meshes.length; i++) {
				mesh = meshes[i];
				AddMeshItem (parent, mesh, i);
			}
		}
		
		var menu = document.getElementById ('menu');
		ClearMenu (menu);

		var materialsGroup = AddGroup (menu, 'Materials');
		GenerateMaterials (materialsGroup, jsonData.materials);

		var meshesGroup = AddGroup (menu, 'Meshes');
		GenerateMeshes (meshesGroup, jsonData.meshes);
	}

	this.meshVisibility = {};
	var i;
	for (i = 0; i < jsonData.meshes.length; i++) {
		this.meshVisibility[i] = true;
	}
	
	GenerateMenu (jsonData, this);
};

ImporterApp.prototype.DragOver = function (event)
{
	event.stopPropagation ();
	event.preventDefault ();
	event.dataTransfer.dropEffect = 'copy';	
};
		
ImporterApp.prototype.Drop = function (event)
{
	event.stopPropagation ();
	event.preventDefault ();
	
	var files = event.dataTransfer.files;
	if (files.length === 0) {
		return;
	}
	
	var myThis = this;
	JSM.GetArrayBufferFromFile (files[0], function (arrayBuffer) {
		var jsonData = myThis.generator.LoadArrayBuffer (arrayBuffer);
		myThis.JsonLoaded (jsonData);
		myThis.Generate ();
		myThis.generator.FitInWindow ();
	});		
};

ImporterApp.prototype.Generate = function ()
{
	this.generator.LoadJsonData (this.meshVisibility);
};

window.onload = function ()
{
	var importerApp = new ImporterApp ();
	importerApp.Init ();
};
