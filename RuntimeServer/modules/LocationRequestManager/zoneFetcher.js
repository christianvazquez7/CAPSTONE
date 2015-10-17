/**
 * This modules communicates with the database to find the current GeoZone where
 * the device is. It also fetches from the database a list of zones enclosed by two coordinates.
 */
 
module.exports = function ZoneFetcher() {
	
	/**
	 * Module imports.
	 */
	var GeoJSONParser = require('./geoJSONParser.js');
	var GeoZone = require('./geoZone.js'); 

	/**
	 * From a given location it fetches the geo-zone that encloses it.
	 *
	 * @param location: Point representing coordinates of current location of the device.
	 * @param currentZoneCallback: Callback function called when the geoZone has been fetched.
	 * @return True if a zone is found and successfully fetched, False otherwise.
	 */

	this.fetchByLocation = function(mLocation, numRings, currentZoneCallback, callback) {
		//Variable to store db result
		var dbResultCursor;
		
		var polygonContainer = getPolygon(mLocation, numRings);

		/*----TODO: Methods to fetch from mongo DB------/
		/ Sort by latitude -1 then longitude -1         /
		/ 									            /
		/----------------------------------------------*/ 
		currentZoneCallback(dbResultCursor);
	};
	
	
	/**
	 * Given two coordinates it fetches the geo-zones enclosed by them.
	 *
	 * @param NWPoint: Point representing coordinates of the upper-left corner of the area.
	 * @param SEPoint: Point representing coordinates of the lower-right corner of the area.
	 * @param within: Boolean to identify if the caller wants the area fully enclosed by the 
	 * coordinates provided or the ones it intersects
	 * @param nearbyZonesCallback: Callback function called when the geoZones have been fetched.
	 * @return True if a list of zones is found and successfully fetched, False otherwise.
	 */
	this.fetchByArea = function(NWPoint, SEPoint, within, nearbyZonesCallback) {

		//For fetching zones surroundig certain zone it is recommended to use intersect (within = false)
		
		if(!within){
		/*----TODO: Methods to fetch from mongo DB------/
		/			Using intersect			            /
		/----------------------------------------------*/ 
		}
		//For fetching zones enclosed by certain area it is recommended to use within
		else{
		/*----TODO: Methods to fetch from mongo DB------/
		/			Using intersect			            /
		/----------------------------------------------*/ 
		}

		var zonesList;
		nearbyZonesCallback(zonesList);
	};
	
	function getPolygon(mLocation, numRings){

	};

};