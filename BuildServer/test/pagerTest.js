var Socrata = require('node-socrata');
var RequestBuilder = require('../modules/DataProvider/requestBuilder.js');
var MarshallBuilder = require('../modules/DataProvider/marshallBuilder.js');
var Crime = require('../modules/DataProvider/crime.js');

var marshallBuilder = new MarshallBuilder();
var marshall = marshallBuilder.date('fecha').time('hora').lat('point_x').lon('point_y').type('delitos_code').id('delito').build();

var builder = new RequestBuilder('http://data.pr.gov/','mxH22n8js0toWFnxPSEUDzVKi','3fy3-2bc5',marshall);
var request = builder.start('2015/02/22').end('2015/03/22').limit(1000).increasing(true).build();



var config = {
	hostDomain: request.getSource(),
	resource: request.getResource(),
	XAppToken: request.getToken()
};

var soda = new Socrata(config);
console.log(request.getOrder());

var params = {
	$where: request.getWhere(),
	$limit: request.getLimit(),
	$offset: request.getOffset(),
	$order: request.getOrder()
};
var crimen = new Crime();
soda.get(params,function(err,response,data){
	var crimeList = Crime.fromList(data,marshall);
	for (var i = 0 ; i < crimeList.length ; i ++) {
			console.log('--------------crime record----------------');
			console.log('Latitude: ' + crimeList[i].getLongitude());
			console.log('Longitude: ' + crimeList[i].getLatitude());
			console.log('Type: ' + crimeList[i].getType());
			console.log('Date: ' + crimeList[i].getDate());
			console.log('Time: ' + crimeList[i].getTime());

	}
});

this.testPagerWithNoData = function() {

};

this.testPagerWithPerfectIntervalData = function(){

};

this.testPagerWithUUnevenData = function (){

};

this.testPagerReset = function() {

};

