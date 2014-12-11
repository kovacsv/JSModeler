module.exports = function (unitTest)
{

var extrasSuite = unitTest.AddTestSuite ('Extras');

extrasSuite.AddTest ('BezierCurveTest', function (test)
{
	function TestBezierCurve (input, output, segmentation)
	{
		var result = JSM.GenerateBezierCurve (input, segmentation);
		test.Assert (result.length == output.length);
		var i;
		for (i = 0; i < result.length; i++) {
			test.Assert (JSM.CoordIsEqual2D (result[i], output[i]));
		}
	}

	TestBezierCurve (
		[
			new JSM.Coord2D (100, 0),
			new JSM.Coord2D (100, 100),
			new JSM.Coord2D (0, 100)
		],
		[
			new JSM.Coord2D (100, 0),
			new JSM.Coord2D (0, 100)
		],
		1
	);	
	
	TestBezierCurve (
		[
			new JSM.Coord2D (100, 0),
			new JSM.Coord2D (100, 100),
			new JSM.Coord2D (0, 100)
		],
		[
			new JSM.Coord2D (100, 0),
			new JSM.Coord2D (75, 75),
			new JSM.Coord2D (0, 100)
		],
		2
	);	

	TestBezierCurve (
		[
			new JSM.Coord2D (100, 0),
			new JSM.Coord2D (100, 100),
			new JSM.Coord2D (0, 100)
		],
		[
			new JSM.Coord2D (100, 0),
			new JSM.Coord2D (96.00000000000003, 36.00000000000001),
			new JSM.Coord2D (84, 64),
			new JSM.Coord2D (63.99999999999999, 84),
			new JSM.Coord2D (35.99999999999999, 96.00000000000001),
			new JSM.Coord2D (0, 100)
		],
		5
	);
	
	TestBezierCurve (
		[
			new JSM.Coord (-150, 0),
			new JSM.Coord (-50, 0),
			new JSM.Coord (-50, 100),
			new JSM.Coord (50, 100)
		],
		[
			new JSM.Coord2D (-150, 0),
			new JSM.Coord2D (-100.4, 10.400000000000004),
			new JSM.Coord2D (-65.2, 35.2),
			new JSM.Coord2D (-34.79999999999999, 64.80000000000001),
			new JSM.Coord2D (0.40000000000000924, 89.60000000000001),
			new JSM.Coord2D (50, 100)
		],
		5
	);
	TestBezierCurve (
		[
			new JSM.Coord2D (-150, 0),
			new JSM.Coord2D (-50, 0),
			new JSM.Coord2D (-50, 100),
			new JSM.Coord2D (50, 100),
			new JSM.Coord2D (50, 0)
		],
		[
			new JSM.Coord2D (-150, 0),
			new JSM.Coord2D (-88.24000000000004, 17.92000000000001),
			new JSM.Coord2D (-45.04, 49.920000000000016),
			new JSM.Coord2D (-5.039999999999978, 69.12),
			new JSM.Coord2D (31.760000000000012, 56.31999999999999),
			new JSM.Coord2D (50, 0)
		],
		5
	);
	TestBezierCurve (
		[
			new JSM.Coord2D (-150, 0),
			new JSM.Coord2D (-50, 0),
			new JSM.Coord2D (-50, 100),
			new JSM.Coord2D (50, 100),
			new JSM.Coord2D (50, 0),
			new JSM.Coord2D (150, 0)
		],
		[
			new JSM.Coord2D (-150, 0),
			new JSM.Coord2D (-76.94400000000005, 25.600000000000016),
			new JSM.Coord2D (-25.007999999999996, 57.600000000000016),
			new JSM.Coord2D (25.008000000000024, 57.599999999999994),
			new JSM.Coord2D (76.94400000000003, 25.59999999999999),
			new JSM.Coord2D (150, 0)
		],
		5
	);
	TestBezierCurve (
		[
			new JSM.Coord2D (-150, 0),
			new JSM.Coord2D (-50, 0),
			new JSM.Coord2D (-90, 150),
			new JSM.Coord2D (50, 30),
			new JSM.Coord2D (50, 0),
			new JSM.Coord2D (150, 0)
		],
		[
			new JSM.Coord2D (-150, 0),
			new JSM.Coord2D (-85.13600000000005, 32.256000000000014),
			new JSM.Coord2D (-38.832, 58.75200000000001),
			new JSM.Coord2D (15.792000000000026, 44.92799999999999),
			new JSM.Coord2D (74.89600000000003, 13.823999999999995),
			new JSM.Coord2D (150, 0)
		],
		5
	);
	TestBezierCurve (
		[
			new JSM.Coord2D (-150, 0),
			new JSM.Coord2D (-50, 0),
			new JSM.Coord2D (-50, 100),
			new JSM.Coord2D (50, 100),
			new JSM.Coord2D (50, 0),
			new JSM.Coord2D (150, 0),
			new JSM.Coord2D (150, -100),
			new JSM.Coord2D (50, -100),
			new JSM.Coord2D (50, -50),
			new JSM.Coord2D (-50, -50),
			new JSM.Coord2D (-50, -100),
			new JSM.Coord2D (-150, -100)
		],
		[
			new JSM.Coord2D (-150, 0),
			new JSM.Coord2D (-15.487564800000024, 50.520119296000054),
			new JSM.Coord2D (73.93620480000003, 3.3823047679999867),
			new JSM.Coord2D (73.93620479999996, -59.192506368000004),
			new JSM.Coord2D (-15.487564800000035, -72.97423769600003),
			new JSM.Coord2D (-150, -100)
		],
		5
	);	
});

}
