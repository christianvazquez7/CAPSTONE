var MarshallBuilder = require('./DataProvider/marshallBuilder.js');
var marshallBuilder = new MarshallBuilder();
var DataProvider = require('./DataProvider/dataProvider.js');
var source = 'https://data.cityofboston.gov/';
var appToken = 'mxH22n8js0toWFnxPSEUDzVKi';
var resource = '7cdf-6fgx';
var marshall = marshallBuilder.date('fromdate').time('fromdate').lat('location').lon('location').type('incident_type_description').id('compnos').build();
var start = '2012-07-08';
var end = '2015-08-10';
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