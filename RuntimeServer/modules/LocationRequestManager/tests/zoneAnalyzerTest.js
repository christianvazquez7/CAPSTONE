var expect = require('chai').expect;
var turf = require('turf');
var ZoneAnalyzer = require('../zoneAnalyzer.js');
var ZoneFetcher = require('../zoneFetcher.js');


/*----------------------------------------------------------------------------------------------------------/
 *					This test is dependent on the zone Fetcher module, therefore that module		  		/
 *					should be tested and should pass all it's tests before running this test 		  		/																									  /
 *---------------------------------------------------------------------------------------------------------*/
var zoneSize = 200;
var testedFetcher = new ZoneFetcher();
var location = 
{
	longitude: -66.164,
	latitude: 18.408
};
var numRings = 1;
var testedFetcher = new ZoneFetcher();


var currentLocationGeoJSON = turf.point([location.longitude, location.latitude]);
var speed = 1.78;

var analyzer = new ZoneAnalyzer();

/*-----------------------Test the zone analyzer with grid generated----------------------------------*/

/*
var mTimeForNextRequest = analyzer.calculateTimeToHRZone(speed,currentLocationGeoJSON,geoZones);
console.log("----------------------------------------------------------");
console.log("Time for next request = " + mTimeForNextRequest);

analyzer.getCurrentZone(currentLocationGeoJSON,geoZones, function (currentZone){
	var mCurrentGeoZone = currentZone;
	console.log("----------------------------------------------------------");
	console.log("Current Zone: ");
	console.log(mCurrentGeoZone);
	console.log("----------------------------------------------------------");
});
*/
//TODO: Boundary cases
describe('Zone Analyzer', function() {
	describe('#calculateTimeToHRZone(speed,locationGeoJSON, zonesToAnalyze)', function () {
    	it('should calculate time to reach closest higher risk zone' , function () {
    		testedFetcher.fetchByLocation(location, numRings, function(result){
			   var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON, result);
			   expect(time).to.be.greaterThan(0);
			});	
    	});    
    	it("should calculate a distance shorter than the zone's assigned dimensions", function () {
    		testedFetcher.fetchByLocation(location, numRings, function(result){
			   var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON, result);
			   //TODO : Calculate hipotesnua
			   expect(time*speed).not.to.be.greaterThan(200);
			});	
    	});
    });
    describe('#getCurrentZone(locationGeoJSON, zonesToAnalyze, callback)', function () {
    	it('should find the current zone given a location' , function () {
			testedFetcher.fetchByLocation(location, 0, function(curZone){
				testedFetcher.fetchByLocation(location, numRings, function(result){
			   		analyzer.getCurrentZone(currentLocationGeoJSON, result, function(currentZone){
			   			expect(currentZone).to.be(curZone);
					});
				});	
  	    	});
		}); 
    });
});