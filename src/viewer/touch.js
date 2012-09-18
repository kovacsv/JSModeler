JSM.Touch = function ()
{
	this.down = false;
	this.prevX = 0;
	this.prevY = 0;
	this.currX = 0;
	this.currY = 0;
	this.diffX = 0;
	this.diffY = 0;
};

JSM.Touch.prototype = 
{
	Start : function (event, div)
	{
		var eventParameters = event;
		if (eventParameters === undefined) {
			eventParameters = window.event;
		}
		
		if (event.touches.length == 0) {
			return;
		}
		var touch = event.touches[0];

		this.down = true;
		this.prevX = touch.pageX - div.offsetLeft;
		this.prevY = touch.pageY - div.offsetTop;
	},

	Move : function (event, div)
	{
		var eventParameters = event;
		if (eventParameters === undefined) {
			eventParameters = window.event;
		}
		
		if (event.touches.length == 0) {
			return;
		}
		var touch = event.touches[0];

		this.currX = touch.pageX - div.offsetLeft;
		this.currY = touch.pageY - div.offsetTop;
		this.diffX = this.currX - this.prevX;
		this.diffY = this.currY - this.prevY;
		this.prevX = this.currX;
		this.prevY = this.currY;
	},
	
	End : function (event, div)
	{
		var eventParameters = event;
		if (eventParameters === undefined) {
			eventParameters = window.event;
		}
		
		this.down = false;
	}
};
