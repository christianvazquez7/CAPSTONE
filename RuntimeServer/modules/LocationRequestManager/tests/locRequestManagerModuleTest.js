var LocRequestHandler = require('../locRequestHandler.js');

/*------------------Encoding message to test---------------------------------------------------------*/
var ProtoBuf = require('protobufjs');
	
var builder = ProtoBuf.loadProtoFile('C:/Users/LuisR/Documents/GitHub/CAPSTONE/RuntimeServer/resources/kya.proto'),
	KYA = builder.build("KYA"),
	CheckIn = KYA.CheckIn,
	CheckInResponse = KYA.CheckInResponse,
	GeoPoint = KYA.GeoPoint;

var tUserID = 'AFD43245DACE';
var location = 
{
	longitude: -67.297,
	latitude: 18.0025
};

var LocObj = new GeoPoint(tUserID, location.latitude, location.longitude);
var speed = 1.7;
var checkIn = new CheckIn(tUserID,LocObj,speed);

var checkInBuffer = checkIn.encode();
var reqMessage = checkInBuffer.toBuffer();

console.log('------------------------------------------------------------------------');
console.log('Check in message: ' );
console.log(checkIn);

var reqHandler = new LocRequestHandler();

reqHandler.handleRequest(reqMessage, function(responseBuffer){
	console.log('------------------------------------------------------------------------');
	console.log('Buffer response: ' );
	console.log(responseBuffer);
	console.log('------------------------------------------------------------------------');
	var decodedResponse = CheckInResponse.decode(responseBuffer);
	console.log('Decoded response: ' );
	console.log(decodedResponse);
	console.log('------------------------------------------------------------------------');
});
