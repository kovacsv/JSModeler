InfoTable = function (parent)
{
	this.table = document.createElement ('table');
	this.table.className = 'infotable';

	while (parent.lastChild) {
		parent.removeChild (parent.lastChild);
	}
	parent.appendChild (this.table);
};

InfoTable.prototype.AddRow = function (name, value)
{
	var tableRow = document.createElement ('tr');
	
	var nameColumn = document.createElement ('td');
	nameColumn.innerHTML = name;
	tableRow.appendChild (nameColumn);

	var valueColumn = document.createElement ('td');
	valueColumn.innerHTML = value;
	tableRow.appendChild (valueColumn);

	this.table.appendChild (tableRow);
};

InfoTable.prototype.AddColorRow = function (name, color)
{
	var tableRow = document.createElement ('tr');
	
	var nameColumn = document.createElement ('td');
	nameColumn.innerHTML = name;
	tableRow.appendChild (nameColumn);

	var valueColumn = document.createElement ('td');
	tableRow.appendChild (valueColumn);
	
	var colorDiv = document.createElement ('div');
	colorDiv.className = 'colorbutton';
	var hexColor = JSM.RGBComponentsToHexColor (color[0] * 255.0, color[1] * 255.0, color[2] * 255.0);
	var colorString = hexColor.toString (16);
	while (colorString.length < 6) {
		colorString = '0' + colorString;
	}
	colorDiv.style.background = '#' + colorString;
	valueColumn.appendChild (colorDiv);
	
	this.table.appendChild (tableRow);
};

ImporterMenu = function (parent)
{
	this.parent = parent;
};

ImporterMenu.prototype.AddGroup = function (name, parameters)
{
	return this.AddSubGroup (this.parent, name, parameters);
};

ImporterMenu.prototype.AddSubGroup = function (parent, name, parameters)
{
	function GetTruncatedName (name)
	{
		var maxLength = 20;
		if (name.length > maxLength) {
			return name.substr (0, maxLength) + '...';
		}
		return name;
	};

	var menuItem = document.createElement ('div');
	menuItem.className = 'menuitem';
	parent.appendChild (menuItem);

	var openCloseImage = document.createElement ('img');
	openCloseImage.className = 'menubutton';
	openCloseImage.title = parameters.button.title;
	openCloseImage.src = parameters.button.visible ? parameters.button.open : parameters.button.close;
	menuItem.appendChild (openCloseImage);

	if (parameters.userButton !== undefined && parameters.userButton !== null) {
		var userImage = document.createElement ('img');
		userImage.className = 'menubutton';
		userImage.title = parameters.userButton.title;
		menuItem.appendChild (userImage);
		if (parameters.userButton.onCreate !== undefined && parameters.userButton.onCreate !== null) {
			parameters.userButton.onCreate (userImage, parameters.userButton.userData);
		}
		userImage.onclick = function () {
			if (parameters.userButton.onClick !== undefined && parameters.userButton.onClick !== null) {
				parameters.userButton.onClick (userImage, parameters.userButton.userData);
			}
		};
	}

	var title = document.createElement ('div');
	title.className = 'menuitem';
	title.innerHTML = GetTruncatedName (name);
	title.title = name;
	menuItem.appendChild (title);

	var content = document.createElement ('div');
	content.className = 'menugroup';
	content.style.display = parameters.button.visible ? 'block' : 'none';
	parent.appendChild (content);
	
	openCloseImage.onclick = function () {
		if (content.style.display == 'none') {
			content.style.display = 'block';
			openCloseImage.src = parameters.button.open;
			if (parameters.button.onOpen !== undefined && parameters.button.onOpen !== null) {
				parameters.button.onOpen (content, parameters.button.userData);
			}
		} else {
			content.style.display = 'none';
			openCloseImage.src = parameters.button.close;
			if (parameters.button.onClose !== undefined && parameters.button.onClose !== null) {
				parameters.button.onClose (content, parameters.button.userData);
			}
		}
	};

	return content;
};
