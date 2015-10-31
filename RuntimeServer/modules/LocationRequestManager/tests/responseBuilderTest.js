var ResponseBuilder = require('../responseBuilder.js');

var ProtoBuf = require("../../../node_modules/protobufjs");
var assert = require('assert');
//TODO: Check path 
var builder = ProtoBuf.loadProtoFile('C:/Users/LuisR/Documents/GitHub/CAPSTONE/RuntimeServer/resources/kya.proto');

var KYA = builder.build("KYA");
var CheckInResponse = KYA.CheckInResponse,
	GeoZone = KYA.GeoZone,
	GeoPoint = KYA.GeoPoint;

//Mock data
var currentZone = {
	_id: 10,
	level: 6,
	crimeRate: 190,
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

var currentZoneMessage = new GeoZone("10", 6, 190, mockGeoPointsAr);
var response = new CheckInResponse(currentZoneMessage,nextRequestTime,surveyFlag);
var responseMessage = response.encode().toBuffer();
/*----------------------------------------------------------------------------------------------------------------------------------------*/
//Module test
var resBuilder = new ResponseBuilder();

describe('Response Builder', function() {
  describe('#build()', function () {
    it('should return encoded message', function () {
		//assert.equal(CheckInResponse.decode(responseMessage), CheckInResponse.decode(resBuilder.build(currentZone, nextRequestTime, surveyFlag)));
		assert.deepEqual(responseMessage, resBuilder.build(currentZone, nextRequestTime, surveyFlag));
    });
  });
});