/**
 * 	This module decodes geoJSON data and construct GeoZone object.
 */
module.exports = function GeoJSONParser() {
		
	/**
	 * Module imports.
	 */
	var GeoZone = require('./geoZone.js');
	
	var mGeoZone;
	var mRisk;

	/**
	 * Parses the GeoJSON to obtain risk factor and points that enclose the zone to 
	 * create a GeoZone object.
	 *
	 * @param geoZoneJSON: GeoJSON of a zone
	 * @return GeoZone object.
	 */
	this.parseZone = function(geoZoneJSON) {

	};
};