var MarshallBuilder = require('./marshallBuilder.js');
var marshallBuilder = new MarshallBuilder();
var DataProvider = require('./dataProvider.js');
var source = 'http://data.pr.gov/';
var appToken = 'mxH22n8js0toWFnxPSEUDzVKi';
var resource = '3fy3-2bc5';
var marshall = marshallBuilder.date('fecha').time('hora').lat('point_x').lon('point_y').type('delitos_code').id('delito').build();
var start = '2013-01-01';
var end = '2015-02-28';
var dataProvider = new DataProvider(marshall);
dataProvider.init(onProviderReady,source,appToken,resource,start,undefined);
var startTime = 0;


function onProviderReady() {
	console.log('Provider is ready');
	startTime = Date.now();
	dataProvider.getData(onRecords,onExtractionEnd);
}

function onRecords(data) {
	console.log('Got batch');
	for (var i = 0 ; i < data.length ; i ++) {
		console.log('--------------crime record----------------');
		console.log('Latitude: ' + data[i].getLongitude());
		console.log('Longitude: ' + data[i].getLatitude());
		console.log('Type: ' + data[i].getType());
		console.log('Date: ' + data[i].getDate());
		console.log('Time: ' + data[i].getTime());

	}
}

function onExtractionEnd() {
	console.log('Extraction finished in: '+ (Date.now() - startTime));

}


