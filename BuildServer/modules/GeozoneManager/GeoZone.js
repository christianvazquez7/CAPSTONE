/**
 * GridBuilder module is in charge of building 
 * grids where each tile is identified by an ID. 
 */

/**
 * @constructor Set the zoneID to build the GeoZone.
 */
module.exports = function Geozone(zone) {

	var gZone = zone;


	/**
	 * This method return the zoneID based on the GeoCoordinate.
	 * @return Return the ZoneID of the GeoZone.
	 */
	this.getZoneID = function(GeoCoordinate) {
		return gZone.zone_id;
	}

	/**
	 * This method return the level based in the GeoCoordinate.
	 * @return Return the level of the GeoZone.
	 */
	this.getZone = function(GeoCoordinate) {
		return gZone;
	}
}
