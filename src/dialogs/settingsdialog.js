JSM.Parameter = function (name, type, value, side)
{
	this.name = name;
	this.type = type;
	this.value = value;
	this.side = side;
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
		parameter = parameters[index];
		this.inputs[index].GetValue (parameter);
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
		parameter = parameters[index];
		if (parameter.side == 'left') {
			hasLeft = true;
		} else if (parameter.side == 'right') {
			hasRight = true;
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
			parameter = parameters[index];
			if (parameter.side == 'left') {
				this.CreateParameter (leftTable, index, parameters);
			}
		}
		
		var containerRight = document.createElement ('td');
		containerRow.appendChild (containerRight);
		containerRight.style.verticalAlign = this.styles.td.verticalAlign;
		
		var rightTable = document.createElement ('table');
		containerRight.appendChild (rightTable);
		rightTable.cellPadding = this.styles.table.cellPadding;

		for (index in parameters) {
			parameter = parameters[index];
			if (parameter.side == 'right') {
				this.CreateParameter (rightTable, index, parameters);
			}
		}
	} else {
		var table = document.createElement ('table');
		div.appendChild (table);		
		table.cellPadding = this.styles.table.cellPadding;
		
		for (index in parameters) {
			this.CreateParameter (table, index, parameters);		
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
	if (parameter.type == 'text') {
		control = new JSM.TextControl ();
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
		control = new JSM.PolygonControl ();
		control.Create (tdInput, parameter);
		this.inputs[index] = control;
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
	JSM.BaseDialog.prototype.Open.call (this, title);
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
		this.onClosed ();
	}
};
