var RequestHandler = require('../modules/DataProvider/requestHandler.js');
var RequestBuilder = require('../modules/DataProvider/requestBuilder.js');
var MarshallBuilder = require('../modules/DataProvider/marshallBuilder.js');
var Crime = require('../modules/DataProvider/crime.js');
var unit = require('unit.js');
var marshallBuilder = new MarshallBuilder();
var dummy = new Crime();
var source = 'http://data.pr.gov/';
var appToken = 'mxH22n8js0toWFnxPSEUDzVKi';
var resource = '3fy3-2bc5';
var should = unit.should;
var marshall = marshallBuilder.date('fecha').time('hora').lat('point_x').lon('point_y').type('delitos_code').id('delito').build();

function testSignalEndForNoData(done) {
	var start = '2016-02-27';
	var end = '2016-02-28';
	var handler = new RequestHandler();
	var chunk = 3;
	this.timeout(10000);
	handler.init(onHandlerReady, onData,onEnd, source, appToken,resource,chunk,marshall,undefined,undefined,start,end);

	function onHandlerReady() {
		handler.requestData();
	}

	function onData(data) {
		throw new Error('Data should not exist.');
	}

	function onEnd() {
		done();
	}
}

function testSignalEndForDataButAllProcessed(done) {
	var start = '2015/03/22';
	var end;
	var chunk = 1000;
	var handler = new RequestHandler();
	this.timeout(10000);
	handler.init(onHandlerReady, onData,onEnd, source, appToken,resource,chunk,marshall,1,undefined,start,end);

	function onHandlerReady() {
		handler.requestData();
	}

	function onData(data) {
		throw new Error('Data should not be processed.');
	}

	function onEnd() {
		done();
	}
}

function testSignalEndForNormalOperation(done) {
	var start = '2015/03/22';
	var end;
	var chunk = 50;
	var handler = new RequestHandler();
	this.timeout(10000);
	handler.init(onHandlerReady, onData,onEnd, source, appToken,resource,chunk,marshall,undefined,undefined,start,end);

	function onHandlerReady() {
		handler.requestData();
	}

	function onData(data) {
		handler.requestData();
	}

	function onEnd() {
		done();
	}
}

function testRightChunkSize(done) {
	var start = '2015/03/22';
	var end;
	var chunk = 59;
	var handler = new RequestHandler();
	this.timeout(10000);
	handler.init(onHandlerReady, onData,onEnd, source, appToken,resource,chunk,marshall,undefined,undefined,start,end);

	function onHandlerReady() {
		handler.requestData();
	}

	function onData(data) {
		unit.value(data.length).isEqualTo(chunk);
		handler.requestData();
	}

	function onEnd() {
		done();
	}
}

function testThatAllCrimesFetchedAreAfterStart(done) {

	var start = '2015/03/22';
	var end = undefined;
	var chunk = 59;
	var handler = new RequestHandler();
	this.timeout(30000);
	handler.init(onHandlerReady, onData,onEnd, source, appToken,resource,chunk,marshall,undefined,undefined,start,end);

	function onHandlerReady() {
		handler.requestData();
	}

	function onData(data) {
		unit.value(data.length).isEqualTo(chunk);
		for(var i = 0; i<data.length; i++) {
			var myCrime = data[i];
			var date = new Date(myCrime.getDate());
			var dateNumeric = +date;
			var gmt = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
			unit.should((+gmt) >= new Date(start)).be.ok;
		}
		handler.requestData();
	}

	function onEnd() {
		done();
	}
}

function testThatAllCrimesFetchedAreBeforeEnd(done) {
	var end = '2013/01/03';
	var start = undefined;
	var chunk = 91;
	var handler = new RequestHandler();
	this.timeout(30000);
	handler.init(onHandlerReady, onData,onEnd, source, appToken,resource,chunk,marshall,undefined,undefined,start,end);

	function onHandlerReady() {
		handler.requestData();
	}

	function onData(data) {
		for(var i = 0; i<data.length; i++) {
			var myCrime = data[i];
			var date = new Date(myCrime.getDate());
			var dateNumeric = +date;
			var gmt = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
			unit.should((+gmt) <= new Date(end)).be.ok;
		}
		handler.requestData();
	}

	function onEnd() {
		done();
	}
}

function testThatAllCrimesFetchedAreWithinWindow(done) {
	var end = '2013/01/03';
	var start = '2013/01/01';
	var chunk = 91;
	var handler = new RequestHandler();
	this.timeout(30000);
	handler.init(onHandlerReady, onData,onEnd, source, appToken,resource,chunk,marshall,undefined,undefined,start,end);

	function onHandlerReady() {
		handler.requestData();
	}

	function onData(data) {
		for(var i = 0; i<data.length; i++) {
			var myCrime = data[i];
			var date = new Date(myCrime.getDate());
			var dateNumeric = +date;
			var gmt = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
			unit.should((+gmt) >= new Date(start) && (+gmt) <= new Date(end)).be.ok;
		}
		handler.requestData();
	}

	function onEnd() {
		done();
	}
}

function testCrimesAreFetchedInAscendingOrder(done) {
	var end = '2013/01/03';
	var start = undefined;
	var chunk = 91;
	var handler = new RequestHandler();
	this.timeout(30000);
	handler.init(onHandlerReady, onData,onEnd, source, appToken,resource,chunk,marshall,undefined,undefined,start,end);

	function onHandlerReady() {
		handler.requestData();
	}

	function onData(data) {
		var lastDate = 0;
		for(var i = 0; i<data.length; i++) {
			var myCrime = data[i];
			var date = new Date(myCrime.getDate());
			var dateNumeric = +date;
			var gmt = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
			unit.should((+gmt) >= new Date(lastDate)).be.ok;
			lastDate = gmt;
		}
		handler.requestData();
	}

	function onEnd() {
		done();
	}
}

function testCrimesAreFetchedAfterLastPageProcessed(done) {
	var end = '2013/01/03';
	var start = undefined;
	var chunk = 91;
	var handler = new RequestHandler();
	this.timeout(30000);
	handler.init(onHandlerReady, onData,onEnd, source, appToken,resource,chunk,marshall,1,undefined,start,end);

	function onHandlerReady() {
		handler.requestData();
	}

	function onData(data) {
		var lastDate = 0;
		for(var i = 0; i<data.length; i++) {
			unit.value(data[i].getPage()).isGreaterThan(1);
		}
		handler.requestData();
	}

	function onEnd() {
		done();
	}
}

function testCrimesAreFetchedAfterLastPageProcessedAfterLastCrimeProcessed(done) {
	var end = '2013/01/03';
	var start = undefined;
	var chunk = 91;
	var handler = new RequestHandler();
	this.timeout(30000);
	handler.init(onHandlerReady, onData,onEnd, source, appToken,resource,chunk,marshall,1,2,start,end);

	function onHandlerReady() {
		handler.requestData();
	}

	function onData(data) {
		var lastDate = 0;
		for(var i = 0; i<data.length; i++) {
			unit.value(data[i].getPage()).isGreaterThan(1);
			unit.value(data[i].getOffset()).isGreaterThan(2);
		}
		done();
	}

	function onEnd() {
		done();
	}
}


suite('RequestHandler', function() {
  test('Signals end for not data available.', testSignalEndForNoData);
  test('Signals end for data but all processed.', testSignalEndForDataButAllProcessed);
  test('Signals end for after all data fetched.', testSignalEndForNormalOperation);
  test('Retrieves data of correct chunk size.', testRightChunkSize);
  test('Fetches crimes after date.', testThatAllCrimesFetchedAreAfterStart);
  test('Fetches crimes before date.', testThatAllCrimesFetchedAreBeforeEnd);
  test('Fetches crimes between dates.', testThatAllCrimesFetchedAreWithinWindow);
  test('Crimes fetched in ascending order.', testCrimesAreFetchedInAscendingOrder);
  test('Start fetching crime after last page processed.', testCrimesAreFetchedAfterLastPageProcessed);
  test('Start fetching crime after last page processed, ignoring last crime processed.', testCrimesAreFetchedAfterLastPageProcessedAfterLastCrimeProcessed);
});