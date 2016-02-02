#!/usr/bin/env node

var path = require ('path');

var fullPath = path.resolve ('jsmodelertest.js');
var dirName = path.dirname (fullPath);

var sutest = require ('sutest');
var unitTest = new sutest.UnitTest (dirName, process.argv);

global.DataView = sutest.Emulators.DataView;
jsModelerTest = require (fullPath)
jsModelerTest (unitTest);
unitTest.Run ();
