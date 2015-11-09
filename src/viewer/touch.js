JSM.Touch = function ()
{
	this.down = false;
	this.fingers = 0;
	this.prev = new JSM.Coord2D ();
	this.curr = new JSM.Coord2D ();
	this.diff = new JSM.Coord2D ();
};

JSM.Touch.prototype.Start = function (event, div)
{
	if (event.touches.length === 0) {
		return;
	}

	this.down = true;
	this.fingers = event.touches.length;

	this.SetCurrent (event, div);
	this.prev = this.curr.Clone ();
};

JSM.Touch.prototype.Move = function (event, div)
{
	if (event.touches.length === 0) {
		return;
	}

	this.fingers = event.touches.length;

	this.SetCurrent (event, div);
	this.diff = JSM.CoordSub2D (this.curr, this.prev);
	this.prev = this.curr.Clone ();
};

JSM.Touch.prototype.End = function (event, div)
{
	if (event.touches.length === 0) {
		return;
	}

	this.down = false;
	this.SetCurrent (event, div);
};

JSM.Touch.prototype.SetCurrent = function (event, div)
{
	function GetEventCoord (touch)
	{
		var currX = touch.pageX;
		var currY = touch.pageY;
		if (div !== undefined && div.offsetLeft !== undefined && div.offsetTop !== undefined) {
			currX -= div.offsetLeft;
			currY -= div.offsetTop;
		}
		if (window.pageXOffset !== undefined && window.pageYOffset !== undefined) {
			currX += window.pageXOffset;
			currY += window.pageYOffset;
		}
		return new JSM.Coord2D (currX, currY);
	}
	
	if (event.touches.length == 1 || event.touches.length == 3) {
		this.curr = GetEventCoord (event.touches[0]);
	} else if (event.touches.length == 2) {
		var distance = GetEventCoord (event.touches[0]).DistanceTo (GetEventCoord (event.touches[1]));
		this.curr = new JSM.Coord2D (distance, distance);
	}
};
