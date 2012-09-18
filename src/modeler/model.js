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
	}
};
