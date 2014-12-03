module.exports = DataView;

function DataView (buffer)
{
	this.buffer = buffer;
}

DataView.prototype.getInt8 = function (position)
{
	return this.buffer.readInt8 (position);
};

DataView.prototype.getUint8 = function (position)
{
	return this.buffer.readUInt8 (position);
};

DataView.prototype.getInt16 = function (position, isLittleEndian)
{
	if (isLittleEndian) {
		return this.buffer.readInt16LE (position);
	} else {
		return this.buffer.readInt16BE (position);
	}
};

DataView.prototype.getUint16 = function (position, isLittleEndian)
{
	if (isLittleEndian) {
		return this.buffer.readUInt16LE (position);
	} else {
		return this.buffer.readUInt16BE (position);
	}
};

DataView.prototype.getInt32 = function (position, isLittleEndian)
{
	if (isLittleEndian) {
		return this.buffer.readInt32LE (position);
	} else {
		return this.buffer.readInt32BE (position);
	}
};

DataView.prototype.getUint32 = function (position, isLittleEndian)
{
	if (isLittleEndian) {
		return this.buffer.readUInt32LE (position);
	} else {
		return this.buffer.readUInt32BE (position);
	}
};

DataView.prototype.getFloat32 = function (position, isLittleEndian)
{
	if (isLittleEndian) {
		return this.buffer.readFloatLE (position);
	} else {
		return this.buffer.readFloatBE (position);
	}
};

DataView.prototype.getFloat64 = function (position, isLittleEndian)
{
	if (isLittleEndian) {
		return this.buffer.readDoubleLE (position);
	} else {
		return this.buffer.readDoubleBE (position);
	}
};
