/**
 * This module creates a GeoJSON object containing grids.
 * Determines if the zones are ready to be fetched.
 */
 
module.exports = function GridController(threshold) {
	
	/**
	 * Module imports.
	 */
	var GeoZoneBuilder = require('./geoZoneBuilder.js');
	
	var areaThreshold;
	var grids;
	
	/**
	 * Given the north west latitude/longitude and the south east 
	 * latitude/longitude points, it creates a new GeoJSON object 
	 * containing the grids to add to a map.
	 *
	 * @param nwLocation: (LatLng) the north west latitude and longitude
	 * @param seLocation: (LatLng) the south east latitude and longitude
	 * @param area: (int) how large must be the area
	 * @return GeoJSON: a GeoJSON with the grids
	 */
	this.buildGrids = function(nwLocation, seLocation, area) {

	};
	
	/**
	 * Determines if the zones are ready to be fetched.
	 *
	 * @return boolean: True is the zones are ready to be fetched, False otherwise
	 */
	this.isReadyToFetch = function() {
	
	};
	
};