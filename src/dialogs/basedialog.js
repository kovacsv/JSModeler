JSM.BaseDialog = function ()
{
	this.settings = null;
	this.dialog = null;
	this.okButton = null;
	this.cancelButton = null;
	this.mouseClickHandler = null;
};

JSM.BaseDialog.prototype.Open = function (title)
{
	this.InitSettings ();
	this.settings.dialog.title = title;
	if (this.dialog !== null) {
		return;
	}
	
	var myThis = this;
	this.mouseClickHandler = function (clickEvent) {
		myThis.MouseClick (clickEvent);
	};

	if (document.addEventListener) {
		document.addEventListener ('click', this.mouseClickHandler, true);
	}
	
	this.InitDialog ();
	this.InitTitle ();
	this.InitContent ();
	this.InitControls ();
	this.SetPosition ();
};
	
JSM.BaseDialog.prototype.Close = function ()
{
	if (this.dialog === null) {
		return;
	}

	document.body.removeChild (this.dialog);
	this.dialog = null;
	this.okButton = null;
	this.cancelButton = null;

	if (document.removeEventListener) {
		document.removeEventListener ('click', this.mouseClickHandler, true);
	}
};

JSM.BaseDialog.prototype.InitSettings = function ()
{
	this.settings = {
		dialog : {
			title : 'Title',
			color : '#000000',
			fontFamily : 'Arial, cursive',
			fontSize : '12px',
			background : '#ffffff',
			shadow : '0px 0px 10px #555555'
		},
		title : {
			color : '#eeeeee',
			background : '#333333',
			padding : '10px'
		},
		content : {
			color : '#000000',
			background : 'transparent',
			padding : '10px'
		},
		controls : {
			color : '#000000',
			background : 'transparent',
			okButtonText : 'ok',
			cancelButtonText : 'cancel',
			padding : '5px 5px 15px 5px',
			align : 'right'
		},
		button : {
			color : '#222222',
			background : '#eeeeee',
			padding : '5px 10px',
			margin : '0px 5px',
			border : '1px solid #cccccc',
			borderRadius : '5px',
			cursor : 'pointer'
		}
	};
};

JSM.BaseDialog.prototype.MouseClick = function (clickEvent)
{
	var dialogClicked = false;
	var target = clickEvent.target;
	while (target !== null) {
		if (target === this.dialog) {
			dialogClicked = true;
		} else if (target === this.okButton) {
			this.OnOkButtonClicked ();
			return;
		} else if (target === this.cancelButton) {
			this.OnCancelButtonClicked ();
			return;
		}
		target = target.parentElement;
	}
	
	if (!dialogClicked) {
		this.OnCancelButtonClicked ();
	}
};

JSM.BaseDialog.prototype.OnOkButtonClicked = function ()
{
	this.Close ();
	this.OkButtonClicked ();
};

JSM.BaseDialog.prototype.OnCancelButtonClicked = function ()
{
	this.Close ();
	this.Close ();
};

JSM.BaseDialog.prototype.InitDialog = function ()
{
	this.dialog = document.createElement ('div');
	document.body.appendChild (this.dialog);
	this.dialog.style.color = this.settings.dialog.color;
	this.dialog.style.background = this.settings.dialog.background;
	this.dialog.style.fontFamily = this.settings.dialog.fontFamily;
	this.dialog.style.fontSize = this.settings.dialog.fontSize;
	this.dialog.style.position = 'absolute';
	this.dialog.style.boxShadow = this.settings.dialog.shadow;
	this.dialog.style.left = '0px';
	this.dialog.style.top = '0px';
};

JSM.BaseDialog.prototype.InitTitle = function ()
{
	var div = document.createElement ('div');
	this.dialog.appendChild (div);
	div.innerHTML = this.settings.dialog.title;
	div.style.color = this.settings.title.color;
	div.style.background = this.settings.title.background;
	div.style.padding = this.settings.title.padding;
};

JSM.BaseDialog.prototype.InitContent = function ()
{
	var div = document.createElement ('div');
	this.dialog.appendChild (div);
	div.style.color = this.settings.content.color;
	div.style.background = this.settings.content.background;
	div.style.padding = this.settings.content.padding;
	this.FillContent (div);
};

JSM.BaseDialog.prototype.InitControls = function ()
{
	var div = document.createElement ('div');
	this.dialog.appendChild (div);
	div.style.color = this.settings.controls.color;
	div.style.background = this.settings.controls.background;
	div.style.padding = this.settings.controls.padding;
	div.style.textAlign = this.settings.controls.align;
	
	this.cancelButton = document.createElement ('span');
	div.appendChild (this.cancelButton);
	this.cancelButton.innerHTML = this.settings.controls.cancelButtonText;
	this.cancelButton.style.color = this.settings.button.color;
	this.cancelButton.style.background = this.settings.button.background;
	this.cancelButton.style.padding = this.settings.button.padding;
	this.cancelButton.style.margin = this.settings.button.margin;
	this.cancelButton.style.border = this.settings.button.border;
	this.cancelButton.style.borderRadius = this.settings.button.borderRadius;
	this.cancelButton.style.cursor = this.settings.button.cursor;
	
	this.okButton = document.createElement ('span');
	div.appendChild (this.okButton);
	this.okButton.innerHTML = this.settings.controls.okButtonText;
	this.okButton.style.color = this.settings.button.color;
	this.okButton.style.background = this.settings.button.background;
	this.okButton.style.padding = this.settings.button.padding;
	this.okButton.style.margin = this.settings.button.margin;
	this.okButton.style.border = this.settings.button.border;
	this.okButton.style.borderRadius = this.settings.button.borderRadius;
	this.okButton.style.cursor = this.settings.button.cursor;
};

JSM.BaseDialog.prototype.SetPosition = function ()
{
	var height = this.dialog.clientHeight;
	var width = this.dialog.clientWidth;
	this.dialog.style.left = ((window.innerWidth - this.dialog.clientWidth) / 2.0) + 'px';
	this.dialog.style.top = ((window.innerHeight - this.dialog.clientHeight) / 2.0) + 'px';
};
