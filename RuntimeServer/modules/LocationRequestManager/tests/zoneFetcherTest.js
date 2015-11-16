
var expect = require('chai').expect;
var ZoneFetcher = require('../zoneFetcher.js');

var fetcherTest = new ZoneFetcher();
var location = 
{
  NWCorner : { 
      longitude: -67.30,
      latitude: 18.537
  },
	WBound : { 
      longitude: -67.30,
      latitude: 18.408
  },
  SWCorner : { 
      longitude: -67.30,
      latitude: 17.919
  },
  NBound : { 
      longitude: -66,
      latitude: 18.537
  },
	Center : {
    longitude: -66.164,
	   latitude: 18.408
  },
  SBound : { 
      longitude: -66,
      latitude: 17.919
  },
  NECorner : { 
      longitude: -65.177,
      latitude: 18.537
  },
  EBound : { 
      longitude: -65.177,
      latitude: 18.2
  },
  SECorner : { 
      longitude: -65.177,
      latitude: 17.919
  }
};


var numRings = 1;
var testZoneID = 5;
//Node test
/*
fetcherTest.fetchByLocation(location.NWCorner, numRings, function(err, result){
        zones = result;
        for(var i = 0; i<zones.length; i++){
          zones[i].totalCrime = Math.floor((Math.random() * 10) + 1); 
        }
        console.log(zones);
});
*/

fetcherTest.fetchByID(5, function(err, result){
        if(err){
          console.error("Error: " + err);
        }
        zone = result;
        console.log(zone);
});

/*---------------------------------------------------------------------------------*/
/* Zone fetcher Mocha test */
/*
describe('Zone Fetcher', function() {
  this.timeout(20000);
  
  describe('#fetchByLocation(location, numRings, zonesCallback)', function () {
  	it('should connect succesfully to database' , function (done) {
           fetcherTest.fetchByLocation(location.Center, numRings, function(err, result){
           expect(err).to.be.null;
           expect(result).to.exist;
           done();          
        }); 
      });    

    describe('Center location (Non-boundary)', function () {
      var zones = [];      
      it('should fetch correct number of zones' , function (done) {
      	fetcherTest.fetchByLocation(location.Center, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;
          
          expect(zones).to.be.an('array');
          expect(zones).to.have.length(9);
          done();
        });
      });
      it('should sort the zones correctly' , function (done) {
        fetcherTest.fetchByLocation(location.Center, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

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

          done();
        });
      });
    });
    
    describe('NW corner location ', function () {
      var zones = [];      
      it('should fetch correct number of zones' , function (done) {
        fetcherTest.fetchByLocation(location.NWCorner, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;
          
          expect(zones).to.be.an('array');
          expect(zones).to.have.length(4);
          done();
        });
      });
      it('should sort the zones correctly' , function (done) {
        fetcherTest.fetchByLocation(location.NWCorner, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;

          expect(zones[0].loc.coordinates[0][0][0]).to.be.lessThan(zones[1].loc.coordinates[0][0][0]);
          expect(zones[1].loc.coordinates[0][0][1]).to.be.greaterThan(zones[2].loc.coordinates[0][0][1]);

          expect(zones[2].loc.coordinates[0][0][0]).to.be.lessThan(zones[3].loc.coordinates[0][0][0]);
          expect(zones[3].loc.coordinates[0][0][1]).to.be.lessThan(zones[1].loc.coordinates[0][0][1]);
          
          done();
        });
      });
    });

    describe('NE corner location ', function () {
      var zones = [];      
      it('should fetch correct number of zones' , function (done) {
        fetcherTest.fetchByLocation(location.NECorner, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;
          
          expect(zones).to.be.an('array');
          expect(zones).to.have.length(4);
          done();
        });
      });
      it('should sort the zones correctly' , function (done) {
        fetcherTest.fetchByLocation(location.NECorner, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;

          expect(zones[0].loc.coordinates[0][0][0]).to.be.lessThan(zones[1].loc.coordinates[0][0][0]);
          expect(zones[1].loc.coordinates[0][0][1]).to.be.greaterThan(zones[2].loc.coordinates[0][0][1]);

          expect(zones[2].loc.coordinates[0][0][0]).to.be.lessThan(zones[3].loc.coordinates[0][0][0]);
          expect(zones[3].loc.coordinates[0][0][1]).to.be.lessThan(zones[1].loc.coordinates[0][0][1]);
          
          done();
        });
      });
    });

    describe('SW corner location ', function () {
      var zones = [];      
      it('should fetch correct number of zones' , function (done) {
        fetcherTest.fetchByLocation(location.SWCorner, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;
          
          expect(zones).to.be.an('array');
          expect(zones).to.have.length(4);
          done();
        });
      });
      it('should sort the zones correctly' , function (done) {
        fetcherTest.fetchByLocation(location.SWCorner, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;

          expect(zones[0].loc.coordinates[0][0][0]).to.be.lessThan(zones[1].loc.coordinates[0][0][0]);
          expect(zones[1].loc.coordinates[0][0][1]).to.be.greaterThan(zones[2].loc.coordinates[0][0][1]);

          expect(zones[2].loc.coordinates[0][0][0]).to.be.lessThan(zones[3].loc.coordinates[0][0][0]);
          expect(zones[3].loc.coordinates[0][0][1]).to.be.lessThan(zones[1].loc.coordinates[0][0][1]);
          
          done();
        });
      });
    });

    describe('SE corner location ', function () {
      var zones = [];      
      it('should fetch correct number of zones' , function (done) {
        fetcherTest.fetchByLocation(location.SECorner, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;
          
          expect(zones).to.be.an('array');
          expect(zones).to.have.length(4);
          done();
        });
      });
      it('should sort the zones correctly' , function (done) {
        fetcherTest.fetchByLocation(location.SECorner, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;

          expect(zones[0].loc.coordinates[0][0][0]).to.be.lessThan(zones[1].loc.coordinates[0][0][0]);
          expect(zones[1].loc.coordinates[0][0][1]).to.be.greaterThan(zones[2].loc.coordinates[0][0][1]);

          expect(zones[2].loc.coordinates[0][0][0]).to.be.lessThan(zones[3].loc.coordinates[0][0][0]);
          expect(zones[3].loc.coordinates[0][0][1]).to.be.lessThan(zones[1].loc.coordinates[0][0][1]);
          
          done();
        });
      });
    });

    describe('N bound location ', function () {
      var zones = [];      
      it('should fetch correct number of zones' , function (done) {
        fetcherTest.fetchByLocation(location.NBound, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;
          
          expect(zones).to.be.an('array');
          expect(zones).to.have.length(6);
          done();
        });
      });
      it('should sort the zones correctly' , function (done) {
        fetcherTest.fetchByLocation(location.NBound, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;

          expect(zones[0].loc.coordinates[0][0][0]).to.be.lessThan(zones[1].loc.coordinates[0][0][0]);
          expect(zones[1].loc.coordinates[0][0][0]).to.be.lessThan(zones[2].loc.coordinates[0][0][0]);
          
          expect(zones[2].loc.coordinates[0][0][1]).to.be.greaterThan(zones[3].loc.coordinates[0][0][1]);

          expect(zones[3].loc.coordinates[0][0][0]).to.be.lessThan(zones[4].loc.coordinates[0][0][0]);
          expect(zones[4].loc.coordinates[0][0][0]).to.be.lessThan(zones[5].loc.coordinates[0][0][0]);

          expect(zones[5].loc.coordinates[0][0][1]).to.be.lessThan(zones[0].loc.coordinates[0][0][1]);
          
          done();
        });
      });
    });
    
    describe('S bound location ', function () {
      var zones = [];      
      it('should fetch correct number of zones' , function (done) {
        fetcherTest.fetchByLocation(location.SBound, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;
          
          expect(zones).to.be.an('array');
          expect(zones).to.have.length(6);
          done();
        });
      });
      it('should sort the zones correctly' , function (done) {
        fetcherTest.fetchByLocation(location.SBound, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;

          expect(zones[0].loc.coordinates[0][0][0]).to.be.lessThan(zones[1].loc.coordinates[0][0][0]);
          expect(zones[1].loc.coordinates[0][0][0]).to.be.lessThan(zones[2].loc.coordinates[0][0][0]);
          
          expect(zones[2].loc.coordinates[0][0][1]).to.be.greaterThan(zones[3].loc.coordinates[0][0][1]);

          expect(zones[3].loc.coordinates[0][0][0]).to.be.lessThan(zones[4].loc.coordinates[0][0][0]);
          expect(zones[4].loc.coordinates[0][0][0]).to.be.lessThan(zones[5].loc.coordinates[0][0][0]);

          expect(zones[5].loc.coordinates[0][0][1]).to.be.lessThan(zones[0].loc.coordinates[0][0][1]);
          
          done();
        });
      });
    });
    
    describe('E bound location ', function () {
      var zones = [];      
      it('should fetch correct number of zones' , function (done) {
        fetcherTest.fetchByLocation(location.EBound, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;
          
          expect(zones).to.be.an('array');
          expect(zones).to.have.length(6);
          done();
        });
      });
      it('should sort the zones correctly' , function (done) {
        fetcherTest.fetchByLocation(location.EBound, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;

          expect(zones[0].loc.coordinates[0][0][0]).to.be.lessThan(zones[1].loc.coordinates[0][0][0]);
          
          expect(zones[1].loc.coordinates[0][0][1]).to.be.greaterThan(zones[2].loc.coordinates[0][0][1]);
          
          expect(zones[2].loc.coordinates[0][0][0]).to.be.lessThan(zones[3].loc.coordinates[0][0][0]);
          
          expect(zones[3].loc.coordinates[0][0][1]).to.be.greaterThan(zones[4].loc.coordinates[0][0][1]);

          expect(zones[4].loc.coordinates[0][0][0]).to.be.lessThan(zones[5].loc.coordinates[0][0][0]);

          expect(zones[5].loc.coordinates[0][0][1]).to.be.lessThan(zones[0].loc.coordinates[0][0][1]);
          
          done();
        });
      });
    });
  
    describe('W bound location ', function () {
      var zones = [];      
      it('should fetch correct number of zones' , function (done) {
        fetcherTest.fetchByLocation(location.WBound, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;
          
          expect(zones).to.be.an('array');
          expect(zones).to.have.length(6);
          done();
        });
      });
      it('should sort the zones correctly' , function (done) {
        fetcherTest.fetchByLocation(location.WBound, numRings, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;

          expect(zones[0].loc.coordinates[0][0][0]).to.be.lessThan(zones[1].loc.coordinates[0][0][0]);
          
          expect(zones[1].loc.coordinates[0][0][1]).to.be.greaterThan(zones[2].loc.coordinates[0][0][1]);
          
          expect(zones[2].loc.coordinates[0][0][0]).to.be.lessThan(zones[3].loc.coordinates[0][0][0]);
          
          expect(zones[3].loc.coordinates[0][0][1]).to.be.greaterThan(zones[4].loc.coordinates[0][0][1]);

          expect(zones[4].loc.coordinates[0][0][0]).to.be.lessThan(zones[5].loc.coordinates[0][0][0]);

          expect(zones[5].loc.coordinates[0][0][1]).to.be.lessThan(zones[0].loc.coordinates[0][0][1]);
          
          done();
        });
      });
    });

    describe('Different number of rings ', function () {
      var zones = [];      
      it('should fetch only one zone if 0 number of rings are requested' , function (done) {
        fetcherTest.fetchByLocation(location.Center, 0, function(err, result){
          expect(err).to.be.null;
          expect(result).to.exist;

          zones = result;
          
          expect(zones).to.be.an('array');
          expect(zones).to.have.length(1);
          done();
        });
      });
      it('should throw an error if more than 1 ring is requested' , function (done) {
        fetcherTest.fetchByLocation(location.Center, 2, function(err, result){
          expect(err).to.be.an('error');
          expect(result).to.be.undefined;
          done();
        });
      });
    }); 
  });
});
*/