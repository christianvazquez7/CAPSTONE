var turf = require('turf');
var math = require('mathjs');
var fs = require('fs');
var ZoneAnalyzer = require('../zoneAnalyzer.js');

/*-----------------------------Grid bulding for testing----------------------------------------------*/ 
var zoneSize = 200;
	
var SW = turf.point([-67.3, 18]);
var distSW_NE = math.eval('sqrt(2 * ' + zoneSize*3 + ' ^ 2)')/1000.0; // in Km

var NE = turf.destination(SW, distSW_NE , 45 ,'kilometers').geometry.coordinates;

console.log(SW);
console.log(NE);

//console.log(turf.distance(SW, turf.point(NE), 'kilometers'));
var extent = [SW.geometry.coordinates[0],SW.geometry.coordinates[1], NE[0],NE[1]];
var cellWidth = 0.201;
var units = 'kilometers';

var squareGrid =  turf.squareGrid(extent, cellWidth, units);

/*console.log('------------------------------------------------------------------');
console.log("Number of polygons: " + squareGrid.features.length);
console.log("Grid: " );
console.log(squareGrid.features[0].geometry.coordinates); */

fs.writeFile('testDoc', "Coordinates:\n", function(err) {
    if(err) {
        return console.log(err);
    }
    //console.log("The file was saved!");
}); 

squareGrid.features.forEach(function(value,index){
	fs.appendFile('testDoc', value.geometry.coordinates[0][0][0] + ' ' + value.geometry.coordinates[0][0][1] + '  SWZone:' + index + "\n", function (err) {});
	fs.appendFile('testDoc', value.geometry.coordinates[0][1][0] + ' ' + value.geometry.coordinates[0][1][1] + '  NWZone:' + index + "\n", function (err) {});
	fs.appendFile('testDoc', value.geometry.coordinates[0][2][0] + ' ' + value.geometry.coordinates[0][2][1] + '  NEZone:' + index + "\n", function (err) {});
	fs.appendFile('testDoc', value.geometry.coordinates[0][3][0] + ' ' + value.geometry.coordinates[0][3][1] + '  SEZone:' + index + "\n\n", function (err) {});
}); 

squareGrid.features.sort(function(a, b) {
    // Sort by latitude decreasing
    var dLat = parseFloat(b.geometry.coordinates[0][0][1]) - parseFloat(a.geometry.coordinates[0][0][1]);
    if(dLat) return dLat;

    // If there is a tie, sort by longitude increasing
    var dLon = parseFloat(a.geometry.coordinates[0][0][0]) - parseFloat(b.geometry.coordinates[0][0][0]);
    return dLon;
});

fs.writeFile('testGrid.geojson', JSON.stringify(squareGrid), function(err) {
    if(err) {
        return console.log(err);
    }
    //console.log("The file was created and saved!");
}); 

var zonesMap = [];

squareGrid.features.forEach(function(value,index){
	var geoZone = {
		level: 0,
		crimeRate: 0,
		loc: null
	};
	geoZone.level = Math.floor((Math.random() * 10) + 1); 
	geoZone.crimeRate = Math.floor((Math.random() * 100) + 1); 
	geoZone.loc = value.geometry;
	zonesMap.push(geoZone);
}); 

for(var i = 0; i < zonesMap.length; i++){
	console.log("Lat: " + zonesMap[i].loc.coordinates[0][0][1] + "   Lon: " + zonesMap[i].loc.coordinates[0][0][0]);
}

/*fs.writeFile('testGridObjects.json', JSON.stringify(zonesMap), function(err) {
    if(err) {
        return console.log(err);
    }
    //console.log("The file was created and saved!");
});*/
/*-----------------------Test the zone analyzer with grid generated----------------------------------*/

var currentLocation = 
{
	longitude: -67.297,
	latitude: 18.0025
};
var currentLocationGeoJSON = turf.point([currentLocation.longitude, currentLocation.latitude]);
var speed = 9;

var geoZones = zonesMap;
var analyzer = new ZoneAnalyzer();
console.log("----------------------------------------------------------");
console.log("Testing geozones: ");
console.log(geoZones);
console.log("----------------------------------------------------------");

var mTimeForNextRequest = analyzer.calculateTimeToHRZone(speed,currentLocationGeoJSON,geoZones);
console.log("----------------------------------------------------------");
console.log("Time for next request = " + mTimeForNextRequest);


analyzer.getCurrentZone(currentLocationGeoJSON,geoZones, function (currentZone){
	var mCurrentGeoZone = currentZone;
	console.log("----------------------------------------------------------");
	console.log("Current Zone: ");
	console.log(mCurrentGeoZone);
	console.log("----------------------------------------------------------");
});


