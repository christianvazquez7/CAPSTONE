/**
 * GeoZoneManager module is in charge of organize the building process of all the modules
 * such as classification and storage of GeoZones.
 */

/**
 * Module imports
 */
var converter = require('./Crime.js');
var converter = require('./Marshall.js');
var classifier = require('./GeoZoneClassifier.js');
var storage = require('./GeoZoneStorage.js');

module.exports = function GeoZoneManager () {

	/**
	 * This method is in charge of building the grid.
	 * @param nw: Northwest side of the grid.
	 * @param se: Southeast side of the grid.
	 * @param area: Area to calculate the size.
	 */
	this.buildGrid = function(nw, se, area) {


	}

	/**
	 * This method check if the grid is created.
	 * @param nw: Northwest side of the grid.
	 * @param se: Southeast side of the grid.
	 * @param area: Area to calculate the size.
	 * @return Return a boolean value to check if it is created or not.
	 */
	this.isGridCreated = function(nw, se, area) {

	}

	/**
	 * This method feed crime into the GeoZone Classifier.
	 * @param List<Crime> : List of crime coming from the data provider.
	 * @param Marshall: Contains label information for requests.
	 */
	this.feedCrime = function(List<Crime>, Marshall) {


	}

	/**
	 * This method classify all the tile zone using a classfication strategy.
	 */
	this.classify = function() {

	}

	/**
	 * This method drop the accumulator from the crime dictionaty collected
	 * on the SQL database.
	 * @return Return a boolean value if the data were deleted or not.
	 */
	this.clearClassificationData = function() {

	}

	/**
	 * This method begin the storing process for GeoZone.
	 */
	this.storeGeoZone = function() {

	}

	/**
	 * This method is use for the callback to the GeoZoneClassifier
	 */
	this.onCrimeProcessed = function() {

	}
}