var MarshallBuilder = require('./marshallBuilder.js');
var unit = require('unit.js');
var Crime = require('../modules/DataProvider/crime.js');
var DataProvider = require('./dataProvider.js');

var marshallBuilder = new MarshallBuilder();
var marshall = marshallBuilder.date('fecha').time('hora').lat('point_x').lon('point_y').type('delitos_code').id('delito').build();

var source = 'http://data.pr.gov/';
var appToken = 'mxH22n8js0toWFnxPSEUDzVKi';
var resource = '3fy3-2bc5';


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

function testSignalEndForNoData(done) {

}

function testSignalEndForDataButAllProcessed(done) {

}

function testSignalEndForDataButAllProcessed(done) {
	
}

function testSignalEndForNormalOperation(done) {

}

function testRightChunkSize(done) {

}

function testSetChunkSize(done) {

}

function testCrimesAreFetchedAfterLastPageProcessed(done) {

}

function testCrimesAreFetchedAfterLastPageProcessedAfterLastCrimeProcessed(done) {

}

function testCrimesAreFetchedAfterLastCrimeProcessed(done) {

}

suite('DataProvider', function() {
  test('Signals end for no data available.', testSignalEndForNoData);
  test('Signals end for data but all processed (fetching state from db).', testSignalEndForDataButAllProcessed);
  test('Signals end for data but some records processed (fetching state from db).', testSignalEndForDataButAllProcessed);
  test('Signals end for after all data fetched.', testSignalEndForNormalOperation);
  test('Retrieves data of correct chunk size.', testRightChunkSize);
  test('Changing default chunk size changes page contents.', testSetChunkSize);
  test('Start fetching crime after last page processed (fetching state from db).', testCrimesAreFetchedAfterLastPageProcessed);
  test('Start fetching crime after last page processed, ignoring last crime processed (fetching state from db.', testCrimesAreFetchedAfterLastPageProcessedAfterLastCrimeProcessed);
  test('Start fetching crime after last offset processed (fetching state from db).', testCrimesAreFetchedAfterLastCrimeProcessed);
});




