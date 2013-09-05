JSM.ParameterTable = function ()
{
	this.inputs = null;
	this.settings = null;
};

JSM.ParameterTable.prototype =
{
	Create : function (div, parameters)
	{
		this.inputs = [];
		this.InitSettings ();
		this.CreateParameterTable (div, parameters);
	},

	GetValues : function (parameters)
	{
		var index, parameter;
		for (index in parameters) {
			parameter = parameters[index];
			this.inputs[index].GetValue (parameter);
		}
	},
	
	InitSettings : function ()
	{
		this.settings = {
			table : {
				cellPadding : '5px 15px'
			},
			td : {
				verticalAlign : 'top'
			}
		};
	},

	CreateParameterTable : function (div, parameters)
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
			containerLeft.style.verticalAlign = this.settings.td.verticalAlign;
			
			var leftTable = document.createElement ('table');
			containerLeft.appendChild (leftTable);
			leftTable.cellPadding = this.settings.table.cellPadding;

			for (index in parameters) {
				parameter = parameters[index];
				if (parameter.side == 'left') {
					this.CreateParameter (leftTable, index, parameters);
				}
			}
			
			var containerRight = document.createElement ('td');
			containerRow.appendChild (containerRight);
			containerRight.style.verticalAlign = this.settings.td.verticalAlign;
			
			var rightTable = document.createElement ('table');
			containerRight.appendChild (rightTable);
			rightTable.cellPadding = this.settings.table.cellPadding;

			for (index in parameters) {
				parameter = parameters[index];
				if (parameter.side == 'right') {
					this.CreateParameter (rightTable, index, parameters);
				}
			}
		} else {
			var table = document.createElement ('table');
			div.appendChild (table);		
			table.cellPadding = this.settings.table.cellPadding;
			
			for (index in parameters) {
				this.CreateParameter (table, index, parameters);		
			}
		}
	},
	
	CreateParameter : function (table, index, parameters)
	{
		var parameter = parameters[index];
		var tr = document.createElement ('tr');
		table.appendChild (tr);

		if (parameter.name != null) {
			var tdName = document.createElement ('td');
			tr.appendChild (tdName);
			tdName.innerHTML = parameter.name;
		}

		var tdInput = document.createElement ('td');
		tr.appendChild (tdInput);
		if (parameter.name == null) {
			tdInput.colSpan = '2';
		}
		
		if (parameter.type == 'text') {
			var control = new JSM.TextControl ();
			control.Create (tdInput, parameter);
			this.inputs[index] = control;
		} else if (parameter.type == 'check') {
			var control = new JSM.CheckControl ();
			control.Create (tdInput, parameter);
			this.inputs[index] = control;
		} else if (parameter.type == 'color') {
			var control = new JSM.ColorControl ();
			control.Create (tdInput, parameter);
			this.inputs[index] = control;
		} else if (parameter.type == 'coord') {
			var control = new JSM.CoordControl ();
			control.Create (tdInput, parameter);
			this.inputs[index] = control;
		} else if (parameter.type == 'polygon') {
			var control = new JSM.PolygonControl ();
			control.Create (tdInput, parameter);
			this.inputs[index] = control;
		}
	}
}

JSM.SettingsDialog = function ()
{
	this.dialog = new JSM.BaseDialog (this);
	this.parameterTable = new JSM.ParameterTable ();
	this.parameters = null;
};

JSM.SettingsDialog.prototype =
{
	Open : function (title, parameters)
	{
		this.parameters = parameters;
		this.dialog.Open (title);
	},
	
	OnClosed : function ()
	{
	
	},
	
	FillContent : function (div)
	{
		this.parameterTable.Create (div, this.parameters);
	},
	
	OkButton : function ()
	{
		this.parameterTable.GetValues (this.parameters);
		this.OnClosed ();
	}
};
