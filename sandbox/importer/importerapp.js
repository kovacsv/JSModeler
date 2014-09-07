ImporterApp = function ()
{
	this.importer = null;
};

ImporterApp.prototype.Init = function (canvasName, callbacks)
{
	var myThis = this;

	window.onresize = this.Resize.bind (this);
	this.Resize ();

	this.importer = new Importer ();
	this.importer.Init ('example', {
		jsonLoaded : function (jsonData) {
			myThis.GenerateMenu (jsonData);
		}
	});
	
	// debug
	var myThis = this;
	JSM.GetArrayBufferFromURL ('cube.3ds', function (arrayBuffer) {
		myThis.importer.LoadModel (arrayBuffer);
	});
}

ImporterApp.prototype.Resize = function ()
{
	var left = document.getElementById ('left');
	var canvas = document.getElementById ('example');
	canvas.width = document.body.clientWidth - left.clientWidth - 1;
	canvas.height = document.body.clientHeight;
}

ImporterApp.prototype.GenerateMenu = function (jsonData)
{
	function ClearMenu ()
	{
		var menu = document.getElementById ('menu');
		while (menu.lastChild) {
			menu.removeChild (menu.lastChild);
		}	
	}

	function AddMenuItem (name, level)
	{
		var menu = document.getElementById ('menu');
		var div = document.createElement ('div');
		div.className = 'menuitem';
		div.style.marginLeft = (level * 15) + 'px';
		div.innerHTML = name;
		menu.appendChild (div);
	}

	function GenerateJsonData (jsonData)
	{
		function GenerateMaterials (materials)
		{
			var i, material;
			for (i = 0; i < materials.length; i++) {
				material = materials[i];
				AddMenuItem (material.name, 1);
			}
		}
		
		function GenerateMeshes (meshes)
		{
			var i, mesh;
			for (i = 0; i < meshes.length; i++) {
				mesh = meshes[i];
				AddMenuItem (mesh.name, 1);
			}
		}
		
		ClearMenu ();
		AddMenuItem ('Materials', 0);
		GenerateMaterials (jsonData.materials);
		AddMenuItem ('Meshes', 0);
		GenerateMeshes (jsonData.meshes);
	}

	GenerateJsonData (jsonData);
}

window.onload = function ()
{
	var importerApp = new ImporterApp ();
	importerApp.Init ();
}
