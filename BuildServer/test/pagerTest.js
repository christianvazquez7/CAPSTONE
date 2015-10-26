var Socrata = require('node-socrata');
var unit = require('unit.js');
var RequestBuilder = require('../modules/DataProvider/requestBuilder.js');
var MarshallBuilder = require('../modules/DataProvider/marshallBuilder.js');
var Pager = require('../modules/DataProvider/pager.js');
var marshallBuilder = new MarshallBuilder();
var marshall = marshallBuilder.date('fecha').time('hora').lat('point_x').lon('point_y').type('delitos_code').id('delito').build();
var builder = new RequestBuilder('http://data.pr.gov/','mxH22n8js0toWFnxPSEUDzVKi','3fy3-2bc5',marshall);

function testPagerWithNoData() {
	var testPager = new Pager();
	unit.value(testPager.getPages()).isEqualTo(0);
}

function testPagerHasNextWithNoData() {
	var testPager = new Pager();
	unit.value(testPager.hasNext()).isEqualTo(false);
}

function testSetPagerPage() {
	var testPager = new Pager();
	testPager.setLastPage(10);
	unit.value(testPager.getCurrentPage()).isEqualTo(10);
}

function testPagerInitWithNoData(done) {
	var request = builder.start('2017/02/22').end('2018/03/22').limit(1000).increasing(true).build();
	var testPager = new Pager();
	this.timeout(10000);
	testPager.init(request,function() {
			unit.value(testPager.getPages()).isEqualTo(0);
			done();
	});
}

function testPagerInitWithOnePage(done) {
	var request = builder.start("2015/03/22").limit(1000).increasing(true).build();
	var testPager = new Pager();
	this.timeout(10000);
	testPager.init(request,function() {
			unit.value(testPager.getPages()).isEqualTo(1);
			done();
	});
}

function testPagerReset(done) {
	var request = builder.start("2015/03/22").limit(1000).increasing(true).build();
	var testPager = new Pager();
	this.timeout(10000);
	testPager.init(request,function() {
			testPager.reset();
			unit.value(testPager.getCurrentPage()).isEqualTo(0);
			unit.value(testPager.getPages()).isEqualTo(0);
			done();
	});
}

function testPagerReadPages(done) {
	var request = builder.start("2015/03/22").limit(1000).increasing(true).build();
	var testPager = new Pager();
	this.timeout(10000);
	testPager.init(request,function() {
			unit.value(testPager.hasNext()).isEqualTo(true);
			unit.value(testPager.nextPage()).isEqualTo(0);
			unit.value(testPager.hasNext()).isEqualTo(false);
			done();
	});
}

function testPagerReadFull(done) {
	var request = builder.start("2015/03/22").limit(1).increasing(true).build();
	var testPager = new Pager();
	this.timeout(10000);
	testPager.init(request,function() {

			unit.value(testPager.getPages).isEqualTo(118);
			unit.value(testPager.hasNext()).isEqualTo(true);
			for (var i = 0 ; i<117 ; i++) {
				unit.value(testPager.nextPage()).isEqualTo(i);
			}
			unit.value(testPager.hasNext()).isEqualTo(true);
			unit.value(testPager.nextPage()).isEqualTo(117);
			unit.value(testPager.hasNext()).isEqualTo(false);
			done();
	});
}

suite('Pager', function() {
  test('Un-initialized pager should has zero pages.', testPagerWithNoData);
  test('Setting last page. Should return last page set.', testSetPagerPage);
  test('Initializing pager with zero results. Number of pages should be zero.', testPagerInitWithNoData);
  test('Initializing pager with one page of results (118 entries) . Number of pages should be one.', testPagerInitWithOnePage);
  test('Testing reset pager. # pages and current page should both be zero.', testPagerReset);
  test('Read pages (1 page only). Testing has next.', testPagerReadPages);
  test('Read all pages (118 pages).', testPagerReadPages);
});
