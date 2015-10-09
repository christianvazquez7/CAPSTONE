/**
 * This modules communicates with the database to find the current GeoZone where
 * the device is. It also fetches from the database a list of zones enclosed by two coordinates.
 */
 
module.exports = function ZoneFetcher() {
	
	/**
	 * Module imports.
	 */
	var Point = require('./point.js');
	var GeoJSONParser = require('./geoJSONParser.js');
	var GeoZone = require('./geoZone.js');

	var nearbyZonesList;

	/**
	 * From a given location it fetches the geo-zone that encloses it.
	 *
	 * @param location: Point representing coordinates of current location of the device.
	 * @param currentZoneCallback: Callback function called when the geoZone has been fetched.
	 * @return True if a zone is found and successfully fetched, False otherwise.
	 */
	this.fetchByLocation = function(location, currentZoneCallback) {

	};
	
	
	/**
	 * Given two coordinates it fetches the geo-zones enclosed by them.
	 *
	 * @param NWPoint: Point representing coordinates of the upper-left corner of the area.
	 * @param SEPoint: Point representing coordinates of the lower-right corner of the area.
	 * @param nearbyZoneCallback: Callback function called when the geoZones have been fetched.
	 * @return True if a list of zones is found and successfully fetched, False otherwise.
	 */
	this.fetchByArea = function(NWPoint, SEPoint, nearbyZonesCallback) {

	};
		
};