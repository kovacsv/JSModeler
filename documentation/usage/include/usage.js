Usage = function (menuGroups)
{
	this.menuGroups = menuGroups;
	this.uiElements = {
		menu : null,
		canvas : null,
		infoDiv : null,
		menuContent : null,
		searchField : null,
		menuItemList : null,
		floating : null
	};
	
	this.hashChanging = false;
	this.currentItem = null;
	this.GenerateUI ();

	var viewerSettings = {
		cameraEyePosition : [-2.0, -1.5, 1.0],
		cameraCenterPosition : [0.0, 0.0, 0.0],
		cameraUpVector : [0.0, 0.0, 1.0]
	};

	this.viewer = new JSM.ThreeViewer ();
	this.viewer.Start (this.uiElements.canvas.get (0), viewerSettings);

	window.onresize = this.Resize.bind (this);
	this.Resize ();
	
	window.onhashchange = this.OnHashChange.bind (this);
	this.OnHashChange ();
};

Usage.prototype.GenerateUI = function ()
{
	var myThis = this;
	this.uiElements.menu = $('<div>').addClass ('menu').appendTo ($(document.body));
	this.uiElements.canvas = $('<canvas>').addClass ('viewer').appendTo ($(document.body));
	this.uiElements.infoDiv = $('<div>').addClass ('info').appendTo ($(document.body));
	this.uiElements.menuContent = $('<div>').addClass ('content').appendTo (this.uiElements.menu);
	var nameDiv = $('<div>').addClass ('name').html ('JSModeler').appendTo (this.uiElements.menuContent);
	var buttonsDiv = $('<div>').addClass ('buttons').appendTo (this.uiElements.menuContent);
	var sourceButtonImg = $('<img>').addClass ('button').attr ('src', 'include/source.png').appendTo (buttonsDiv);
	sourceButtonImg.click (function () {
		myThis.ShowSource ();
	});
	this.uiElements.searchField = $('<input>').addClass ('searchfield').appendTo (this.uiElements.menuContent);
	this.uiElements.searchField.keyup (function () {
		var searchString = myThis.uiElements.searchField.val ();
		myThis.GenerateMenu (searchString.toLowerCase ());
	});
	this.uiElements.menuItemList = $('<div>').appendTo (this.uiElements.menuContent);
	this.GenerateMenu (null);
};

Usage.prototype.GenerateMenu = function (searchString)
{
	function AddGroup (callMenuItemHandler, parentDiv, menuGroup, searchString)
	{
		function NeedToAddItem (menuItem, searchString)
		{
			if (searchString === null || searchString.length === 0) {
				return true;
			}
			return menuItem.name.toLowerCase ().indexOf (searchString) != -1;
		}
		
		function AddMenuItem (callMenuItemHandler, parentDiv, menuGroup, menuItem)
		{
			var menuItemDiv = $('<div>').addClass ('menuitem').html (menuItem.name).appendTo (parentDiv);
			menuItemDiv.click (function () {
				callMenuItemHandler (menuGroup, menuItem, true);
			});
		}			
		
		var visibleItems = [];
		var i, menuItem;
		for (i = 0; i < menuGroup.items.length; i++) {
			menuItem = menuGroup.items[i];
			if (NeedToAddItem (menuItem, searchString)) {
				visibleItems.push (menuItem);
			}
		}
		
		if (visibleItems.length === 0) {
			return;
		}
		
		var groupDiv = $('<div>').appendTo (parentDiv);
		var groupTitleDiv = $('<div>').addClass ('grouptitle').html (menuGroup.name).appendTo (groupDiv);
		var menuItemsDiv = $('<div>').addClass ('menuitems').appendTo (groupDiv);
		//if (searchString === null) {
		//	menuItemsDiv.hide ();
		//}
		
		for (i = 0; i < visibleItems.length; i++) {
			menuItem = visibleItems[i];
			AddMenuItem (callMenuItemHandler, menuItemsDiv, menuGroup, menuItem);
		}
		
		groupTitleDiv.click (function (ev) {
			menuItemsDiv.toggle ();
		});
	}
	
	this.uiElements.menuItemList.empty ();
	
	var i, menuGroup;
	for (i = 0; i < this.menuGroups.length; i++) {
		menuGroup = this.menuGroups[i];
		AddGroup (this.CallMenuItemHandler.bind (this), this.uiElements.menuItemList, menuGroup, searchString);
	}
};

Usage.prototype.RemoveSource = function ()
{
	if (this.uiElements.floating !== null) {
		this.uiElements.floating.remove ();
		this.uiElements.floating = null;
	}
};

Usage.prototype.ShowSource = function ()
{
	if (this.currentItem === null) {
		return;
	}
	if (this.uiElements.floating !== null) {
		this.RemoveSource ();
	} else {
		this.uiElements.floating = $('<div>').addClass ('floating').appendTo ($(document.body));
		var code = $('<pre>').addClass ('brush:js, toolbar: false').html (this.currentItem.handler.toString ()).appendTo (this.uiElements.floating);
		SyntaxHighlighter.highlight ();
	}
};

Usage.prototype.CallMenuItemHandler = function (menuGroup, menuItem, changeHash)
{
	if (changeHash) {
		this.hashChanging = true;
		window.location.hash = encodeURI (menuGroup.name + ',' + menuItem.name);
	}
	this.RemoveSource ();
	this.currentItem = menuItem;
	this.viewer.RemoveMeshes ();
	var infoText = '';
	if (menuItem.info !== undefined && menuItem.info !== null) {
		infoText = menuItem.info;
	}
	this.uiElements.infoDiv.html (infoText);
	menuItem.handler (this.viewer);
	this.viewer.FitInWindow ();
	this.viewer.Draw ();
};

Usage.prototype.Resize = function ()
{
	this.uiElements.canvas.get (0).width = $(window).width () - this.uiElements.menu.width ();
	this.uiElements.canvas.get (0).height = $(window).height ();
	this.viewer.Resize ();
};

Usage.prototype.OnHashChange = function ()
{
	function CallFirstHandler (usage)
	{
		if (usage.menuGroups.length === 0 || usage.menuGroups[0].items.length === 0) {
			return;
		}
		usage.CallMenuItemHandler (usage.menuGroups[0], usage.menuGroups[0].items[0], true);
	}
	
	if (this.hashChanging) {
		this.hashChanging = false;
		return;
	}
	var hash = window.location.hash;
	if (hash.length === 0) {
		CallFirstHandler (this);
		return;
	}
	var splitted = hash.substr (1).split (',');
	if (splitted.length != 2) {
		return;
	}
	var i, j, menuGroup, menuItem;
	for (i = 0; i < this.menuGroups.length; i++) {
		menuGroup = this.menuGroups[i];
		for (j = 0; j < menuGroup.items.length; j++) {
			menuItem = menuGroup.items[j];
			if (encodeURI (menuGroup.name) == splitted[0] && encodeURI (menuItem.name) == splitted[1]) {
				this.CallMenuItemHandler (menuGroup, menuItem, false);
				break;
			}
		}
	}	
};
