JSM.BaseDialog = function ()
{
	this.mode = null;
	this.styles = null;
	this.dialog = null;
	this.title = null;
	this.cancelButtonText = null;
	this.okButtonText = null;
	this.okButton = null;
	this.cancelButton = null;
	this.mouseClickHandler = null;
};

JSM.BaseDialog.prototype.Open = function (title, cancelText, okText)
{
	this.InitStyles ();
	if (this.dialog !== null) {
		return;
	}

	this.title = title;
	this.cancelButtonText = cancelText;
	this.okButtonText = okText;

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

JSM.BaseDialog.prototype.InitStyles = function ()
{
	this.styles = {
		dialog : {
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
		} else if (target === this.okButton || target === this.cancelButton) {
			this.ButtonClicked (target);
			return;
		}
		target = target.parentElement;
	}
	
	if (!dialogClicked) {
		this.Close ();
	}
};

JSM.BaseDialog.prototype.ButtonClicked = function (target)
{
	var targetString = null;
	if (target === this.okButton) {
		targetString = 'ok';
	} else if (target === this.cancelButton) {
		targetString = 'cancel';
	}

	this.Close ();
	this.OnButtonClicked (targetString);
};

JSM.BaseDialog.prototype.InitDialog = function ()
{
	this.dialog = document.createElement ('div');
	document.body.appendChild (this.dialog);
	this.dialog.style.color = this.styles.dialog.color;
	this.dialog.style.background = this.styles.dialog.background;
	this.dialog.style.fontFamily = this.styles.dialog.fontFamily;
	this.dialog.style.fontSize = this.styles.dialog.fontSize;
	this.dialog.style.position = 'absolute';
	this.dialog.style.boxShadow = this.styles.dialog.shadow;
	this.dialog.style.left = '0px';
	this.dialog.style.top = '0px';
};

JSM.BaseDialog.prototype.InitTitle = function ()
{
	var div = document.createElement ('div');
	this.dialog.appendChild (div);
	div.innerHTML = this.title;
	div.style.color = this.styles.title.color;
	div.style.background = this.styles.title.background;
	div.style.padding = this.styles.title.padding;
};

JSM.BaseDialog.prototype.InitContent = function ()
{
	var div = document.createElement ('div');
	this.dialog.appendChild (div);
	div.style.color = this.styles.content.color;
	div.style.background = this.styles.content.background;
	div.style.padding = this.styles.content.padding;
	this.FillContent (div);
};

JSM.BaseDialog.prototype.InitControls = function ()
{
	var div = document.createElement ('div');
	this.dialog.appendChild (div);
	div.style.color = this.styles.controls.color;
	div.style.background = this.styles.controls.background;
	div.style.padding = this.styles.controls.padding;
	div.style.textAlign = this.styles.controls.align;
	
	if (this.cancelButtonText !== null) {
		this.cancelButton = document.createElement ('span');
		div.appendChild (this.cancelButton);
		this.cancelButton.innerHTML = this.cancelButtonText;
		this.cancelButton.style.color = this.styles.button.color;
		this.cancelButton.style.background = this.styles.button.background;
		this.cancelButton.style.padding = this.styles.button.padding;
		this.cancelButton.style.margin = this.styles.button.margin;
		this.cancelButton.style.border = this.styles.button.border;
		this.cancelButton.style.borderRadius = this.styles.button.borderRadius;
		this.cancelButton.style.cursor = this.styles.button.cursor;
	}
	
	if (this.okButtonText !== null) {
		this.okButton = document.createElement ('span');
		div.appendChild (this.okButton);
		this.okButton.innerHTML = this.okButtonText;
		this.okButton.style.color = this.styles.button.color;
		this.okButton.style.background = this.styles.button.background;
		this.okButton.style.padding = this.styles.button.padding;
		this.okButton.style.margin = this.styles.button.margin;
		this.okButton.style.border = this.styles.button.border;
		this.okButton.style.borderRadius = this.styles.button.borderRadius;
		this.okButton.style.cursor = this.styles.button.cursor;
	}
};

JSM.BaseDialog.prototype.SetPosition = function ()
{
	var height = this.dialog.clientHeight;
	var width = this.dialog.clientWidth;
	this.dialog.style.left = ((window.innerWidth - this.dialog.clientWidth) / 2.0) + 'px';
	this.dialog.style.top = ((window.innerHeight - this.dialog.clientHeight) / 2.0) + 'px';
};
