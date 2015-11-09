var expect = require('chai').expect;
var turf = require('../../../node_modules/turf');

var GridController = require('../gridController.js'),
	coordinate = require('../../../../Class_Skeletons/GeoCoordinate.js');

describe('GridController', function() {
	this.timeout(5000);

	describe('isReadyToFetch()', function() {
		it('it should return true when area is 0.2', function(done) {
			var gridController = new GridController(0.2);
			expect(gridController.isReadyToFetch(0.2)).to.be.equal('true');
			done();
	    });

	    it('it should return false when area is not 0.2', function(done) {
			var gridController = new GridController(0.2);
			expect(gridController.isReadyToFetch(20)).to.be.equal('false');
			done();
	    });

	    it('it should throw error if you don\'t specify the area', function(done) {
			var gridController = new GridController(0.2);
			expect(function(){
				gridController.isReadyToFetch();
			}).to.throw('Incorrect parameter');
			
			done();
	    });
	});

	describe('buildGrids()', function() {
	    it('should return a FeautureCollection', function(done) {
			var swLatPoint = 17.918636,
				swLngPoint = -67.299500,
				neLatPoint = 18.536909,
				neLngPoint = -65.176392,
				area = 20;

			var gridController = new GridController(0.2);
			result = gridController.buildGrids(new coordinate(swLatPoint, swLngPoint), new coordinate(neLatPoint, neLngPoint), area);
			expect(result.type).to.be.equal('FeatureCollection');
        	expect(result.features).to.have.length(48);
			done();
	    });

	    it('should contain grids of area ~= 20,000 m2', function(done) {
			var swLatPoint = 17.918636,
				swLngPoint = -67.299500,
				neLatPoint = 18.536909,
				neLngPoint = -65.176392,
				area = 20;

			var gridController = new GridController(0.2);
			result = gridController.buildGrids(new coordinate(swLatPoint, swLngPoint), new coordinate(neLatPoint, neLngPoint), area);
			var length = result.features.length
			for (var i = 0; i < length; i++) {
				grid = result.features[i];
				var area = turf.area(grid);
				var intArea =   parseInt(area/1000000);
				expect(intArea).not.to.be.greaterThan(400);
				expect(intArea).not.to.be.lessThan(399);
			};

			done();
	    });

	    it('should throw error if you don\'t specify the parameters', function(done) {

			var gridController = new GridController(0.2);
			
			expect(function(){
				result = gridController.buildGrids();
			}).to.throw('Incorrect parameter');
			done();
	    });
	});
 });