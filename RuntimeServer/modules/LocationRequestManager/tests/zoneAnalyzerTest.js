var turf = require('turf');
var math = require('mathjs');
var fs = require('fs');

var zoneSize = 200;
	
var SW = turf.point([-67.3, 18]);
var distSW_NE = math.eval('sqrt(2 * ' + zoneSize*2.5 + ' ^ 2)')/1000.0; // in Km
console.log(distSW_NE);
var NE = turf.destination(SW, distSW_NE , 45 ,'kilometers').geometry.coordinates;
console.log(SW.geometry.coordinates);
console.log(NE);

console.log(turf.distance(SW, turf.point(NE), 'kilometers'));
var extent = [SW.geometry.coordinates[0],SW.geometry.coordinates[1], NE[0],NE[1]];
var cellWidth = 0.2;
var units = 'kilometers';

var squareGrid =  turf.squareGrid(extent, cellWidth, units);

console.log('------------------------------------------------------------------');
console.log("Number of polygons: " + squareGrid.features.length);
console.log("Grid: " );
console.log(squareGrid.features[0].geometry.coordinates); 

fs.writeFile('testDoc', "Coordinates:\n", function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 

squareGrid.features.forEach(function(value,index){
	fs.appendFile('testDoc', value.geometry.coordinates[0][0][0] + ' ' + value.geometry.coordinates[0][0][1] + '  SWZone:' + index + "\n", function (err) {});
	fs.appendFile('testDoc', value.geometry.coordinates[0][1][0] + ' ' + value.geometry.coordinates[0][1][1] + '  NWZone:' + index + "\n", function (err) {});
	fs.appendFile('testDoc', value.geometry.coordinates[0][2][0] + ' ' + value.geometry.coordinates[0][2][1] + '  NEZone:' + index + "\n", function (err) {});
	fs.appendFile('testDoc', value.geometry.coordinates[0][3][0] + ' ' + value.geometry.coordinates[0][3][1] + '  SEZone:' + index + "\n\n", function (err) {});
}); 

fs.writeFile('testGrid.geojson', JSON.stringify(squareGrid), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was created and saved!");
}); 