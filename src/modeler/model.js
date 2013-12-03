JSM.Model = function ()
{
	this.bodies = [];
};

JSM.Model.prototype.AddBody = function (body)
{
	this.bodies.push (body);
	return this.bodies.length - 1;
};

JSM.Model.prototype.GetBody = function (index)
{
	return this.bodies[index];
};

JSM.Model.prototype.BodyCount = function ()
{
	return this.bodies.length;
};

JSM.Model.prototype.VertexCount = function ()
{
	var count = 0;
	var i;
	for (i = 0; i < this.bodies.length; i++) {
		count += this.bodies[i].VertexCount ();
	}
	return count;
};

JSM.Model.prototype.PolygonCount = function ()
{
	var count = 0;
	var i;
	for (i = 0; i < this.bodies.length; i++) {
		count += this.bodies[i].PolygonCount ();
	}
	return count;
};
