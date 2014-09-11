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
	return this.AddSubItem (this.parent, name, parameters);
};

ImporterMenu.prototype.AddSubItem = function (parent, name, parameters)
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

	var menuText = null;
	menuText = document.createElement ('div');
	menuText.className = 'menuitem';
	menuText.innerHTML = GetTruncatedName (name);
	menuText.title = name;

	var menuContent = null;
	var openCloseImage = null;
	var userImage = null;
		
	if (parameters !== undefined && parameters !== null) {
		if (parameters.openCloseButton !== undefined && parameters.openCloseButton !== null) {
			menuContent = document.createElement ('div');
			menuContent.className = 'menugroup';
			menuContent.style.display = parameters.openCloseButton.visible ? 'block' : 'none';
			
			openCloseImage = document.createElement ('img');
			openCloseImage.className = 'menubutton';
			openCloseImage.title = parameters.openCloseButton.title;
			openCloseImage.src = parameters.openCloseButton.visible ? parameters.openCloseButton.open : parameters.openCloseButton.close;
			openCloseImage.onclick = function () {
				if (menuContent.style.display == 'none') {
					menuContent.style.display = 'block';
					openCloseImage.src = parameters.openCloseButton.open;
					if (parameters.openCloseButton.onOpen !== undefined && parameters.openCloseButton.onOpen !== null) {
						parameters.openCloseButton.onOpen (menuContent, parameters.openCloseButton.userData);
					}
				} else {
					menuContent.style.display = 'none';
					openCloseImage.src = parameters.openCloseButton.close;
					if (parameters.openCloseButton.onClose !== undefined && parameters.openCloseButton.onClose !== null) {
						parameters.openCloseButton.onClose (menuContent, parameters.openCloseButton.userData);
					}
				}
			};
		}

		if (parameters.userButton !== undefined && parameters.userButton !== null) {
			userImage = document.createElement ('img');
			userImage.className = 'menubutton';
			userImage.title = parameters.userButton.title;
			if (parameters.userButton.onCreate !== undefined && parameters.userButton.onCreate !== null) {
				parameters.userButton.onCreate (userImage, parameters.userButton.userData);
			}
			userImage.onclick = function () {
				if (parameters.userButton.onClick !== undefined && parameters.userButton.onClick !== null) {
					parameters.userButton.onClick (userImage, parameters.userButton.userData);
				}
			};
		}
	}

	if (openCloseImage !== null) {
		menuItem.appendChild (openCloseImage);
	}
	if (userImage !== null) {
		menuItem.appendChild (userImage);
	}
	menuItem.appendChild (menuText);

	parent.appendChild (menuItem);
	if (menuContent !== null) {
		parent.appendChild (menuContent);
	}

	return menuContent;
};
