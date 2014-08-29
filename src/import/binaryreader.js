JSM.GetArrayBufferFromURL = function (url, onReady)
{
	var request = new XMLHttpRequest ();
	request.open ('GET', url, true);
	request.responseType = 'arraybuffer';

	request.onload = function (event) {
		var arrayBuffer = request.response;
		if (arrayBuffer) {
			onReady (arrayBuffer);
		}
	};

	request.send (null);
};

JSM.GetArrayBufferFromFile = function (file, onReady)
{
	var reader = new FileReader ();

	reader.onloadend = (function (event) {
		if (event.target.readyState == FileReader.DONE) {
			onReady (event.target.result);
		}
	});

	reader.readAsArrayBuffer (file);
};

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

JSM.BinaryReader.prototype.ReadBoolean = function (onReady)
{
	var result = this.dataView.getInt8 (this.position, this.isLittleEndian);
	this.position = this.position + 1;
	return result ? true : false;
};

JSM.BinaryReader.prototype.ReadCharacter = function (onReady)
{
	var result = this.dataView.getInt8 (this.position, this.isLittleEndian);
	this.position = this.position + 1;
	return result;
};

JSM.BinaryReader.prototype.ReadUnsignedCharacter = function (onReady)
{
	var result = this.dataView.getUint8 (this.position, this.isLittleEndian);
	this.position = this.position + 1;
	return result;
};

JSM.BinaryReader.prototype.ReadInteger16 = function (onReady)
{
	var result = this.dataView.getInt16 (this.position, this.isLittleEndian);
	this.position = this.position + 2;
	return result;
};

JSM.BinaryReader.prototype.ReadUnsignedInteger16 = function (onReady)
{
	var result = this.dataView.getUint16 (this.position, this.isLittleEndian);
	this.position = this.position + 2;
	return result;
};

JSM.BinaryReader.prototype.ReadInteger32 = function (onReady)
{
	var result = this.dataView.getInt32 (this.position, this.isLittleEndian);
	this.position = this.position + 4;
	return result;
};

JSM.BinaryReader.prototype.ReadUnsignedInteger32 = function (onReady)
{
	var result = this.dataView.getUint32 (this.position, this.isLittleEndian);
	this.position = this.position + 4;
	return result;
};

JSM.BinaryReader.prototype.ReadFloat32 = function (onReady)
{
	var result = this.dataView.getFloat32 (this.position, this.isLittleEndian);
	this.position = this.position + 4;
	return result;
};

JSM.BinaryReader.prototype.ReadDouble64 = function (onReady)
{
	var result = this.dataView.getFloat64 (this.position, this.isLittleEndian);
	this.position = this.position + 8;
	return result;
};
