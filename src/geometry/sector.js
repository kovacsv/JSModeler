/**
* Enum: CoordSectorPosition2D
* Description: Position of a coordinate and a sector.
* Values:
*	{CoordInsideOfSector} coordinate lies inside of sector
*	{CoordOnSectorEndCoord} coordinate lies at the end of the sector
*	{CoordOutsideOfSector} coordinate lies outside of the sector
*/
JSM.CoordSectorPosition2D = {
	CoordInsideOfSector : 0,
	CoordOnSectorEndCoord : 1,
	CoordOutsideOfSector : 2
};

/**
* Enum: OldSectorSectorPosition2D
* Description: Position of two sectors.
* Values:
*	{SectorsDontIntersect} sectors do not intersect
*	{SectorsIntersectCoincident} sectors intersect coincident
*	{SectorsIntersectEndPoint} sectors intersect at end point
*	{SectorsIntersectOnePoint} sectors intersect one point
*/
JSM.OldSectorSectorPosition2D = {
	SectorsDontIntersect : 0,
	SectorsIntersectCoincident : 1,
	SectorsIntersectEndPoint : 2,
	SectorsIntersectOnePoint : 3
};

/**
* Enum: SectorSectorPosition2D
* Description: Position of two sectors.
* Values:
*	{SectorsDontIntersect} sectors do not intersect
*	{SectorsIntersectCoincident} sectors intersect coincident
*	{SectorsIntersectEndPoint} sectors intersect at end point
*	{SectorsIntersectOnePoint} sectors intersect one point
*/
JSM.SectorSectorPosition2D = {
	SectorsDontIntersect : 0,
	SectorsIntersectCoincident : 1,
	SectorsIntersectEndPoint : 2,
	SectorsIntersectOnePoint : 3
};

/**
* Enum: CoordSectorPosition
* Description: Position of a coordinate and a sector.
* Values:
*	{CoordInsideOfSector} coordinate lies inside of sector
*	{CoordOnSectorEndCoord} coordinate lies at the end of the sector
*	{CoordOutsideOfSector} coordinate lies outside of the sector
*/
JSM.CoordSectorPosition = {
	CoordInsideOfSector : 0,
	CoordOnSectorEndCoord : 1,
	CoordOutsideOfSector : 2
};

/**
* Class: Sector2D
* Description: Represents a 2D sector.
* Parameters:
*	beg {Coord2D} the beginning coordinate
*	end {Coord2D} the ending coordinate
*/
JSM.Sector2D = function (beg, end)
{
	this.beg = beg;
	this.end = end;
};

/**
* Function: Sector2D.Set
* Description: Sets the sector.
* Parameters:
*	beg {Coord2D} the beginning coordinate
*	end {Coord2D} the ending coordinate
*/
JSM.Sector2D.prototype.Set = function (beg, end)
{
	this.beg = beg;
	this.end = end;
};

/**
* Function: Sector.GetLength
* Description: Returns the length of the sector.
* Returns:
*	{number} the result
*/
JSM.Sector2D.prototype.GetLength = function ()
{
	return this.beg.DistanceTo (this.end);
};

/**
* Function: Sector2D.CoordPosition
* Description: Calculates the position of the sector and the given coordinate.
* Parameters:
*	coord {Coord2D} the coordinate
* Returns:
*	{CoordSectorPosition2D} the result
*/
JSM.Sector2D.prototype.CoordPosition = function (coord)
{
	var x = coord.x;
	var y = coord.y;
	var x1 = this.beg.x;
	var y1 = this.beg.y;
	var x2 = this.end.x;
	var y2 = this.end.y;

	var length = this.GetLength ();
	if (JSM.IsZero (length)) {
		if (coord.IsEqual (this.beg)) {
			return JSM.CoordSectorPosition2D.CoordOnSectorEndCoord;
		}

		return JSM.CoordSectorPosition2D.CoordOutsideOfSector;
	}

	var u = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / (length * length);
	if (JSM.IsLower (u, 0.0) || JSM.IsGreater (u, 1.0)) {
		return JSM.CoordSectorPosition2D.CoordOutsideOfSector;
	}

	var ux = x1 + u * (x2 - x1);
	var uy = y1 + u * (y2 - y1);
	if (!JSM.IsEqual (ux, x) || !JSM.IsEqual (uy, y)) {
		return JSM.CoordSectorPosition2D.CoordOutsideOfSector;
	}

	if (JSM.IsEqual (u, 0.0) || JSM.IsEqual (u, 1.0)) {
		return JSM.CoordSectorPosition2D.CoordOnSectorEndCoord;
	}

	return JSM.CoordSectorPosition2D.CoordInsideOfSector;
};

/**
* Function: Sector2D.OldSectorPosition
* Description: Calculates the position of the sector and the given sector.
* Parameters:
*	sector {Sector2D} the sector
*	intersection {Coord2D} (out) the intersection point if it exists
* Returns:
*	{OldSectorSectorPosition2D} the result
*/
JSM.Sector2D.prototype.OldSectorPosition = function (sector, intersection)
{
	var aSector = this;
	var bSector = sector;
	
	var x1 = aSector.beg.x;
	var y1 = aSector.beg.y;
	var x2 = aSector.end.x;
	var y2 = aSector.end.y;
	var x3 = bSector.beg.x;
	var y3 = bSector.beg.y;
	var x4 = bSector.end.x;
	var y4 = bSector.end.y;
	var ux = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
	var uy = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

	if (JSM.IsZero (ux) && JSM.IsZero (uy)) {
		var aBeg = bSector.CoordPosition (aSector.beg);
		var aEnd = bSector.CoordPosition (aSector.end);
		var bBeg = aSector.CoordPosition (bSector.beg);
		var bEnd = aSector.CoordPosition (bSector.end);
		if (aBeg === JSM.CoordSectorPosition2D.CoordInsideOfSector || aEnd === JSM.CoordSectorPosition2D.CoordInsideOfSector || bBeg === JSM.CoordSectorPosition2D.CoordInsideOfSector || bEnd === JSM.CoordSectorPosition2D.CoordInsideOfSector) {
			return JSM.OldSectorSectorPosition2D.SectorsIntersectCoincident;
		} else if (aBeg === JSM.CoordSectorPosition2D.CoordOnSectorEndCoord && aEnd === JSM.CoordSectorPosition2D.CoordOnSectorEndCoord && bBeg === JSM.CoordSectorPosition2D.CoordOnSectorEndCoord && bEnd === JSM.CoordSectorPosition2D.CoordOnSectorEndCoord) {
			return JSM.OldSectorSectorPosition2D.SectorsIntersectCoincident;
		} else if (aBeg === JSM.CoordSectorPosition2D.CoordOnSectorEndCoord || aEnd === JSM.CoordSectorPosition2D.CoordOnSectorEndCoord || bBeg === JSM.CoordSectorPosition2D.CoordOnSectorEndCoord || bEnd === JSM.CoordSectorPosition2D.CoordOnSectorEndCoord) {
			if (intersection !== undefined) {
				if (aBeg === JSM.CoordSectorPosition2D.CoordOnSectorEndCoord) {
					intersection = aSector.beg.Clone ();
				} else if (aEnd === JSM.CoordSectorPosition2D.CoordOnSectorEndCoord) {
					intersection = aSector.end.Clone ();
				} else if (bBeg === JSM.CoordSectorPosition2D.CoordOnSectorEndCoord) {
					intersection = bSector.beg.Clone ();
				} else if (bEnd === JSM.CoordSectorPosition2D.CoordOnSectorEndCoord) {
					intersection = bSector.end.Clone ();
				}
			}
			return JSM.OldSectorSectorPosition2D.SectorsIntersectEndPoint;
		}

		return JSM.OldSectorSectorPosition2D.SectorsDontIntersect;
	}

	var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
	if (JSM.IsZero (denom)) {
		return JSM.OldSectorSectorPosition2D.SectorsDontIntersect;
	}

	ux /= denom;
	uy /= denom;
	if (JSM.IsLower (ux, 0.0) || JSM.IsGreater (ux, 1.0) || JSM.IsLower (uy, 0.0) || JSM.IsGreater (uy, 1.0)) {
		return JSM.OldSectorSectorPosition2D.SectorsDontIntersect;
	}

	if (intersection !== undefined) {
		intersection.x = x1 + ux * (x2 - x1);
		intersection.y = y1 + ux * (y2 - y1);
	}

	if (JSM.IsEqual (ux, 0.0) || JSM.IsEqual (ux, 1.0) || JSM.IsEqual (uy, 0.0) || JSM.IsEqual (uy, 1.0)) {
		return JSM.OldSectorSectorPosition2D.SectorsIntersectEndPoint;
	}

	return JSM.OldSectorSectorPosition2D.SectorsIntersectOnePoint;
};

/**
* Function: Sector2D.SectorPosition
* Description: Calculates the position of the sector and the given sector.
* Parameters:
*	sector {Sector2D} the sector
*	intersection {Coord2D} (out) the intersection point if it exists
* Returns:
*	{SectorSectorPosition2D} the result
*/
JSM.Sector2D.prototype.SectorPosition = function (sector, intersection)
{
	function IsOnSegment (beg, end, coord)
	{
		if (!coord.IsEqual (beg) && !coord.IsEqual (end) &&
			JSM.IsLowerOrEqual (coord.x, Math.max (beg.x, end.x)) &&
			JSM.IsLowerOrEqual (coord.y, Math.max (beg.y, end.y)) &&
			JSM.IsGreaterOrEqual (coord.x, Math.min (beg.x, end.x)) &&
			JSM.IsGreaterOrEqual (coord.y, Math.min (beg.y, end.y)))
		{
			return true;
		}
		return false;
	}

	var calcIntersection = (intersection !== undefined && intersection !== null);
	
	var aBeg = this.beg;
	var aEnd = this.end;
	var bBeg = sector.beg;
	var bEnd = sector.end;
	
	var equalBeg = aBeg.IsEqual (bBeg) || aBeg.IsEqual (bEnd);
	var equalEnd = aEnd.IsEqual (bBeg) || aEnd.IsEqual (bEnd);
	if (equalBeg && equalEnd) {
		return JSM.SectorSectorPosition2D.SectorsIntersectCoincident;
	}

	var x1 = aBeg.x;
	var y1 = aBeg.y;
	var x2 = aEnd.x;
	var y2 = aEnd.y;
	var x3 = bBeg.x;
	var y3 = bBeg.y;
	var x4 = bEnd.x;
	var y4 = bEnd.y;

	var numeratorA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
	var numeratorB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
	var denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
	if (JSM.IsZero (denominator)) {
		if (JSM.IsZero (numeratorA) && JSM.IsZero (numeratorB)) {
			if (IsOnSegment (aBeg, aEnd, bBeg) ||
				IsOnSegment (aBeg, aEnd, bEnd) ||
				IsOnSegment (bBeg, bEnd, aBeg) ||
				IsOnSegment (bBeg, bEnd, aEnd))
			{
				return JSM.SectorSectorPosition2D.SectorsIntersectCoincident;
			} else if (equalBeg) {
				if (calcIntersection) {
					intersection.x = aBeg.x;
					intersection.y = aBeg.y;
				}
				return JSM.SectorSectorPosition2D.SectorsIntersectEndPoint;
			} else if (equalEnd) {
				if (calcIntersection) {
					intersection.x = aEnd.x;
					intersection.y = aEnd.y;
				}
				return JSM.SectorSectorPosition2D.SectorsIntersectEndPoint;
			}
		}
		return JSM.SectorSectorPosition2D.SectorsDontIntersect;
	}
	
	var distA = numeratorA / denominator;
	var distB = numeratorB / denominator;
	if (JSM.IsLower (distA, 0.0) || JSM.IsGreater (distA, 1.0) ||
		JSM.IsLower (distB, 0.0) || JSM.IsGreater (distB, 1.0))
	{
		return JSM.SectorSectorPosition2D.SectorsDontIntersect;
	}

	if (equalBeg) {
		if (calcIntersection) {
			intersection.x = aBeg.x;
			intersection.y = aBeg.y;
		}
		return JSM.SectorSectorPosition2D.SectorsIntersectEndPoint;
	} else if (equalEnd) {
		if (calcIntersection) {
			intersection.x = aEnd.x;
			intersection.y = aEnd.y;
		}
		return JSM.SectorSectorPosition2D.SectorsIntersectEndPoint;
	}
	
	if (calcIntersection) {
		intersection.x = x1 + distA * (x2 - x1);
		intersection.y = y1 + distA * (y2 - y1);
	}
	return JSM.SectorSectorPosition2D.SectorsIntersectOnePoint;
};

/**
* Function: Sector2D.ProjectCoord
* Description: Calculates the projected coordinate of the given coordinate.
* Parameters:
*	coord {Coord2D} the coordinate
* Returns:
*	{Coord2D} the projected coordinate
*/
JSM.Sector2D.prototype.ProjectCoord = function (coord)
{
	var x = coord.x;
	var y = coord.y;

	var beg = this.beg;
	var end = this.end;
	var x1 = beg.x;
	var y1 = beg.y;
	var x2 = end.x;
	var y2 = end.y;

	var denom = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
	if (JSM.IsZero (denom)) {
		return beg.Clone ();
	}

	var u = ((x2 - x1) * (x - x1) + (y2 - y1) * (y - y1)) / denom;
	if (JSM.IsLower (u, 0.0)) {
		return beg.Clone ();
	} else if (JSM.IsGreater (u, 1.0)) {
		return end.Clone ();
	}
	
	var dir = JSM.CoordSub2D (end, beg).MultiplyScalar (u);
	var result = JSM.CoordAdd2D (beg, dir);
	return result;
};

/**
* Function: Sector2D.Clone
* Description: Clones the sector.
* Returns:
*	{Sector2D} a cloned instance
*/
JSM.Sector2D.prototype.Clone = function ()
{
	return new JSM.Sector2D (this.beg.Clone (), this.end.Clone ());
};

/**
* Class: Sector
* Description: Represents a 3D sector.
* Parameters:
*	beg {Coord} the beginning coordinate
*	end {Coord} the ending coordinate
*/
JSM.Sector = function (beg, end)
{
	this.beg = beg;
	this.end = end;
};

/**
* Function: Sector.Set
* Description: Sets the sector.
* Parameters:
*	beg {Coord} the beginning coordinate
*	end {Coord} the ending coordinate
*/
JSM.Sector.prototype.Set = function (beg, end)
{
	this.beg = beg;
	this.end = end;
};

/**
* Function: Sector.GetLength
* Description: Returns the length of the sector.
* Returns:
*	{number} the result
*/
JSM.Sector.prototype.GetLength = function ()
{
	return this.beg.DistanceTo (this.end);
};

/**
* Function: Sector.CoordPosition
* Description: Calculates the position of the sector and the given coordinate.
* Parameters:
*	coord {Coord} the coordinate
* Returns:
*	{CoordSectorPosition} the result
*/
JSM.Sector.prototype.CoordPosition = function (coord)
{
	var x = coord.x;
	var y = coord.y;
	var z = coord.z;

	var a = this.beg;
	var b = JSM.CoordSub (this.end, this.beg);
	
	var x1 = a.x;
	var y1 = a.y;
	var z1 = a.z;
	var x2 = a.x + b.x;
	var y2 = a.y + b.y;
	var z2 = a.z + b.z;

	var denom = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1);
	if (JSM.IsZero (denom)) {
		if (a.IsEqual (coord)) {
			return JSM.CoordSectorPosition.CoordOnSectorEndCoord;
		}
		return JSM.CoordSectorPosition.CoordOutsideOfSector;
	}

	var u = ((x2 - x1) * (x - x1) + (y2 - y1) * (y - y1) + (z2 - z1) * (z - z1)) / denom;
	var bu = b.Clone ().MultiplyScalar (u);
	var c = JSM.CoordAdd (a, bu);
	var distance = coord.DistanceTo (c);
	if (JSM.IsZero (distance)) {
		if (JSM.IsLower (u, 0.0) || JSM.IsGreater (u, 1.0)) {
			return JSM.CoordSectorPosition.CoordOutsideOfSector;
		} else if (JSM.IsEqual (u, 0.0) || JSM.IsEqual (u, 1.0)) {
			return JSM.CoordSectorPosition.CoordOnSectorEndCoord;
		}
		return JSM.CoordSectorPosition.CoordInsideOfSector;
	}

	return JSM.CoordSectorPosition.CoordOutsideOfSector;
};

/**
* Function: Sector.Clone
* Description: Clones the sector.
* Returns:
*	{Sector} a cloned instance
*/
JSM.Sector.prototype.Clone = function ()
{
	return new JSM.Sector (this.beg.Clone (), this.end.Clone ());
};

/**
* Function: GetSectorSegmentation
* Description: Returns the segmented coordinates of a sector.
* Parameters:
*	sector {Sector} the sector
*	segmentation {integer} the segmentation
*	coords {Coord[*]} (out) the result coordinates
*/
JSM.GetSectorSegmentation = function (sector, segmentation, coords)
{
	var direction = JSM.CoordSub (sector.end, sector.beg);
	var length = sector.beg.DistanceTo (sector.end);
	var step = length / segmentation;
	var distance = 0.0;

	var i, offseted;
	for (i = 0; i <= segmentation; i++) {
		offseted = sector.beg.Clone ().Offset (direction, distance);
		coords.push (offseted);
		distance += step;
	}
};
