var unit = require('unit.js');
var RequestBuilder = require('../modules/DataProvider/requestBuilder.js');
var MarshallBuilder = require('../modules/DataProvider/marshallBuilder.js');
var marshallBuilder = new MarshallBuilder();
var marshall = marshallBuilder.date('fecha').time('hora').lat('point_x').lon('point_y').type('delitos_code').id('delito').build();

function testEmptyRequest() {
	var builder = new RequestBuilder('http://data.pr.gov/','mxH22n8js0toWFnxPSEUDzVKi','3fy3-2bc5',marshall);
	var request = builder.build();
	unit.value(request.hasLimit()).isEqualTo(false);
	unit.value(request.hasWhere()).isEqualTo(false);
	unit.value(request.hasOffset()).isEqualTo(false);
	unit.value(request.hasOrder()).isEqualTo(false);
	unit.value(request.getOrder()).isEqualTo(undefined);
	unit.value(request.getLimit()).isEqualTo(undefined);
	unit.value(request.getWhere()).isEqualTo(undefined);
	unit.value(request.getOffset()).isEqualTo(undefined);
}

function testPartialRequest() {
	var builder = new RequestBuilder('http://data.pr.gov/','mxH22n8js0toWFnxPSEUDzVKi','3fy3-2bc5',marshall);
	var request = builder.offset(1).increasing(false).build();
	unit.value(request.hasLimit()).isEqualTo(false);
	unit.value(request.hasWhere()).isEqualTo(false);
	unit.value(request.hasOffset()).isEqualTo(true);
	unit.value(request.hasOrder()).isEqualTo(true);
	unit.value(request.getOrder()).isEqualTo(marshall.getDateLabel() + " DESC");
	unit.value(request.getLimit()).isEqualTo(undefined);
	unit.value(request.getWhere()).isEqualTo(undefined);
	unit.value(request.getOffset()).isEqualTo(1);
}

function testFullRequestWithUpperBound() {
	var builder = new RequestBuilder('http://data.pr.gov/','mxH22n8js0toWFnxPSEUDzVKi','3fy3-2bc5',marshall);
	var request = builder.offset(1).increasing(true).limit(2).end('2014/03/02').build();

	unit.value(request.hasLimit()).isEqualTo(true);
	unit.value(request.hasWhere()).isEqualTo(true);
	unit.value(request.hasOffset()).isEqualTo(true);
	unit.value(request.hasOrder()).isEqualTo(true);

	unit.value(request.getOrder()).isEqualTo(marshall.getDateLabel() + " ASC");
	unit.value(request.getLimit()).isEqualTo(2);
	unit.value(request.getWhere()).isEqualTo(marshall.getDateLabel() + " <= '2014/03/02'");
	unit.value(request.getOffset()).isEqualTo(1);
}

function testFullRequestWithLowerBound() {
	var builder = new RequestBuilder('http://data.pr.gov/','mxH22n8js0toWFnxPSEUDzVKi','3fy3-2bc5',marshall);
	var request = builder.offset(100).increasing(true).limit(50).start('2014/03/02').build();

	unit.value(request.hasLimit()).isEqualTo(true);
	unit.value(request.hasWhere()).isEqualTo(true);
	unit.value(request.hasOffset()).isEqualTo(true);
	unit.value(request.hasOrder()).isEqualTo(true);

	unit.value(request.getOrder()).isEqualTo(marshall.getDateLabel() + " ASC");
	unit.value(request.getLimit()).isEqualTo(50);
	unit.value(request.getWhere()).isEqualTo(marshall.getDateLabel() + " >= '2014/03/02'");
	unit.value(request.getOffset()).isEqualTo(100);
}

function testFullRequestWindowBound() {
	var builder = new RequestBuilder('http://data.pr.gov/','mxH22n8js0toWFnxPSEUDzVKi','3fy3-2bc5',marshall);
	var request = builder.offset(100).increasing(true).limit(50).end('2015/03/02').start('2014/03/02').build();

	unit.value(request.hasLimit()).isEqualTo(true);
	unit.value(request.hasWhere()).isEqualTo(true);
	unit.value(request.hasOffset()).isEqualTo(true);
	unit.value(request.hasOrder()).isEqualTo(true);

	unit.value(request.getOrder()).isEqualTo(marshall.getDateLabel() + " ASC");
	unit.value(request.getLimit()).isEqualTo(50);
	unit.value(request.getWhere()).isEqualTo(marshall.getDateLabel() + " >= '2014/03/02' AND " + marshall.getDateLabel() + " <= '2015/03/02'");
	unit.value(request.getOffset()).isEqualTo(100);
}

function testRequestParameters() {
	var builder = new RequestBuilder('http://data.pr.gov/','mxH22n8js0toWFnxPSEUDzVKi','3fy3-2bc5',marshall);
	var request = builder.build();
	unit.value(request.getSource()).isEqualTo('http://data.pr.gov/');
	unit.value(request.getResource()).isEqualTo('3fy3-2bc5');
	unit.value(request.getToken()).isEqualTo('mxH22n8js0toWFnxPSEUDzVKi');
}

suite('RequestBuilder', function() {
  test('Test creation of request with no fields defined.', testEmptyRequest);
  test('Test creation of partial request.',testPartialRequest);
  test('Test creation of full request with upper time bound.',testFullRequestWithUpperBound);
  test('Test creation of full request with lower time bound.',testFullRequestWithLowerBound);
  test('Test creation of full request with a window time bound.',testFullRequestWindowBound);
  test('Test creation of request builder with parameters.',testRequestParameters);

});