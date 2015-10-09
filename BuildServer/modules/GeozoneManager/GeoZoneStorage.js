/**
 * GeoZoneStorage module is in charge convert the GeoZone into format that
 * can manage the MongoManager before storing
 */

/**
 * Module imports
 */
var mongo = require('./MongoManager.js');

/**
 * @constructor Receive a GeoZone
 */
module.exports = function GeoZoneStorage (List<GeoZone>){

	/**
	 * This method parse the GeoZone into an object array.
	 * @return Return a object array of the GeoZone.
	 */
	this.parseGeoZone = function() {


	}

	/**
	 * This method is use to handle the database storage
	 */
	this.handleDatabase = function(callback) {

	}

	/**
	 * This method is used for the callback when a GeoZone is stored.
	 */
	this.onZoneStored = function() {

	}

	/**
	 * This method is used for the callback when a GeoZone is updated.
	 */
	this.onZoneUpdated = function() {

	}
}