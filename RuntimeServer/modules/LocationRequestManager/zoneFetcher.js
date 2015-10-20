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

	var math = require('../../node_modules/mathjs');

	/**
	 * From a given location it fetches the geo-zone that encloses it.
	 *
	 * @param location: Point representing coordinates of current location of the device.
	 * @param currentZoneCallback: Callback function called when the geoZone has been fetched.
	 * @return True if a zone is found and successfully fetched, False otherwise.
	 */

	this.fetchByLocation = function(location, numRings, zonesCallback) {
		
		var polygonContainer = getPolygon(location, numRings);

		MongoClient.connect(url, function(err, db) {
  			assert.equal(null, err);
  			findZones(db, polygonContainer, zonesCallback);
		});		


	};
	
	var findZones = function(db, polygon, callback) {
  		
  		// Get the documents collection 
  		var collection = db.collection('Geozones');
  		// Find some documents 
  		
  		//Variable to store db result
		var dbZonesCursor = collection.find(
  		{	
  			loc: 
  			{
     			$geoIntersects: {
        			$geometry: {polygonContainer}        			
     			}
     		}
  		}).sort({loc.coordinates[0][0][1] : -1, loc.coordinates[0][0][0] : -1});
  		
  		var zonesArray = dbZonesCursor.toArray();
  		db.close();
  		callback(resultArray);
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
	
	function getPolygon(location, numRings){
		var locationGeoJSON = turf.point([location.longitude, location.latitude]);
		var distanceFromCenter = math.eval('sqrt(2 * ' + numRings*200 + ' ^ 2)')/1000; // in Km
		var NW = turf.destination(locationGeoJSON,distanceFromCenter , 135 ,'kilometers').geometry.coordinates,
			NE = turf.destination(locationGeoJSON,distanceFromCenter , 45 ,'kilometers').geometry.coordinates,
			SE = turf.destination(locationGeoJSON,distanceFromCenter , -45 ,'kilometers').geometry.coordinates,
			SW = turf.destination(locationGeoJSON,distanceFromCenter , -135 ,'kilometers').geometry.coordinates;
		var polygon = turf.polygon([NW,NE,SE,SW,NW]);
		return polygon;
	};
};