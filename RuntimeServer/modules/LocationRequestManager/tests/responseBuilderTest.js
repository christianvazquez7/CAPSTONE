var ResponseBuilder = require('../responseBuilder.js');

var ProtoBuf = require('protobufjs');
var expect = require('chai').expect;

//TODO: Check path 
process.chdir(__dirname);
var builder = ProtoBuf.loadProtoFile("../../../resources/kya.proto");

var KYA = builder.build("KYA");
var CheckInResponse = KYA.CheckInResponse,
	GeoZone = KYA.GeoZone,
	GeoPoint = KYA.GeoPoint;

//Mock data
var currentZone = {
	zone_id: 10,
	level: 6,	
	totalCrime: '190',
	loc: 
	{	
		type:'Polygon',
		coordinates:[[[-67.3,18],[-67.3,18.00179807875453],[-67.29810938811335,18.00179807875453],[-67.29810938811335,18],[-67.3,18]]]								
	}
};

var nextRequestTime = 9.5;
var surveyFlag = true;

var mockGeoPointsAr = 
[
	new GeoPoint('', 18, -67.3),
	new GeoPoint('', 18.00179807875453, -67.3),
	new GeoPoint('', 18.00179807875453, -67.29810938811335),
	new GeoPoint('', 18, -67.29810938811335)
];

var currentZoneMessage = new GeoZone(10, 6, '190', mockGeoPointsAr);
var response = new CheckInResponse(currentZoneMessage,nextRequestTime,surveyFlag);
var responseMessage = response.encode().toBuffer();

var resBuilder = new ResponseBuilder();

/*----------------------------------------------------------------------------------------------------------------------------------------*/
//Module test

describe('Response Builder', function() {
  describe('#build()', function () {
    it('should return encoded message', function () {
		expect(responseMessage).to.eql(resBuilder.build(currentZone, nextRequestTime, surveyFlag));
    });
  });
});