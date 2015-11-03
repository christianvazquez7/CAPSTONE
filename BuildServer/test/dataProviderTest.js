var MarshallBuilder = require('../modules/DataProvider/marshallBuilder.js');
var unit = require('unit.js');
var Crime = require('../modules/DataProvider/crime.js');
var DataProvider = require('../modules/DataProvider/dataProvider.js');

var marshallBuilder = new MarshallBuilder();
var marshall = marshallBuilder.date('fecha').time('hora').lat('point_x').lon('point_y').type('delitos_code').id('delito').build();

var source = 'http://data.pr.gov/';
var appToken = 'mxH22n8js0toWFnxPSEUDzVKi';
var resource = '3fy3-2bc5';

var pg = require('pg');
var conString = "postgres://postgres:Aguaseka7!@localhost/KYAUtility";

function testSignalEndForNoData(done) {
	console.log('jajaja');
	this.timeout(10000);
	var start = '2016-02-27';
	var end = '2016-02-28';
	var dataProvider = new DataProvider(marshall);
	dataProvider.init(onProviderReady,source,appToken,resource,start,undefined);

	function onProviderReady() {
		dataProvider.getData(onRecords,onExtractionEnd);
	}

	function onRecords(data) {
		throw new Error('Data should not exist.');

		// for (var i = 0 ; i < data.length ; i ++) {
		// 	console.log('--------------crime record----------------');
		// 	console.log('Latitude: ' + data[i].getLongitude());
		// 	console.log('Longitude: ' + data[i].getLatitude());
		// 	console.log('Type: ' + data[i].getType());
		// 	console.log('Date: ' + data[i].getDate());
		// 	console.log('Time: ' + data[i].getTime());

		// }
	}

	function onExtractionEnd() {
		done();
	}
}

function testSignalEndForDataButAllProcessed(done) {
	this.timeout(10000);
	var start = '2015/03/22';
	var mPgClient = new pg.Client(conString);
	var end;
	var dataProvider = new DataProvider(marshall);
	mPgClient.connect(function(err) {
		console.log(err);
		mPgClient.query('UPDATE utility SET lastpage = 100, lastoffset = null', function(err,result){
			console.log(err);
			dataProvider.init(onProviderReady,source,appToken,resource,start,undefined);
		});
	});

	function onProviderReady() {
		dataProvider.getData(onRecords,onExtractionEnd);
	}

	function onRecords(data) {
		throw new Error('Data should not exist.');
	}

	function onExtractionEnd() {
		mPgClient.end();
		done();
	}
}

function testSignalEndForDataButSomeProcessed(done) {
	var mPgClient = new pg.Client(conString);
	this.timeout(10000);
	var start = '2015/03/22';
	var end;
	var dataProvider = new DataProvider(marshall);
	dataProvider.setChunkSize(59);
	mPgClient.connect(function(err) {
		console.log(err);
		mPgClient.query('UPDATE utility SET lastpage = 1, lastoffset = null', function(err,result){
			console.log(err);
			dataProvider.init(onProviderReady,source,appToken,resource,start,undefined);
		});
	});

	function onProviderReady() {
		dataProvider.getData(onRecords,onExtractionEnd);
	}

	function onRecords(data) {
		for (var i = 0 ; i < data.length ; i ++) {
			unit.value(data[i].getPage()).isGreaterThan(1);
		}
		dataProvider.getData(onRecords,onExtractionEnd);
	}

	function onExtractionEnd() {
		mPgClient.end();
		done();
	}
}


function testSignalEndForNormalOperation(done) {
	var mPgClient = new pg.Client(conString);
	this.timeout(10000);
	var start = '2015/03/22';
	var end;
	var dataProvider = new DataProvider(marshall);
	dataProvider.setChunkSize(59);
	mPgClient.connect(function(err) {
		console.log(err);
		mPgClient.query('UPDATE utility SET lastpage = null, lastoffset = null', function(err,result){
			console.log(err);
			dataProvider.init(onProviderReady,source,appToken,resource,start,undefined);
		});
	});

	function onProviderReady() {
		dataProvider.getData(onRecords,onExtractionEnd);
	}

	function onRecords(data) {
		dataProvider.getData(onRecords,onExtractionEnd);
	}

	function onExtractionEnd() {
		mPgClient.end();
		done();
	}
}

function testRightChunkSize(done) {
	var mPgClient = new pg.Client(conString);
	this.timeout(10000);
	var start = '2014/03/22';
	var end = '2014/08/22';
	var dataProvider = new DataProvider(marshall);
	mPgClient.connect(function(err) {
		console.log(err);
		mPgClient.query('UPDATE utility SET lastpage = null, lastoffset = null', function(err,result){
			console.log(err);
			dataProvider.init(onProviderReady,source,appToken,resource,start,end);
		});
	});

	function onProviderReady() {
		dataProvider.getData(onRecords,onExtractionEnd);
	}

	function onRecords(data) {
		console.log('data sizeeee:' + data.length);
		unit.value(data.length).isEqualTo(1000);
		mPgClient.end();
		done();
	}

	function onExtractionEnd() {
	
	}
}

function testSetChunkSize(done) {
	var mPgClient = new pg.Client(conString);
	this.timeout(10000);
	var start = '2015/03/22';
	var chunk = 59;
	var end;
	var dataProvider = new DataProvider(marshall);
	dataProvider.setChunkSize(chunk);
	mPgClient.connect(function(err) {
		console.log(err);
		mPgClient.query('UPDATE utility SET lastpage = null, lastoffset = null', function(err,result){
			console.log(err);
			dataProvider.init(onProviderReady,source,appToken,resource,start,undefined);
		});
	});

	function onProviderReady() {
		dataProvider.getData(onRecords,onExtractionEnd);
	}

	function onRecords(data) {
		unit.value(data.length).isEqualTo(chunk);
		dataProvider.getData(onRecords,onExtractionEnd);
	}

	function onExtractionEnd() {
		mPgClient.end();
		done();
	}
}

function testCrimesAreFetchedAfterLastPageProcessed(done) {
	var mPgClient = new pg.Client(conString);
	this.timeout(10000);
	var start = '2014/03/22';
	var end = '2014/08/22';
	var dataProvider = new DataProvider(marshall);
	mPgClient.connect(function(err) {
		console.log(err);
		mPgClient.query('UPDATE utility SET lastpage = 20, lastoffset = null', function(err,result){
			console.log(err);
			dataProvider.init(onProviderReady,source,appToken,resource,start,end);
		});
	});

	function onProviderReady() {
		dataProvider.getData(onRecords,onExtractionEnd);
	}

	function onRecords(data) {
		for (var i = 0 ; i < data.length ; i ++) {
			unit.value(data[i].getPage()).isGreaterThan(20);
		}
		dataProvider.getData(onRecords,onExtractionEnd);
	}

	function onExtractionEnd() {
		mPgClient.end();
		done();
	}
}

function testCrimesAreFetchedAfterLastPageProcessedAfterLastCrimeProcessed(done) {
	var mPgClient = new pg.Client(conString);
	this.timeout(10000);
	var start = '2014/03/22';
	var end = '2014/08/22';
	var dataProvider = new DataProvider(marshall);
	var page = 21;
	mPgClient.connect(function(err) {
		console.log(err);
		mPgClient.query('UPDATE utility SET lastpage = 20, lastoffset = 20', function(err,result){
			console.log(err);
			dataProvider.init(onProviderReady,source,appToken,resource,start,end);
		});
	});

	function onProviderReady() {
		dataProvider.getData(onRecords,onExtractionEnd);
	}

	function onRecords(data) {
		for (var i = 0 ; i < data.length ; i ++) {
			if(page == 21) {
				unit.value(data[i].getOffset()).isGreaterThan(20);
			}
			unit.value(data[i].getPage()).isGreaterThan(20);
		}
		page ++;
		dataProvider.getData(onRecords,onExtractionEnd);
	}

	function onExtractionEnd() {
		mPgClient.end();
		done();
	}
}

function testCrimesAreFetchedAfterLastCrimeProcessed(done) {
	var mPgClient = new pg.Client(conString);
	this.timeout(10000);
	var start = '2015/03/22';
	var dataProvider = new DataProvider(marshall);
	var page = 1;
	mPgClient.connect(function(err) {
		console.log(err);
		mPgClient.query('UPDATE utility SET lastpage = null, lastoffset = 27', function(err,result){
			console.log(err);
			dataProvider.init(onProviderReady,source,appToken,resource,start,undefined);
		});
	});

	function onProviderReady() {
		dataProvider.getData(onRecords,onExtractionEnd);
	}

	function onRecords(data) {
		for (var i = 0 ; i < data.length ; i ++) {
			if(page == 1) {
				unit.value(data[i].getOffset()).isGreaterThan(27);
			}
		}
		page ++;
		dataProvider.getData(onRecords,onExtractionEnd);
	}

	function onExtractionEnd() {
		mPgClient.end();
		done();
	}
}

suite('DataProvider', function() {
  test('Signals end for no data available.', testSignalEndForNoData);
  test('Signals end for data but all processed (fetching state from db).', testSignalEndForDataButAllProcessed);
  test('Signals end for data but some records processed (fetching state from db).', testSignalEndForDataButSomeProcessed);
  test('Signals end for after all data fetched.', testSignalEndForNormalOperation);
  test('Retrieves data of correct chunk size.', testRightChunkSize);
  test('Changing default chunk size changes page contents.', testSetChunkSize);
  test('Start fetching crime after last page processed (fetching state from db).', testCrimesAreFetchedAfterLastPageProcessed);
  test('Start fetching crime after last page processed, ignoring last crime processed (fetching state from db.', testCrimesAreFetchedAfterLastPageProcessedAfterLastCrimeProcessed);
  test('Start fetching crime after last offset processed (fetching state from db).', testCrimesAreFetchedAfterLastCrimeProcessed);
});




