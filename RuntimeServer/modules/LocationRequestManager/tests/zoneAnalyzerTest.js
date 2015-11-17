var expect = require('chai').expect;
var turf = require('turf');
var math = require('mathjs');
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
	NWCorner : { 
      	longitude: -67.299,
      	latitude: 18.536
  	},
  	WBound : { 
      	longitude: -67.299,
      	latitude: 18.408
  	},
  	SWCorner : { 
      	longitude: -67.299,
      	latitude: 17.919
  	},
  	NBound : { 
     	longitude: -66,
      	latitude: 18.536
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
      	longitude: -65.176,
      	latitude: 18.536
    },
    EBound : { 
      	longitude: -65.177,
      	latitude: 18.2
    },
    SECorner : { 
      	longitude: -65.176,
      	latitude: 17.919
    },
    Outside : {
    	longitude: -60,
    	latitude: 17
    }
};

var numRings = 1;

var currentLocationGeoJSON = {
	NWCorner : turf.point([location.NWCorner.longitude, location.NWCorner.latitude]),
	WBound : turf.point([location.WBound.longitude, location.WBound.latitude]),
	SWCorner: turf.point([location.SWCorner.longitude, location.SWCorner.latitude]),
	NBound : turf.point([location.NBound.longitude, location.NBound.latitude]),
	Center : turf.point([location.Center.longitude, location.Center.latitude]),
	SBound : turf.point([location.SBound.longitude, location.SBound.latitude]),
	NECorner : turf.point([location.NECorner.longitude, location.NECorner.latitude]),
	EBound : turf.point([location.EBound.longitude, location.EBound.latitude]),
	SECorner : turf.point([location.SECorner.longitude, location.SECorner.latitude]),
	Outside : turf.point([location.Outside.longitude, location.Outside.latitude])
}
var speed = 1.78;
var negDelta = false;
var analyzer = new ZoneAnalyzer();

console.log("Begin");
/*
//Node testing
testedFetcher.fetchByLocation(location.SECorner, numRings, function(err, zones){
        for(var i = 0; i<zones.length; i++){
          zones[i].level = i+1;
          console.log(JSON.stringify(zones[i].loc));
        }
        console.log(JSON.stringify(currentLocationGeoJSON.SECorner));       	
});
*/

/*-----------------------Test the zone analyzer with grid generated----------------------------------*/

//TODO: Boundary cases
describe('Zone Analyzer', function() {
	this.timeout(20000);
	describe('#calculateTimeToHRZone(speed,locationGeoJSON, zonesToAnalyze)', function () {
		describe('Center location (Non-boundary)', function () {
	    	it('should calculate time to reach closest higher risk zone' , function (done) {
	    		testedFetcher.fetchByLocation(location.Center, numRings, function (err, zones){
	    			var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.Center, zones, negDelta, function (error){	
				   		expect(error).to.be.null;
				   	});
				   	expect(time).to.be.greaterThan(0);
				   	console.log('\t Time to reach next zone: ' + time);
				   	console.log('\t Distance to next zone: ' + time*speed);
				   	done();
				});	
	    	});    
	    	it("should calculate a distance <= to the zones dimensions set", function (done) {
	    		testedFetcher.fetchByLocation(location.Center, numRings, function (err, zones){
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.Center, zones, negDelta, function (error){
				   		expect(error).to.be.null;	
				   	});
				   
				   	var	maxDist = math.eval('sqrt(2 * ' + zoneSize + ' ^ 2)'); // in Km
				   	expect(time*speed).not.to.be.greaterThan(maxDist);
				   	done();
				});	
	    	});
	    });

		describe('NW corner location ', function () {
	    	it('should calculate time to reach closest higher risk zone' , function (done) {
	    		testedFetcher.fetchByLocation(location.NWCorner, numRings, function (err, zones){
	    			for(var i = 0; i<zones.length; i++){
          				zones[i].level = i+1;
        			}
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.NWCorner, zones, negDelta, function (error){	
				   		expect(error).to.be.null;
				   	});
				   	expect(time).to.be.greaterThan(0);
				   	console.log('\t Time to reach next zone: ' + time);
				   	console.log('\t Distance to next zone: ' + time*speed);
				   	done();
				});	
	    	});    
	    	it("should calculate a distance <= to the zones dimensions set", function (done) {
	    		testedFetcher.fetchByLocation(location.NWCorner, numRings, function (err, zones){
				   	for(var i = 0; i<zones.length; i++){
          				zones[i].level = i+1;
        			}
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.NWCorner, zones, negDelta, function (error){
				   		expect(error).to.be.null;	
				   	});
				   
				   	var	maxDist = math.eval('sqrt(2 * ' + zoneSize + ' ^ 2)'); // in Km
				   	expect(time*speed).not.to.be.greaterThan(maxDist);
				   	done();
				});	
	    	});
	    });

		describe('NE corner location ', function () {
	    	it('should calculate time to reach closest higher risk zone' , function (done) {
	    		testedFetcher.fetchByLocation(location.NECorner, numRings, function (err, zones){
				   	for(var i = 0; i<zones.length; i++){
          				zones[i].level = i+1;
        			}
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.NECorner, zones, negDelta, function (error){	
				   		expect(error).to.be.null;
				   	});
				   	expect(time).to.be.greaterThan(0);
				   	console.log('\t Time to reach next zone: ' + time);
				   	console.log('\t Distance to next zone: ' + time*speed);
				   	done();
				});	
	    	});    
	    	it("should calculate a distance <= to the zones dimensions set", function (done) {
	    		testedFetcher.fetchByLocation(location.NECorner, numRings, function (err, zones){
				   	for(var i = 0; i<zones.length; i++){
          				zones[i].level = i+1;
        			}
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.NECorner, zones, negDelta, function (error){
				   		expect(error).to.be.null;	
				   	});
				   
				   	var	maxDist = math.eval('sqrt(2 * ' + zoneSize + ' ^ 2)'); // in Km
				   	expect(time*speed).not.to.be.greaterThan(maxDist);
				   	done();
				});	
	    	});
	    });

	    describe('SW corner location ', function () {
	    	it('should calculate time to reach closest higher risk zone' , function (done) {
	    		testedFetcher.fetchByLocation(location.SWCorner, numRings, function (err, zones){
				   	for(var i = 0; i<zones.length; i++){
          				zones[i].level = i+1;
        			}
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.SWCorner, zones, negDelta, function (error){	
				   		expect(error).to.be.null;
				   	});
				   	expect(time).to.be.greaterThan(0);
				   	console.log('\t Time to reach next zone: ' + time);
				   	console.log('\t Distance to next zone: ' + time*speed);
				   	done();
				});	
	    	});    
	    	it("should calculate a distance <= to the zones dimensions set", function (done) {
	    		testedFetcher.fetchByLocation(location.SWCorner, numRings, function (err, zones){
				   	for(var i = 0; i<zones.length; i++){
          				zones[i].level = i+1;
        			}
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.SWCorner, zones, negDelta, function (error){
				   		expect(error).to.be.null;	
				   	});
				   
				   	var	maxDist = math.eval('sqrt(2 * ' + zoneSize + ' ^ 2)'); // in Km
				   	expect(time*speed).not.to.be.greaterThan(maxDist);
				   	done();
				});	
	    	});
	    });

	    describe('SE corner location ', function () {
	    	it('should calculate time to reach closest higher risk zone' , function (done) {
	    		testedFetcher.fetchByLocation(location.SECorner, numRings, function (err, zones){
				   	for(var i = 0; i<zones.length; i++){
          				zones[i].level = i+1;
        			}
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.SECorner, zones, negDelta, function (error){	
				   		expect(error).to.be.null;
				   	});
				   	expect(time).to.be.greaterThan(0);
				   	console.log('\t Time to reach next zone: ' + time);
				   	console.log('\t Distance to next zone: ' + time*speed);
				   	done();
				});	
	    	});    
	    	it("should calculate a distance <= to the zones dimensions set", function (done) {
	    		testedFetcher.fetchByLocation(location.SECorner, numRings, function (err, zones){
				   	for(var i = 0; i<zones.length; i++){
          				zones[i].level = i+1;
        			}
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.SECorner, zones, negDelta, function (error){
				   		expect(error).to.be.null;	
				   	});
				   
				   	var	maxDist = math.eval('sqrt(2 * ' + zoneSize + ' ^ 2)'); // in Km
				   	expect(time*speed).not.to.be.greaterThan(maxDist);				 
				   	done();
				});	
	    	});
	    	if(!negDelta){
	    		it("should return the default distance as no zones around have higer risk", function (done) {
	    		testedFetcher.fetchByLocation(location.SECorner, numRings, function (err, zones){
				   	for(var i = 0; i<zones.length; i++){
          				zones[i].level = i+1;
        			}
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.SECorner, zones, negDelta, function (error){
				   		expect(error).to.be.null;	
				   	});
				   
				   	var	maxDist = math.eval('sqrt(2 * ' + zoneSize + ' ^ 2)'); // in Km				   
				   	expect(time*speed).to.equal(zoneSize);
				   	done();
					});	
	    		});
	    	}
	    });

	    describe('N bound location ', function () {
	    	it('should calculate time to reach closest higher risk zone' , function (done) {
	    		testedFetcher.fetchByLocation(location.NBound, numRings, function (err, zones){
				   	for(var i = 0; i<zones.length; i++){
          				zones[i].level = i+1;
        			}
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.NBound, zones, negDelta, function (error){	
				   		expect(error).to.be.null;
				   	});
				   	expect(time).to.be.greaterThan(0);
				   	console.log('\t Time to reach next zone: ' + time);
				   	console.log('\t Distance to next zone: ' + time*speed);
				   	done();
				});	
	    	});    
	    	it("should calculate a distance <= to the zones dimensions set", function (done) {
	    		testedFetcher.fetchByLocation(location.NBound, numRings, function (err, zones){
				   	for(var i = 0; i<zones.length; i++){
          				zones[i].level = i+1;
        			}
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.NBound, zones, negDelta, function (error){
				   		expect(error).to.be.null;	
				   	});
				   
				   	var	maxDist = math.eval('sqrt(2 * ' + zoneSize + ' ^ 2)'); // in Km
				   	expect(time*speed).not.to.be.greaterThan(maxDist);
				   	done();
				});	
	    	});
	    });

	    describe('S bound location ', function () {
	    	it('should calculate time to reach closest higher risk zone' , function (done) {
	    		testedFetcher.fetchByLocation(location.SBound, numRings, function (err, zones){
				   	for(var i = 0; i<zones.length; i++){
          				zones[i].level = i+1;
        			}
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.SBound, zones, negDelta, function (error){	
				   		expect(error).to.be.null;
				   	});
				   	expect(time).to.be.greaterThan(0);
				   	console.log('\t Time to reach next zone: ' + time);
				   	console.log('\t Distance to next zone: ' + time*speed);
				   	done();
				});	
	    	});    
	    	it("should calculate a distance <= to the zones dimensions set", function (done) {
	    		testedFetcher.fetchByLocation(location.SBound, numRings, function (err, zones){
				   	for(var i = 0; i<zones.length; i++){
          				zones[i].level = i+1;
        			}
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.SBound, zones, negDelta, function (error){
				   		expect(error).to.be.null;	
				   	});
				   
				   	var	maxDist = math.eval('sqrt(2 * ' + zoneSize + ' ^ 2)'); // in Km
				   	expect(time*speed).not.to.be.greaterThan(maxDist);
				   	done();
				});	
	    	});
	    });

	    describe('E bound location ', function () {
	    	it('should calculate time to reach closest higher risk zone' , function (done) {
	    		testedFetcher.fetchByLocation(location.EBound, numRings, function (err, zones){
				   	for(var i = 0; i<zones.length; i++){
          				zones[i].level = i+1;
        			}
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.EBound, zones, negDelta, function (error){	
				   		expect(error).to.be.null;
				   	});
				   	expect(time).to.be.greaterThan(0);
				   	console.log('\t Time to reach next zone: ' + time);
				   	console.log('\t Distance to next zone: ' + time*speed);
				   	done();
				});	
	    	});    
	    	it("should calculate a distance <= to the zones dimensions set", function (done) {
	    		testedFetcher.fetchByLocation(location.EBound, numRings, function (err, zones){
				   	for(var i = 0; i<zones.length; i++){
          				zones[i].level = i+1;
        			}
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.EBound, zones, negDelta, function (error){
				   		expect(error).to.be.null;	
				   	});
				   
				   	var	maxDist = math.eval('sqrt(2 * ' + zoneSize + ' ^ 2)'); // in Km
				   	expect(time*speed).not.to.be.greaterThan(maxDist);
				   	done();
				});	
	    	});
	    });

	    describe('W bound location', function () {
	    	it('should calculate time to reach closest higher risk zone' , function (done) {
	    		testedFetcher.fetchByLocation(location.WBound, numRings, function (err, zones){
				   	for(var i = 0; i<zones.length; i++){
          				zones[i].level = i+1;
        			}
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.WBound, zones, negDelta, function (error){	
				   		expect(error).to.be.null;
				   	});
				   	expect(time).to.be.greaterThan(0);
				   	console.log('\t Time to reach next zone: ' + time);
				   	console.log('\t Distance to next zone: ' + time*speed);
				   	done();
				});	
	    	});    
	    	it("should calculate a distance <= to the zones dimensions set", function (done) {
	    		testedFetcher.fetchByLocation(location.WBound, numRings, function (err, zones){
				   	for(var i = 0; i<zones.length; i++){
          				zones[i].level = i+1;
        			}
				   	var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.WBound, zones, negDelta, function (error){
				   		expect(error).to.be.null;	
				   	});
				   
				   	var	maxDist = math.eval('sqrt(2 * ' + zoneSize + ' ^ 2)'); // in Km
				   	expect(time*speed).not.to.be.greaterThan(maxDist);
				   	done();
				});	
	    	});
	    });

		describe('Default case', function () {
	    	it('should get the default time for when the user is not moving' , function (done) {
	    		testedFetcher.fetchByLocation(location.Center, numRings, function (err, zones){
				   	
				   	var time = analyzer.calculateTimeToHRZone(0, currentLocationGeoJSON.Center, zones, negDelta, function (error){	
				   		expect(error).to.be.null;
				   	});
				   	console.log('\t Time to reach next zone: ' + time);
				   	done();
				});	
	    	});    
	    });
	});

    describe('#getCurrentZone(locationGeoJSON, zonesToAnalyze, callback)', function () {
	    
		describe('Center location (Non-boundary)', function () {	
	    	it('should find the current zone given a location' , function (done) {
				testedFetcher.fetchByLocation(location.Center, 0, function (err, curZone){
					testedFetcher.fetchByLocation(location.Center, numRings, function (error, zones){
				   		var currentZone = analyzer.getCurrentZone(currentLocationGeoJSON.Center, zones);
				   		expect(currentZone).to.exist;
				   		expect(currentZone).to.eql(curZone[0]);
				   		done();						
					});	
	  	    	});
			});
		});

		describe('NW corner location', function () {	
	    	it('should find the current zone given a location' , function (done) {
				testedFetcher.fetchByLocation(location.NWCorner, 0, function (err, curZone){
					testedFetcher.fetchByLocation(location.NWCorner, numRings, function (error, zones){
				   		var currentZone = analyzer.getCurrentZone(currentLocationGeoJSON.NWCorner, zones);
				   		expect(currentZone).to.exist;
				   		expect(currentZone).to.eql(curZone[0]);
				   		done();						
					});	
	  	    	});
			});
		});

		describe('NE corner location', function () {	
	    	it('should find the current zone given a location' , function (done) {
				testedFetcher.fetchByLocation(location.NECorner, 0, function (err, curZone){
					testedFetcher.fetchByLocation(location.NECorner, numRings, function (error, zones){
				   		var currentZone = analyzer.getCurrentZone(currentLocationGeoJSON.NECorner, zones);
				   		expect(currentZone).to.exist;
				   		expect(currentZone).to.eql(curZone[0]);
				   		done();						
					});	
	  	    	});
			});
		});

		describe('SW corner location', function () {	
	    	it('should find the current zone given a location' , function (done) {
				testedFetcher.fetchByLocation(location.SWCorner, 0, function (err, curZone){
					testedFetcher.fetchByLocation(location.SWCorner, numRings, function (error, zones){
				   		var currentZone = analyzer.getCurrentZone(currentLocationGeoJSON.SWCorner, zones);
				   		expect(currentZone).to.exist;
				   		expect(currentZone).to.eql(curZone[0]);
				   		done();						
					});	
	  	    	});
			});
		});

		describe('SE corner location', function () {	
	    	it('should find the current zone given a location' , function (done) {
				testedFetcher.fetchByLocation(location.SECorner, 0, function (err, curZone){
					testedFetcher.fetchByLocation(location.SECorner, numRings, function (error, zones){
				   		var currentZone = analyzer.getCurrentZone(currentLocationGeoJSON.SECorner, zones);
				   		expect(currentZone).to.exist;
				   		expect(currentZone).to.eql(curZone[0]);
				   		done();						
					});	
	  	    	});
			});
		});
		describe('N bound location', function () {	
	    	it('should find the current zone given a location' , function (done) {
				testedFetcher.fetchByLocation(location.NBound, 0, function (err, curZone){
					testedFetcher.fetchByLocation(location.NBound, numRings, function (error, zones){
				   		var currentZone = analyzer.getCurrentZone(currentLocationGeoJSON.NBound, zones);
				   		expect(currentZone).to.exist;
				   		expect(currentZone).to.eql(curZone[0]);
				   		done();						
					});	
	  	    	});
			});
		});
		describe('S bound location', function () {	
	    	it('should find the current zone given a location' , function (done) {
				testedFetcher.fetchByLocation(location.SBound, 0, function (err, curZone){
					testedFetcher.fetchByLocation(location.SBound, numRings, function (error, zones){
				   		var currentZone = analyzer.getCurrentZone(currentLocationGeoJSON.SBound, zones);
				   		expect(currentZone).to.exist;
				   		expect(currentZone).to.eql(curZone[0]);
				   		done();						
					});	
	  	    	});
			});
		});
		describe('E bound location', function () {	
	    	it('should find the current zone given a location' , function (done) {
				testedFetcher.fetchByLocation(location.EBound, 0, function (err, curZone){
					testedFetcher.fetchByLocation(location.EBound, numRings, function (error, zones){
				   		var currentZone = analyzer.getCurrentZone(currentLocationGeoJSON.EBound, zones);
				   		expect(currentZone).to.exist;
				   		expect(currentZone).to.eql(curZone[0]);
				   		done();						
					});	
	  	    	});
			});
		});

		describe('W bound location', function () {	
	    	it('should find the current zone given a location' , function (done) {
				testedFetcher.fetchByLocation(location.WBound, 0, function (err, curZone){
					testedFetcher.fetchByLocation(location.WBound, numRings, function (error, zones){
				   		var currentZone = analyzer.getCurrentZone(currentLocationGeoJSON.WBound, zones);
				   		expect(currentZone).to.exist;
				   		expect(currentZone).to.eql(curZone[0]);
				   		done();						
					});	
	  	    	});
			});
		});
    });
	describe('Error cases', function () {	
    	it('should return null if trying to get the zone of a location that is not in any of the zones' , function (done) {
			testedFetcher.fetchByLocation(location.Center, numRings, function (error, zones){
		   		var currentZone = analyzer.getCurrentZone(currentLocationGeoJSON.Outside, zones);
		   		expect(currentZone).to.be.null;
		   		done();						
			});	
  	    });

  	    it('should throw an error if trying to get the time to a zone that is not in the grid or zones fethced.' , function (done) {
			testedFetcher.fetchByLocation(location.Center, numRings, function (err, zones){
		   		var time = analyzer.calculateTimeToHRZone(speed, currentLocationGeoJSON.Outside, zones, negDelta, function (error){	
				   	expect(error).to.be.an('error');											
				   	done();
				});		
			});	
  	    });
	});
});
