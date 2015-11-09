var Converter 	= require('../Converter.js');
var unit 		= require('unit.js');
var Log 		= require('log');
var fs 			= require('fs');
var randomner 	= require('randomner');
var log 		= new Log('debug', fs.createWriteStream('my.log'));
var converter 	= new Converter(log)
var threshold 	= 0.01;

function backwardConversion() {
	this.timeout(10000);

	var randomCoordinates = [];

	for(var i = 0; i < 20000; i++) {
		randomCoordinates[i] = randomner.randCoordinates().split(', ');
	}

	for (var i = 0; i < randomCoordinates.length; i++) {
		var location = {  latitude : parseFloat(randomCoordinates[i][0]),	longitude : parseFloat(randomCoordinates[i][1])	};

		var area = converter.translateArea(Math.pow(randomner.randInt(100, 1000),2));
		var result = converter.coordinateToTile(location, area);

		var anotherResult = converter.tileToCoordinate(result.getX(), result.getY(), area);

		unit.value(location.latitude).isApprox(anotherResult.getLatitude(),threshold);
		unit.value(location.longitude).isApprox(anotherResult.getLongitude(),threshold);
	};

}

function usingMultipleAreas() {

	unit.value(converter.translateArea(100*100)).isApprox(18.536,	threshold) 	// Zone of 10 Km2
	unit.value(converter.translateArea(150*150)).isApprox(17.952, 	threshold) 	// Zone of 22.5 Km2
	unit.value(converter.translateArea(200*200)).isApprox(17.5365, 	threshold) 	// Zone of 40 Km2
	unit.value(converter.translateArea(250*250)).isApprox(17.2145, 	threshold) 	// Zone of 62.5 Km2
	unit.value(converter.translateArea(300*300)).isApprox(16.9518, 	threshold) 	// Zone of 90 Km2
	unit.value(converter.translateArea(350*350)).isApprox(16.729, 	threshold) 	// Zone of 122.5 Km2
	unit.value(converter.translateArea(400*400)).isApprox(16.5365, 	threshold) 	// Zone of 160 Km2
	unit.value(converter.translateArea(450*450)).isApprox(16.3667, 	threshold) 	// Zone of 202.5 Km2
	unit.value(converter.translateArea(500*500)).isApprox(16.2145, 	threshold) 	// Zone of 250 Km2
	unit.value(converter.translateArea(550*550)).isApprox(16.0771, 	threshold) 	// Zone of 302.5 Km2
	unit.value(converter.translateArea(600*600)).isApprox(15.95155, threshold) 	// Zone of 360 Km2
	unit.value(converter.translateArea(650*650)).isApprox(15.8361, 	threshold) 	// Zone of 422.5 Km2
	unit.value(converter.translateArea(700*700)).isApprox(15.7292, 	threshold) 	// Zone of 490 Km2
	unit.value(converter.translateArea(750*750)).isApprox(15.62954, threshold) 	// Zone of 562.5 Km2
	unit.value(converter.translateArea(800*800)).isApprox(15.5365, 	threshold) 	// Zone of 640 Km2
}


suite('Converter', function() {
	for (var i = 0; i < 1; i++) {
		test('Changing the coordinate to tile and then back to coordinate', backwardConversion);
  		test('Testing with different Areas', usingMultipleAreas);
	};
});