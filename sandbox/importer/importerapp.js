ImporterApp = function ()
{
	this.importer = null;
	this.meshVisibility = null;
};

ImporterApp.prototype.Init = function (canvasName, callbacks)
{
	window.onresize = this.Resize.bind (this);
	this.Resize ();

	this.importer = new ImporterLogic ();
	this.importer.Init ('example');

	window.addEventListener ('dragover', this.DragOver.bind (this), false);
	window.addEventListener ('drop', this.Drop.bind (this), false);
	
	// debug
	var myThis = this;
	JSM.GetArrayBufferFromURL ('cube.3ds', function (arrayBuffer) {
		var jsonData = myThis.importer.LoadArrayBuffer (arrayBuffer);
		myThis.JsonLoaded (jsonData);
		myThis.importer.LoadJsonData ();
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
	function ClearMenu ()
	{
		var menu = document.getElementById ('menu');
		while (menu.lastChild) {
			menu.removeChild (menu.lastChild);
		}	
	}

	function AddTitleItem (name, level)
	{
		var menu = document.getElementById ('menu');
		var div = document.createElement ('div');
		div.className = 'menuitem';
		div.style.marginLeft = (level * 15) + 'px';
		div.innerHTML = name;
		menu.appendChild (div);
	}	

	function GenerateMenu (jsonData, app)
	{
		function GenerateMaterials (materials)
		{
			function AddMaterialItem (name, level)
			{
				var menu = document.getElementById ('menu');
				var div = document.createElement ('div');
				div.className = 'menuitem';
				div.style.marginLeft = (level * 15) + 'px';
				div.innerHTML = name.substr (0, 16);
				menu.appendChild (div);
			}

			var i, material;
			for (i = 0; i < materials.length; i++) {
				material = materials[i];
				AddMaterialItem (material.name, 1);
			}
		}
		
		function GenerateMeshes (meshes)
		{
			function AddMeshItem (name, level, meshIndex)
			{
				var menu = document.getElementById ('menu');

				var div = document.createElement ('div');
				div.className = 'menuitem';
				div.style.marginLeft = (level * 15) + 'px';

				var button = document.createElement ('div');
				button.className = 'menubutton plus';
				button.innerHTML = '+';
				button.onclick = function (i) {
					return function () {
						app.meshVisibility[i] = !app.meshVisibility[i];
						if (app.meshVisibility[i]) {
							button.className = 'menubutton plus';
							button.innerHTML = '+';
						} else {
							button.className = 'menubutton minus';
							button.innerHTML = '-';
						}
						app.Generate ();
					};
				} (i);
				div.appendChild (button);
				
				var text = document.createElement ('div');
				text.className = 'menutext';
				text.innerHTML = name.substr (0, 16);
				div.appendChild (text);

				menu.appendChild (div);
			}

			var i, mesh;
			for (i = 0; i < meshes.length; i++) {
				mesh = meshes[i];
				AddMeshItem (mesh.name, 1, i);
			}
		}
		
		ClearMenu ();
		AddTitleItem ('Materials', 0);
		GenerateMaterials (jsonData.materials);
		AddTitleItem ('Meshes', 0);
		GenerateMeshes (jsonData.meshes);
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
		var jsonData = myThis.importer.LoadArrayBuffer (arrayBuffer);
		myThis.JsonLoaded (jsonData);
		myThis.Generate ();
		myThis.importer.FitInWindow ();
	});		
};

ImporterApp.prototype.Generate = function ()
{
	this.importer.LoadJsonData (this.meshVisibility);
};

window.onload = function ()
{
	var importerApp = new ImporterApp ();
	importerApp.Init ();
};
