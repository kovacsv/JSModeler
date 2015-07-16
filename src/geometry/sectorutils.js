/**
* Function: CoordSectorPosition2D
* Description: Calculates the position of a coordinate and a sector.
* Parameters:
*	coord {Coord2D} the coordinate
*	sector {Sector2D} the sector
* Returns:
*	{string} 'CoordOnSectorEndCoord', 'CoordOutsideOfSector', or 'CoordInsideOfSector'
*/
JSM.CoordSectorPosition2D = function (coord, sector)
{
	var x = coord.x;
	var y = coord.y;
	var x1 = sector.beg.x;
	var y1 = sector.beg.y;
	var x2 = sector.end.x;
	var y2 = sector.end.y;

	var length = sector.GetLength ();
	if (JSM.IsZero (length)) {
		if (coord.IsEqual (sector.beg)) {
			return 'CoordOnSectorEndCoord';
		}

		return 'CoordOutsideOfSector';
	}

	var u = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / (length * length);
	if (JSM.IsLower (u, 0.0) || JSM.IsGreater (u, 1.0)) {
		return 'CoordOutsideOfSector';
	}

	var ux = x1 + u * (x2 - x1);
	var uy = y1 + u * (y2 - y1);
	if (!JSM.IsEqual (ux, x) || !JSM.IsEqual (uy, y)) {
		return 'CoordOutsideOfSector';
	}

	if (JSM.IsEqual (u, 0.0) || JSM.IsEqual (u, 1.0)) {
		return 'CoordOnSectorEndCoord';
	}

	return 'CoordInsideOfSector';
};

/**
* Function: ProjectCoordToSector2D
* Description: Projects a coordinate to a sector.
* Parameters:
*	coord {Coord2D} the coordinate
*	sector {Sector2D} the sector
* Returns:
*	{Coord2D} the projected coordinate
*/
JSM.ProjectCoordToSector2D = function (coord, sector)
{
	var x = coord.x;
	var y = coord.y;

	var beg = sector.beg;
	var end = sector.end;
	var x1 = beg.x;
	var y1 = beg.y;
	var x2 = end.x;
	var y2 = end.y;

	var denom = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
	if (JSM.IsZero (denom)) {
		return beg;
	}

	var u = ((x2 - x1) * (x - x1) + (y2 - y1) * (y - y1)) / denom;
	if (JSM.IsLower (u, 0.0)) {
		return beg;
	} else if (JSM.IsGreater (u, 1.0)) {
		return end;
	}
	
	var dir = JSM.CoordSub2D (end, beg);
	dir.MultiplyScalar (u);
	var result = JSM.CoordAdd2D (beg, dir);
	return result;
};

/**
* Function: CoordSectorPosition
* Description: Calculates the position of a coordinate and a sector.
* Parameters:
*	coord {Coord} the coordinate
*	sector {Sector} the sector
* Returns:
*	{string} 'CoordOnSectorEndCoord', 'CoordOutsideOfSector', or 'CoordInsideOfSector'
*/
JSM.CoordSectorPosition = function (coord, sector)
{
	var x = coord.x;
	var y = coord.y;
	var z = coord.z;

	var a = sector.beg;
	var b = JSM.CoordSub (sector.end, sector.beg);
	
	var x1 = a.x;
	var y1 = a.y;
	var z1 = a.z;
	var x2 = a.x + b.x;
	var y2 = a.y + b.y;
	var z2 = a.z + b.z;

	var denom = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1);
	if (JSM.IsZero (denom)) {
		if (a.IsEqual (coord)) {
			return 'CoordOnSectorEndCoord';
		}
		return 'CoordOutsideOfSector';
	}

	var u = ((x2 - x1) * (x - x1) + (y2 - y1) * (y - y1) + (z2 - z1) * (z - z1)) / denom;
	var bu = b.Clone ().MultiplyScalar (u);
	var c = JSM.CoordAdd (a, bu);
	var distance = coord.DistanceTo (c);
	if (JSM.IsZero (distance)) {
		if (JSM.IsLower (u, 0.0) || JSM.IsGreater (u, 1.0)) {
			return 'CoordOutsideOfSector';
		} else if (JSM.IsEqual (u, 0.0) || JSM.IsEqual (u, 1.0)) {
			return 'CoordOnSectorEndCoord';
		}
		return 'CoordInsideOfSector';
	}

	return 'CoordOutsideOfSector';
};

/**
* Function: SectorSectorPosition2D
* Description: Calculates the position of two sectors.
* Parameters:
*	aSector {Sector2D} the first sector
*	bSector {Sector2D} the second sector
* Returns:
*	{string} 'SectorsIntersectsCoincident', 'SectorsIntersectsEndPoint', 'SectorsIntersectsOnePoint', or 'SectorsDontIntersects'
*/
JSM.SectorSectorPosition2D = function (aSector, bSector, intersection)
{
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
		var aBeg = JSM.CoordSectorPosition2D (aSector.beg, bSector);
		var aEnd = JSM.CoordSectorPosition2D (aSector.end, bSector);
		var bBeg = JSM.CoordSectorPosition2D (bSector.beg, aSector);
		var bEnd = JSM.CoordSectorPosition2D (bSector.end, aSector);
		if (aBeg === 'CoordInsideOfSector' || aEnd === 'CoordInsideOfSector' || bBeg === 'CoordInsideOfSector' || bEnd === 'CoordInsideOfSector') {
			return 'SectorsIntersectsCoincident';
		} else if (aBeg === 'CoordOnSectorEndCoord' && aEnd === 'CoordOnSectorEndCoord' && bBeg === 'CoordOnSectorEndCoord' && bEnd === 'CoordOnSectorEndCoord') {
			return 'SectorsIntersectsCoincident';
		} else if (aBeg === 'CoordOnSectorEndCoord' || aEnd === 'CoordOnSectorEndCoord' || bBeg === 'CoordOnSectorEndCoord' || bEnd === 'CoordOnSectorEndCoord') {
			if (intersection !== undefined) {
				if (aBeg === 'CoordOnSectorEndCoord') {
					intersection = aSector.beg;
				} else if (aEnd === 'CoordOnSectorEndCoord') {
					intersection = aSector.end;
				} else if (bBeg === 'CoordOnSectorEndCoord') {
					intersection = bSector.beg;
				} else if (bEnd === 'CoordOnSectorEndCoord') {
					intersection = bSector.end;
				}
			}
			return 'SectorsIntersectsEndPoint';
		}

		return 'SectorsDontIntersects';
	}

	var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
	if (JSM.IsZero (denom)) {
		return 'SectorsDontIntersects';
	}

	ux /= denom;
	uy /= denom;
	if (JSM.IsLower (ux, 0.0) || JSM.IsGreater (ux, 1.0) || JSM.IsLower (uy, 0.0) || JSM.IsGreater (uy, 1.0)) {
		return 'SectorsDontIntersects';
	}

	if (intersection !== undefined) {
		intersection.x = x1 + ux * (x2 - x1);
		intersection.y = y1 + ux * (y2 - y1);
	}

	if (JSM.IsEqual (ux, 0.0) || JSM.IsEqual (ux, 1.0) || JSM.IsEqual (uy, 0.0) || JSM.IsEqual (uy, 1.0)) {
		return 'SectorsIntersectsEndPoint';
	}

	return 'SectorsIntersectsOnePoint';
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
