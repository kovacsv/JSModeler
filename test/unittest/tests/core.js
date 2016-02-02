module.exports = function (unitTest)
{

var suite = unitTest.AddTestSuite ('Core');

suite.AddTest ('CoreTest', function (test) {
	var GetAValue = function (val)
	{
		return JSM.ValueOrDefault (val, 2);
	};

	var a = 0.0000001;
	var b = 0.0000002;
	var c = 0.000000001;
	var d = 0.000000002;
	
	var e = -0.0000001;
	var f = -0.0000002;
	var g = -0.000000001;
	var h = -0.000000002;
	
	test.Assert (!JSM.IsEqual (a, b));
	test.Assert (!JSM.IsEqual (a, e));

	test.Assert (JSM.IsEqual (c, d));
	test.Assert (JSM.IsEqual (c, g));
	
	test.Assert (JSM.IsPositive (a));
	test.Assert (!JSM.IsPositive (c));
	test.Assert (!JSM.IsPositive (d));

	test.Assert (JSM.IsNegative (e));
	test.Assert (!JSM.IsNegative (g));
	test.Assert (!JSM.IsNegative (h));

	test.Assert (JSM.IsLower (a, b));
	test.Assert (!JSM.IsLower (c, d));
	test.Assert (JSM.IsLowerOrEqual (c, d));

	test.Assert (JSM.IsGreater (b, a));
	test.Assert (!JSM.IsGreater (d, c));
	test.Assert (JSM.IsGreaterOrEqual (d, c));

	test.Assert (JSM.IsEqual (90.0 * JSM.DegRad, Math.PI / 2.0));
	test.Assert (JSM.IsEqual (Math.PI / 2.0 * JSM.RadDeg, 90.0));

	test.Assert (JSM.ValueOrDefault (1, 2) == 1);
	test.Assert (JSM.ValueOrDefault (undefined, 2) == 2);
	test.Assert (JSM.ValueOrDefault (null, 2) == 2);
	test.Assert (GetAValue (1) == 1);
	test.Assert (GetAValue (undefined) == 2);
	test.Assert (GetAValue (null) == 2);
	test.Assert (GetAValue () == 2);
	
	test.Assert (JSM.ArcSin (0.5) == Math.asin (0.5));
	test.Assert (JSM.ArcSin (1.0) == Math.PI / 2.0);
	test.Assert (JSM.ArcSin (-1.0) == -Math.PI / 2.0);

	test.Assert (JSM.ArcCos (0.5) == Math.acos (0.5));
	test.Assert (JSM.ArcCos (1.0) == 0.0);
	test.Assert (JSM.ArcCos (-1.0) == Math.PI);
	
	var i, rnd;
	for (i = 0; i < 100; i++) {
		rnd = JSM.RandomNumber (5.0, 10.0);
		test.Assert (rnd >= 5.0 && rnd <= 10.0);
		rnd = JSM.RandomInt (5, 10);
		test.Assert (rnd >= 5 && rnd <= 10);
		rnd = JSM.SeededRandomInt (5, 10, i);
		test.Assert (rnd >= 5 && rnd <= 10);
	}
	
	test.AssertEqual (JSM.PrevIndex (0, 3), 2);
	test.AssertEqual (JSM.PrevIndex (1, 3), 0);
	test.AssertEqual (JSM.PrevIndex (2, 3), 1);

	test.AssertEqual (JSM.NextIndex (0, 3), 1);
	test.AssertEqual (JSM.NextIndex (1, 3), 2);
	test.AssertEqual (JSM.NextIndex (2, 3), 0);
});

suite.AddTest ('SortTest', function (test) {
	var array = null;
	
	array = [];
	JSM.BubbleSort (array, function (a, b) {
		return a < b;
	});
	test.Assert (array.toString () == [].toString ());

	array = [1];
	JSM.BubbleSort (array, function (a, b) {
		return a < b;
	});
	test.Assert (array.toString () == [1].toString ());

	array = [2, 1];
	JSM.BubbleSort (array, function (a, b) {
		return a < b;
	});
	test.Assert (array.toString () == [1, 2].toString ());

	array = [1, 2, 3, 4, 5];
	JSM.BubbleSort (array, function (a, b) {
		return a < b;
	});
	test.Assert (array.toString () == [1, 2, 3, 4, 5].toString ());

	array = [5, 4, 3, 2, 1];
	JSM.BubbleSort (array, function (a, b) {
		return a < b;
	});
	test.Assert (array.toString () == [1, 2, 3, 4, 5].toString ());

	array = [5, 3, 1, 4, 2];
	JSM.BubbleSort (array, function (a, b) {
		return a < b;
	});
	test.Assert (array.toString () == [1, 2, 3, 4, 5].toString ());

	array = [5, 3, 3, 3, 1];
	JSM.BubbleSort (array, function (a, b) {
		return a < b;
	});
	test.Assert (array.toString () == [1, 3, 3, 3, 5].toString ());
});

}
