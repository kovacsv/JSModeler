JSM.Parameter = function (name, type, value, side)
{
	this.name = JSM.ValueOrDefault (name, null);
	this.type = JSM.ValueOrDefault (type, null);
	this.value = JSM.ValueOrDefault (value, null);
	this.side = JSM.ValueOrDefault (side, null);
};

JSM.ParameterTable = function ()
{
	this.inputs = null;
	this.styles = null;
};

JSM.ParameterTable.prototype.Create = function (div, parameters)
{
	this.inputs = [];
	this.InitStyles ();
	this.CreateParameterTable (div, parameters);
};

JSM.ParameterTable.prototype.GetValues = function (parameters)
{
	var index, parameter;
	for (index in parameters) {
		if (parameters.hasOwnProperty (index)) {
			parameter = parameters[index];
			this.inputs[index].GetValue (parameter);
		}
	}
};

JSM.ParameterTable.prototype.InitStyles = function ()
{
	this.styles = {
		table : {
			cellPadding : '5px 15px'
		},
		td : {
			verticalAlign : 'top'
		}
	};
};

JSM.ParameterTable.prototype.CreateParameterTable = function (div, parameters)
{
	var hasLeft = false;
	var hasRight = false;

	var index, parameter;
	for (index in parameters) {
		if (parameters.hasOwnProperty (index)) {
			parameter = parameters[index];
			if (parameter.side == 'left') {
				hasLeft = true;
			} else if (parameter.side == 'right') {
				hasRight = true;
			}
		}
	}
	
	if (hasLeft && hasRight) {
		var containerTable = document.createElement ('table');
		div.appendChild (containerTable);

		var containerRow = document.createElement ('tr');
		containerTable.appendChild (containerRow);

		var containerLeft = document.createElement ('td');
		containerRow.appendChild (containerLeft);
		containerLeft.style.verticalAlign = this.styles.td.verticalAlign;
		
		var leftTable = document.createElement ('table');
		containerLeft.appendChild (leftTable);
		leftTable.cellPadding = this.styles.table.cellPadding;

		for (index in parameters) {
			if (parameters.hasOwnProperty (index)) {
				parameter = parameters[index];
				if (parameter.side == 'left') {
					this.CreateParameter (leftTable, index, parameters);
				}
			}
		}
		
		var containerRight = document.createElement ('td');
		containerRow.appendChild (containerRight);
		containerRight.style.verticalAlign = this.styles.td.verticalAlign;
		
		var rightTable = document.createElement ('table');
		containerRight.appendChild (rightTable);
		rightTable.cellPadding = this.styles.table.cellPadding;

		for (index in parameters) {
			if (parameters.hasOwnProperty (index)) {
				parameter = parameters[index];
				if (parameter.side == 'right') {
					this.CreateParameter (rightTable, index, parameters);
				}
			}
		}
	} else {
		var table = document.createElement ('table');
		div.appendChild (table);
		table.cellPadding = this.styles.table.cellPadding;
		
		for (index in parameters) {
			if (parameters.hasOwnProperty (index)) {
				this.CreateParameter (table, index, parameters);
			}
		}
	}
};

JSM.ParameterTable.prototype.CreateParameter = function (table, index, parameters)
{
	var parameter = parameters[index];
	var tr = document.createElement ('tr');
	table.appendChild (tr);

	if (parameter.name !== null) {
		var tdName = document.createElement ('td');
		tr.appendChild (tdName);
		tdName.innerHTML = parameter.name;
	}

	var tdInput = document.createElement ('td');
	tr.appendChild (tdInput);
	if (parameter.name === null) {
		tdInput.colSpan = '2';
	}
	
	var control = null;
	if (parameter.type == 'static') {
		control = new JSM.StaticControl ();
		control.Create (tdInput, parameter);
		this.inputs[index] = control;
	} else if (	parameter.type == 'text' || parameter.type == 'number' || parameter.type == 'integer') {
		control = new JSM.InputControl (parameter.type);
		control.Create (tdInput, parameter);
		this.inputs[index] = control;
	} else if (parameter.type == 'select') {
		control = new JSM.SelectControl ();
		control.Create (tdInput, parameter);
		this.inputs[index] = control;
	} else if (parameter.type == 'check') {
		control = new JSM.CheckControl ();
		control.Create (tdInput, parameter);
		this.inputs[index] = control;
	} else if (parameter.type == 'color') {
		control = new JSM.ColorControl ();
		control.Create (tdInput, parameter);
		this.inputs[index] = control;
	} else if (parameter.type == 'coord') {
		control = new JSM.CoordControl ();
		control.Create (tdInput, parameter);
		this.inputs[index] = control;
	} else if (parameter.type == 'polygon') {
		control = new JSM.PolygonControl ('polygon');
		control.Create (tdInput, parameter);
		this.inputs[index] = control;
	} else if (parameter.type == 'polyline') {
		control = new JSM.PolygonControl ('polyline');
		control.Create (tdInput, parameter);
		this.inputs[index] = control;
	}
};

JSM.InfoDialog = function ()
{
	this.parameterTable = new JSM.ParameterTable ();
};

JSM.InfoDialog.prototype = new JSM.BaseDialog ();

JSM.InfoDialog.prototype.Open = function (title, parameters)
{
	this.parameters = parameters;
	JSM.BaseDialog.prototype.Open.call (this, title, null, 'ok');
};

JSM.InfoDialog.prototype.FillContent = function (div)
{
	this.parameterTable.Create (div, this.parameters);
};

JSM.InfoDialog.prototype.OnButtonClicked = function (target)
{
	if (target == 'ok') {
		this.parameterTable.GetValues (this.parameters);
	}
};

JSM.SettingsDialog = function ()
{
	this.parameterTable = new JSM.ParameterTable ();
	this.onClosed = null;
};

JSM.SettingsDialog.prototype = new JSM.BaseDialog ();

JSM.SettingsDialog.prototype.Open = function (title, parameters)
{
	this.parameters = parameters;
	JSM.BaseDialog.prototype.Open.call (this, title, 'cancel', 'ok');
};

JSM.SettingsDialog.prototype.OnClosed = function (callback)
{
	this.onClosed = callback;
};

JSM.SettingsDialog.prototype.FillContent = function (div)
{
	this.parameterTable.Create (div, this.parameters);
};

JSM.SettingsDialog.prototype.OnButtonClicked = function (target)
{
	if (target == 'ok') {
		this.parameterTable.GetValues (this.parameters);
		if (this.onClosed !== null) {
			this.onClosed ();
		}
	}
};
