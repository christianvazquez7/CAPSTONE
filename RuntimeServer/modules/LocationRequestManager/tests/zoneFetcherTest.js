
var expect = require('chai').expect;
var ZoneFetcher = require('../zoneFetcher.js');

var fetcherTest = new ZoneFetcher();
var location = 
{
	/*longitude: -67.297,
	latitude: 18.0025*/
	longitude: -66.164,
	latitude: 18.408
};
var numRings = 1;

//Node testing
/*
fetcherTest.fetchByLocation(location, numRings, function(result){
        zones = result;
        console.log(zones[1].loc.coordinates[0][0][0]);
});
*/


//TODO: Object with possible locations (NBound, WBound, NECorners...);
/*---------------------------------------------------------------------------------*/
/* Zone fetcher Mocha test */

describe('Zone Fetcher', function() {
  describe('#fetchByLocation(location, numRings, zonesCallback)', function () {
  	var zones = [];
    it('should connect succesfully to database' , function () {
    	fetcherTest.fetchByLocation(location, numRings, function(result){
			   done();					
		  });	
    });    
    it('should fetch correct number of zones from location: [' + location.latitude + ', ' + location.longitude + ']' , function () {
    	fetcherTest.fetchByLocation(location, numRings, function(result){
        zones = result;
        expect(zones).to.be.an('array');
        expect(zones).to.have.length(9);
      });
    });
    it('should sort the zones correctly' , function () {
      fetcherTest.fetchByLocation(location, numRings, function(result){
        zones = result;
        expect(zones[0].loc.coordinates[0][0][0]).to.be.lessThan(zones[1].loc.coordinates[0][0][0]);
        expect(zones[1].loc.coordinates[0][0][0]).to.be.lessThan(zones[2].loc.coordinates[0][0][0]);
        expect(zones[2].loc.coordinates[0][0][1]).to.be.greaterThan(zones[3].loc.coordinates[0][0][1]);

        expect(zones[3].loc.coordinates[0][0][0]).to.be.equal(zones[0].loc.coordinates[0][0][0]);

        expect(zones[3].loc.coordinates[0][0][0]).to.be.lessThan(zones[4].loc.coordinates[0][0][0]);
        expect(zones[4].loc.coordinates[0][0][0]).to.be.lessThan(zones[5].loc.coordinates[0][0][0]);
        expect(zones[5].loc.coordinates[0][0][1]).to.be.greaterThan(zones[6].loc.coordinates[0][0][1]);

        expect(zones[6].loc.coordinates[0][0][0]).to.be.equal(zones[3].loc.coordinates[0][0][0]);

        expect(zones[6].loc.coordinates[0][0][0]).to.be.lessThan(zones[7].loc.coordinates[0][0][0]);
        expect(zones[7].loc.coordinates[0][0][0]).to.be.lessThan(zones[8].loc.coordinates[0][0][0]);
      });
    });
  });
});
