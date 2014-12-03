JSM.BinaryReader = function (arrayBuffer, isLittleEndian)
{
	this.arrayBuffer = arrayBuffer;
	this.dataView = new DataView (arrayBuffer);
	this.isLittleEndian = isLittleEndian;
	this.position = 0;
};

JSM.BinaryReader.prototype.GetPosition = function ()
{
	return this.position;
};

JSM.BinaryReader.prototype.GetByteLength = function ()
{
	return this.arrayBuffer.byteLength;
};

JSM.BinaryReader.prototype.Skip = function (bytes)
{
	this.position = this.position + bytes;
};

JSM.BinaryReader.prototype.End = function ()
{
	return this.position >= this.arrayBuffer.byteLength;
};

JSM.BinaryReader.prototype.ReadBoolean = function ()
{
	var result = this.dataView.getInt8 (this.position);
	this.position = this.position + 1;
	return result ? true : false;
};

JSM.BinaryReader.prototype.ReadCharacter = function ()
{
	var result = this.dataView.getInt8 (this.position);
	this.position = this.position + 1;
	return result;
};

JSM.BinaryReader.prototype.ReadUnsignedCharacter = function ()
{
	var result = this.dataView.getUint8 (this.position);
	this.position = this.position + 1;
	return result;
};

JSM.BinaryReader.prototype.ReadInteger16 = function ()
{
	var result = this.dataView.getInt16 (this.position, this.isLittleEndian);
	this.position = this.position + 2;
	return result;
};

JSM.BinaryReader.prototype.ReadUnsignedInteger16 = function ()
{
	var result = this.dataView.getUint16 (this.position, this.isLittleEndian);
	this.position = this.position + 2;
	return result;
};

JSM.BinaryReader.prototype.ReadInteger32 = function ()
{
	var result = this.dataView.getInt32 (this.position, this.isLittleEndian);
	this.position = this.position + 4;
	return result;
};

JSM.BinaryReader.prototype.ReadUnsignedInteger32 = function ()
{
	var result = this.dataView.getUint32 (this.position, this.isLittleEndian);
	this.position = this.position + 4;
	return result;
};

JSM.BinaryReader.prototype.ReadFloat32 = function ()
{
	var result = this.dataView.getFloat32 (this.position, this.isLittleEndian);
	this.position = this.position + 4;
	return result;
};

JSM.BinaryReader.prototype.ReadDouble64 = function ()
{
	var result = this.dataView.getFloat64 (this.position, this.isLittleEndian);
	this.position = this.position + 8;
	return result;
};
