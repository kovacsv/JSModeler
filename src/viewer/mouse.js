JSM.Mouse = function ()
{
	this.down = false;
	this.button = 0;
	this.shift = false;
	this.ctrl = false;
	this.alt = false;
	this.prevX = 0;
	this.prevY = 0;
	this.currX = 0;
	this.currY = 0;
	this.diffX = 0;
	this.diffY = 0;
};

JSM.Mouse.prototype = 
{
	Down : function (event, div)
	{
		var eventParameters = event;
		if (eventParameters === undefined) {
			eventParameters = window.event;
		}
		
		this.down = true;
		this.button = event.which;
		this.shift = event.shiftKey;
		this.ctrl = event.ctrlKey;
		this.alt = event.altKey;
		
		this.SetCurrent (eventParameters, div);
		this.prevX = this.currX;
		this.prevY = this.currY;
	},
	
	Move : function (event, div)
	{
		var eventParameters = event;
		if (eventParameters === undefined) {
			eventParameters = window.event;
		}
		
		this.shift = event.shiftKey;
		this.ctrl = event.ctrlKey;
		this.alt = event.altKey;
		
		this.SetCurrent (eventParameters, div);
		this.diffX = this.currX - this.prevX;
		this.diffY = this.currY - this.prevY;
		this.prevX = this.currX;
		this.prevY = this.currY;
	},
	
	Up : function (event, div)
	{
		var eventParameters = event;
		if (eventParameters === undefined) {
			eventParameters = window.event;
		}
		
		this.down = false;
		this.SetCurrent (eventParameters, div);
	},

	Out : function (event, div)
	{
		var eventParameters = event;
		if (eventParameters === undefined) {
			eventParameters = window.event;
		}
		
		this.down = false;
		this.SetCurrent (eventParameters, div);
	},
	
	SetCurrent : function (eventParameters, div)
	{
		this.currX = eventParameters.clientX;
		this.currY = eventParameters.clientY;
		if (div !== undefined) {
			this.currX = this.currX - div.offsetLeft;
			this.currY = this.currY - div.offsetTop;
		}	
	}
};
