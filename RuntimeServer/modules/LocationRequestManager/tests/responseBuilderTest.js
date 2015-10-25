
var ResponseBuilder = require('../responseBuilder.js');

var ProtoBuf = require("../../../node_modules/protobufjs");

//Check path 
var builder = ProtoBuf.loadProtoFile('C:/Users/LuisR/Documents/GitHub/CAPSTONE/RuntimeServer/resources/kya.proto');

var KYA = builder.build("KYA");

var CheckInResponse = KYA.CheckInResponse;
var GeoZone = KYA.GeoZone;

var currentZone = {
	zoneID: 10,
	level: 6,
	crimeRate: 190,
	loc: 
	{	type: 'Feature',
		geometry: 
		{	type:'Polygon',
			coordinates:[[[-67.3,18],[-67.3,18.00179807875453],[-67.29810938811335,18.00179807875453],[-67.29810938811335,18],[-67.3,18]]]						
		}
	}
};

var nextRequestTime = 9;
var surveyFlag = true;

var resBuilder = new ResponseBuilder();
console.log('--------------------------------------------------------------');
console.log("Zone: " + JSON.stringify(currentZone));
console.log('--------------------------------------------------------------');
var encodedMsg = resBuilder.build(currentZone, nextRequestTime, surveyFlag);

console.log("Encoded message: " + encodedMsg);
console.log('--------------------------------------------------------------');
var checkinResponseDecoded = CheckInResponse.decode(encodedMsg);

console.log("Decoded message: " + checkinResponseDecoded);
console.log('--------------------------------------------------------------');
console.log("Decoded message str: " + JSON.stringify(checkinResponseDecoded));