var LocRequestHandler = require('../locRequestHandler.js');
var ZoneFetcher = require('../ZoneFetcher.js');
var expect = require('chai').expect;
/*------------------Encoding message to test---------------------------------------------------------*/
var ProtoBuf = require('protobufjs');

var testedFetcher = new ZoneFetcher();	
var reqHandler = new LocRequestHandler();

process.chdir(__dirname);
var builder = ProtoBuf.loadProtoFile("../../../resources/kya.proto"),
	KYA = builder.build("KYA"),
	CheckIn = KYA.CheckIn,
	CheckInResponse = KYA.CheckInResponse,
	GeoPoint = KYA.GeoPoint,
	GeoZone = KYA.GeoZone;

var tUserID = 'AFD43245DACE';
var location = 
{
	longitude: -66.164,
	latitude: 18.408
};

var LocObj = new GeoPoint('', location.latitude, location.longitude);
var speed = 1.78;
var negDelta = true;
var checkIn = new CheckIn(tUserID,LocObj,speed,negDelta);

var checkInBuffer = checkIn.encode();
var reqMessage = checkInBuffer.toBuffer();

/*------------------------------------------------------------------------------------------*/
var currZoneFromFetcher;
testedFetcher.fetchByLocation(location, 0, function (err, curZone){
	curZone = curZone[0];
	var geoPointsAr = [];
	for(var i = 0 ; i < curZone.loc.coordinates[0].length - 1; i ++){
		geoPointsAr.push(new GeoPoint('', curZone.loc.coordinates[0][i][1], curZone.loc.coordinates[0][i][0]));
	}
	currZoneFromFetcher = new GeoZone(curZone.zone_id, curZone.level, curZone.totalCrime, geoPointsAr); 
});

/*-----------------------------------------------------------------------------------------*/

var decodedResponse;
describe('Location Request Manager', function() {
	this.timeout(20000);
	describe('#handleRequest(checkInBuffer,callback)', function () {
	    it('should call the appropiate functions and respond through a callback with an encoded response' , function (done) {
	   		reqHandler.handleRequest(reqMessage, function (err, responseBuffer){
	   			expect(err).to.be.null;
				decodedResponse = CheckInResponse.decode(responseBuffer);
				expect(decodedResponse.currentZone).to.eql(currZoneFromFetcher);
				done();
				console.log('\n--------------------------------------------------------------------------------');
				console.log("Expected zone: ");
				console.log(currZoneFromFetcher);
				console.log('--------------------------------------------------------------------------------');
				console.log("Obtained zone: ");
				console.log(decodedResponse.currentZone);
				console.log('--------------------------------------------------------------------------------');
				console.log('\n--------------------------------------------------------------------------------');
				console.log("Expected time: " + 18.262495721849564)
				console.log("Obtained time: " + decodedResponse.nextRequestTimeInSeconds);
				console.log('--------------------------------------------------------------------------------');
			});
	    }); 	    
	});
});


/*
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

    // New risk zone level classification in which the user is currently in.
    required GeoZone currentZone = 1;

    // Next suggested time delta for check in.
    required double nextRequestTimeInSeconds = 2;

    // True if feedback should be requested from user. False otherwise.
    required bool requestFeedback = 3;
}  

*/