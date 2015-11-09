var expect = require('chai').expect;

var ZoneManager = require('../zonesManager.js');

describe('ZoneManager', function() {
	this.timeout(5000);

	describe('getLevelColor()', function() {
		it('Get danger color of zone when the zone\'s level is correct.', function(done) {
			var zoneManager = new ZoneManager();
			expect(zoneManager.getLevelColor_(1)).to.be.equal('#389D26');
			expect(zoneManager.getLevelColor_(2)).to.be.equal('#46C0AC');
			expect(zoneManager.getLevelColor_(3)).to.be.equal('#4C9EBB');
			expect(zoneManager.getLevelColor_(4)).to.be.equal('#1A3971');
			expect(zoneManager.getLevelColor_(5)).to.be.equal('#2B1364');
			expect(zoneManager.getLevelColor_(6)).to.be.equal('#BEBEBE');
			expect(zoneManager.getLevelColor_(7)).to.be.equal('#F6FA2D');
			expect(zoneManager.getLevelColor_(8)).to.be.equal('#ECF33B');
			expect(zoneManager.getLevelColor_(9)).to.be.equal('#EC690E');
			expect(zoneManager.getLevelColor_(10)).to.be.equal('#F41E1F');
			done();
	    });

	    it('Get danger color of a zone when the zone\'s level is incorrect.', function(done) {
			var zoneManager = new ZoneManager();
			expect(zoneManager.getLevelColor_(11)).to.be.equal('grey');
			expect(zoneManager.getLevelColor_(0)).to.be.equal('grey');
			done();
	    });
	});

	describe('getGeoJson()', function() {
	    it('should convert Json Array to FeatureCollection', function(done) {
			zones = [
				{ _id: '562cd83cf62d032440e6ce66',
			    zone_id: 159131,
			    level: 1,
			    totalCrime: 0,
			    loc: { type: 'Polygon', coordinates: [[ -66.47502795394774, 18.38916479752872 ],
			    									 [ -66.47502795394774, 18.39832743179517 ], 
			    									 [ -66.44412890609618, 18.39832743179517 ], 
			    									 [ -66.44412890609618, 18.38916479752872 ], 
			    									 [ -66.47502795394774, 18.38916479752872 ]] } },
			  	{ _id: '562cd850f62d032440e6cfbe',
			    zone_id: 159475,
			    level: 2,
			    totalCrime: 20,
			    loc: { type: 'Polygon', coordinates: [[ -66.47502795394774, 18.38916479752872 ],
			    									 [ -66.47502795394774, 18.39832743179517 ], 
			    									 [ -66.44412890609618, 18.39832743179517 ], 
			    									 [ -66.44412890609618, 18.38916479752872 ], 
			    									 [ -66.47502795394774, 18.38916479752872 ]] } }
			];

			var zoneManager = new ZoneManager();
			var result = zoneManager.getGeoJson(zones);

			// Check result type
			expect(result.type).to.be.equal('FeatureCollection');
			done();
	    });
	
		it('should add properties to the new FeatureCollection', function(done) {
			zones = [
				{ _id: '562cd83cf62d032440e6ce66',
			    zone_id: 159131,
			    level: 1,
			    totalCrime: 0,
			    loc: { type: 'Polygon', coordinates: [[ -66.47502795394774, 18.38916479752872 ],
			    									 [ -66.47502795394774, 18.39832743179517 ], 
			    									 [ -66.44412890609618, 18.39832743179517 ], 
			    									 [ -66.44412890609618, 18.38916479752872 ], 
			    									 [ -66.47502795394774, 18.38916479752872 ]] } },
			  	{ _id: '562cd850f62d032440e6cfbe',
			    zone_id: 159475,
			    level: 2,
			    totalCrime: 20,
			    loc: { type: 'Polygon', coordinates: [[ -66.47502795394774, 18.38916479752872 ],
			    									 [ -66.47502795394774, 18.39832743179517 ], 
			    									 [ -66.44412890609618, 18.39832743179517 ], 
			    									 [ -66.44412890609618, 18.38916479752872 ], 
			    									 [ -66.47502795394774, 18.38916479752872 ]] } }
			];

			var zoneManager = new ZoneManager();
			var result = zoneManager.getGeoJson(zones);

			// Check if properties where added
			expect(result.features[0].properties.zone_id).to.be.equal(159131);
			expect(result.features[0].properties.totalCrime).to.be.equal(0);
			expect(result.features[0].properties.color).to.be.equal('#389D26');
			expect(result.features[1].properties.zone_id).to.be.equal(159475);
			expect(result.features[1].properties.totalCrime).to.be.equal(20);
			expect(result.features[1].properties.color).to.be.equal('#46C0AC');
			done();
	    });
	});

 });