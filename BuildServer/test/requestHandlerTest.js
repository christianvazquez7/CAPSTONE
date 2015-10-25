var RequestHandler = require('../modules/DataProvider/requestHandler.js');
var RequestBuilder = require('../modules/DataProvider/requestBuilder.js');
var MarshallBuilder = require('../modules/DataProvider/marshallBuilder.js');
var marshallBuilder = new MarshallBuilder();
var source = 'http://data.pr.gov/';
var appToken = 'mxH22n8js0toWFnxPSEUDzVKi';
var resource = '3fy3-2bc5';
var chunk = 3;
var marshall = marshallBuilder.date('fecha').time('hora').lat('point_x').lon('point_y').type('delitos_code').id('delito').build();
var start = '2015-02-27';
var end = '2015-02-28';
var handler = new RequestHandler();
handler.init(onHandlerReady, onData,onEnd, source, appToken,resource,chunk,marshall,1,1,start,end);

function onHandlerReady() {
	console.log('The module has been initialized');
	handler.requestData();
}

function onData(data) {
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

function onEnd() {
	console.log('All records processed.');
}