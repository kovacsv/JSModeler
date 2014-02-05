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

	var length = Math.pow (x2 - x1, 2) + Math.pow (y2 - y1, 2);
	if (JSM.IsZero (length)) {
		if (JSM.CoordIsEqual2D (coord, sector.beg)) {
			return 'CoordOnSectorEndCoord';
		}

		return 'CoordOutsideOfSector';
	}

	var u = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / length;
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
