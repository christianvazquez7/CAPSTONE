var LocRequestHandler = require('../locRequestHandler.js');
var ZoneFetcher = require('../ZoneFetcher.js');
var expect = require('chai').expect;
/*------------------Encoding message to test---------------------------------------------------------*/
var ProtoBuf = require('protobufjs');

var testedFetcher = new ZoneFetcher();	
var reqHandler = new LocRequestHandler();

process.chdir(__dirname);
var builder = ProtoBuf.loadProtoFile("../../../../proto/KYA.proto"),
	KYA = builder.build("com.nvbyte.kya"),
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
var negDelta = false;
var prevZoneID = 5;
var checkIn = new CheckIn(tUserID, LocObj, speed, negDelta, prevZoneID);
var checkInBuffer = checkIn.encode();
var reqMessage = checkInBuffer.toBuffer();
//console.log(CheckIn.decode(reqMessage));

/*-----------------------------------------------------------------------------------------*/

var decodedResponse;
describe('Location Request Manager', function() {
	this.timeout(20000);
	describe('#handleRequest(checkInBuffer,callback)', function () {
	    it('should call the appropiate functions and respond through a callback with an encoded response' , function (done) {
	   		reqHandler.handleRequest(reqMessage, function (err, responseBuffer){
	   			expect(err).to.be.null;
	   			expect(responseBuffer).to.exist;
				
				decodedResponse = CheckInResponse.decode(responseBuffer);

				var currZoneFromFetcher;
				
				testedFetcher.fetchByLocation(location, 0, function (err, curZone){
					curZone = curZone[0];
					
					var zoneCorners = [];
					for(var i = 0 ; i < curZone.loc.coordinates[0].length - 1; i ++){
						zoneCorners.push(new GeoPoint('', curZone.loc.coordinates[0][i][1], curZone.loc.coordinates[0][i][0]));
					}
					currZoneFromFetcher = new GeoZone(curZone.level, curZone.totalCrime, curZone.updatedOn, curZone.zone_id, zoneCorners); 
					expect(decodedResponse.currentZone).to.eql(currZoneFromFetcher);
					
					testedFetcher.fetchByID(prevZoneID, function(err, prevZone){
						curZone = curZone[0];	
						var zoneCorners1 = [];
						for(var i = 0 ; i < prevZone.loc.coordinates[0].length - 1; i ++){
							zoneCorners1.push(new GeoPoint('', prevZone.loc.coordinates[0][i][1], prevZone.loc.coordinates[0][i][0]));
						}
						prevZoneFromFetcher = new GeoZone(prevZone.level, prevZone.totalCrime, prevZone.updatedOn, prevZone.zone_id, zoneCorners1); 
					
						expect(decodedResponse.prevZone).to.eql(prevZoneFromFetcher);	
						done();
						console.log('\n--------------------------------------------------------------------------------');
						console.log("Expected current zone: ");
						console.log(currZoneFromFetcher);
						console.log('--------------------------------------------------------------------------------');
						console.log("Obtained current zone: ");
						console.log(decodedResponse.currentZone);
						console.log('--------------------------------------------------------------------------------');

						console.log('\n--------------------------------------------------------------------------------');
						console.log("Expected prev zone: ");
						console.log(prevZoneFromFetcher);
						console.log('--------------------------------------------------------------------------------');
						console.log("Obtained prev zone: ");
						console.log(decodedResponse.prevZone);
						console.log('--------------------------------------------------------------------------------');
						
						console.log('\n--------------------------------------------------------------------------------');
						console.log("Expected time: " + 18.262495721849564)
						console.log("Obtained time: " + decodedResponse.nextRequestTimeInSeconds);
						console.log('--------------------------------------------------------------------------------');
					});					
				});
			});
	    }); 	    
	});
});


