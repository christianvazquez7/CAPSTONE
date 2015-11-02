var unit = require('unit.js');
var GridController = require('../gridController.js');
var coordinate = require('../../../../Class_Skeletons/GeoCoordinate.js');

function readyToFetch() {
	var gridController = new GridController(0.2);
	unit.value(gridController.isReadyToFetch(0.2)).isEqualTo('true');
}

function notReadyToFetch() {
	var gridController = new GridController(0.2);
	unit.value(gridController.isReadyToFetch(20)).isEqualTo('false');
}

function buildGrid() {
	var swLat = 17.918636,
		swLng = -67.299500,
		neLat = 18.536909,
		neLng = -65.176392,
		area = 20;

	var gridController = new GridController(0.2);
	result = gridController.buildGrids(new coordinate(swLat, swLng), new coordinate(neLat, neLng), area);
	unit.value(result.features.length).isEqualTo(48);
}

function buildGridIncorrectLatLng() {
	var swLat = -15,
		swLng = 17.918636,
		neLat = -65.176392,
		neLng = 10,
		area = 20;

	var gridController = new GridController(0.2);
	result = gridController.buildGrids(new coordinate(swLat, swLng), new coordinate(neLat, neLng), area);
	unit.value(result.features.length).isNotEqualTo(48);
}

suite('GridController', function() {
	test('Veryfying if we are ready to fetch zones, it should return true.', readyToFetch);
	test('Verifying if we are ready to fecth zones, it should return false.', notReadyToFetch);
	test('Building grid with correct coordinates.', buildGrid);
	test('Building grid with incorrect coordinates.', buildGridIncorrectLatLng);
});

