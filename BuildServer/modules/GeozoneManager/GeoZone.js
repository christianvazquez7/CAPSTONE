/**
 * GridBuilder module is in charge of building 
 * grids where each tile is identified by an ID. 
 */

/**
 * Module imports
 */
var GeoCoordinate = require('./GeoCoordinate.js');

/**
 * @constructor Set the zoneID to build the GeoZone.
 */
module.exports = function GeoZone (zoneID) {

	var level
	var ZoneID
	var totalPinpoint

	/**
	 * This method return the zoneID based on the GeoCoordinate.
	 * @return Return the ZoneID of the GeoZone.
	 */
	this.getZone = function(GeoCoordinate) {


	}

	/**
	 * This method return the level based in the GeoCoordinate.
	 * @return Return the level of the GeoZone.
	 */
	this.getLevel = function(GeoCoordinate) {


	}

	/**
	 * This method set the level of a particular GeoZone.
	 * @return Return a boolean value if it was inserted or not.
	 */
	this.setLevel = function(zoneID, level) {

	}

	/**
	 * This method return the area of the GeoZone.
	 * @return Return the area of the GeoZone.
	 */
	this.getArea = function() {


	 }

	/**
	 * This method return the total pinpoint in the GeoZone.
	 * @return Return the total ponpoint on the GeoZone.
	 */
	this.getTotalPinpoint = function() {

	}

	/**
	 * This method return the Northwest coordinate of the GeoZone.
	 * @return Return the northwest coordinate of the GeoZone.
	 */
	this.getNW = function() {

	}

	/**
	 * This method return the Southwest coordinate of the GeoZone.
	 * @return Return the southwest coordinate of the GeoZone.
	 */
	this.getSW = function() {
		
	}

	/**
	 * This method return the Northeast coordinate of the GeoZone.
	 * @return Return the northeast coordinate of the GeoZone.
	 */
	this.getNE = function() {
		
	}

	/**
	 * This method return the Southeast coordinate of the GeoZone.
	 * @return Return the southeast coordinate of the GeoZone.
	 */
	this.getSE = function() {
		
	}
}
