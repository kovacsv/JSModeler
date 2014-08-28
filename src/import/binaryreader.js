JSM.LoadFileToArrayBuffer = function (fileName, onReady)
{
	var request = new XMLHttpRequest ();
	request.open ('GET', fileName, true);
	request.responseType = 'arraybuffer';

	request.onload = function (event) {
		var arrayBuffer = request.response;
		if (arrayBuffer) {
			onReady (arrayBuffer);
		}
	};

	request.send (null);
};

JSM.BinaryReader = function (byteBuffer)
{
	this.byteBuffer = byteBuffer;
	this.position = 0;
};

JSM.BinaryReader.prototype.ReadBoolean = function (onReady)
{
	return this.ReadIntegerType (1, true);
};

JSM.BinaryReader.prototype.ReadCharacter = function (onReady)
{
	return String.fromCharCode (this.ReadIntegerType (1, true));
};

JSM.BinaryReader.prototype.ReadInteger16 = function (onReady)
{
	return this.ReadIntegerType (2, true);
};

JSM.BinaryReader.prototype.ReadUnsignedInteger16 = function (onReady)
{
	return this.ReadIntegerType (2, false);
};

JSM.BinaryReader.prototype.ReadInteger32 = function (onReady)
{
	return this.ReadIntegerType (4, true);
};

JSM.BinaryReader.prototype.ReadUnsignedInteger32 = function (onReady)
{
	return this.ReadIntegerType (4, false);
};

JSM.BinaryReader.prototype.ReadIntegerType = function (bytes, signed)
{
	function MaxValueForBytes (byteNumber)
	{
		if (byteNumber == 0) { return 1; }
		if (byteNumber == 1) { return 256; }
		if (byteNumber == 2) { return 65536; }
		if (byteNumber == 3) { return 16777216; }
		if (byteNumber == 4) { return 4294967296; }
		return Math.pow (256, byteNumber);
	}

	var result = 0;
	if (bytes === 0) {
		return result;
	}

	var i;
	for (i = 0; i < bytes; i++) {
		result = result + this.byteBuffer[this.position] * MaxValueForBytes (i);
		this.position = this.position + 1;
	}
    
	if (signed && this.byteBuffer[this.position - 1] >= 128) {
		result = result - MaxValueForBytes (bytes);
	}
    
	return result;
};
