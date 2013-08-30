JSM.Model = function ()
{
	this.bodies = [];
};

JSM.Model.prototype =
{
	AddBody : function (body)
	{
		this.bodies.push (body);
		return this.bodies.length - 1;
	},

	GetBody : function (index)
	{
		return this.bodies[index];
	},
	
	BodyCount : function ()
	{
		return this.bodies.length;
	},

	VertexCount : function ()
	{
		var count = 0;
		var i;
		for (i = 0; i < this.bodies.length; i++) {
			count += this.bodies[i].VertexCount ();
		}
		return count;
	},

	PolygonCount : function ()
	{
		var count = 0;
		var i;
		for (i = 0; i < this.bodies.length; i++) {
			count += this.bodies[i].PolygonCount ();
		}
		return count;
	}
};
