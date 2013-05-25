AddTestSuite ('Core');

AddTest ('CoreTest', function (test) {
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
});
