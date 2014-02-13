JSM.FloatingDialog = function ()
{
	this.styles = null;
	this.dialog = null;
	this.content = null;
	this.mouseClickHandler = null;
};

JSM.FloatingDialog.prototype.Open = function (contentType)
{
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
	
	this.InitStyles ();
	this.InitDialog ();
	this.InitContent (contentType);
};

JSM.FloatingDialog.prototype.GetContent = function ()
{
	return this.content;
};

JSM.FloatingDialog.prototype.Close = function ()
{
	if (this.dialog === null) {
		return;
	}

	document.body.removeChild (this.dialog);
	this.dialog = null;

	if (document.removeEventListener) {
		document.removeEventListener ('click', this.mouseClickHandler, true);
	}
};

JSM.FloatingDialog.prototype.InitStyles = function ()
{
	this.styles = {
		dialog : {
			position : 'absolute',
			width : '90%',
			height : '90%',
			left : '5%',
			top : '5%'
		},
		content : {
			color : '#000000',
			background : '#ffffff',
			width : '100%',
			height : '100%',
			border : '1px solid #cccccc'
		}		
	};
};

JSM.FloatingDialog.prototype.MouseClick = function (clickEvent)
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

JSM.FloatingDialog.prototype.InitDialog = function ()
{
	this.dialog = document.createElement ('div');
	document.body.appendChild (this.dialog);
	this.dialog.style.position = this.styles.dialog.position;
	this.dialog.style.width = this.styles.dialog.width;
	this.dialog.style.height = this.styles.dialog.height;
	this.dialog.style.left = this.styles.dialog.left;
	this.dialog.style.top = this.styles.dialog.top;
};

JSM.FloatingDialog.prototype.InitContent = function (contentType)
{
	if (contentType == 'svg') {
		this.content = document.createElementNS ('http://www.w3.org/2000/svg', 'svg');
		this.content.setAttribute ('width', this.dialog.clientWidth);
		this.content.setAttribute ('height', this.dialog.clientHeight);
	} else {
		this.content = document.createElement (contentType);
	}
	this.dialog.appendChild (this.content);
	this.content.style.color = this.styles.content.color;
	this.content.style.background = this.styles.content.background;
	this.content.style.width = this.styles.content.width;
	this.content.style.height = this.styles.content.height;
	this.content.style.border = this.styles.content.border;
};
