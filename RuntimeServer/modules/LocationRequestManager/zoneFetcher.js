/**
 * This modules communicates with the database to find the current GeoZone where
 * the device is. It also fetches from the database a list of zones enclosed by two coordinates.
 */
 
module.exports = function ZoneFetcher() {
	
	/**
	 * Module imports.
	 */
	var MongoClient = require('mongodb').MongoClient;
	var ObjectId = require('mongodb').ObjectID;
	var assert = require('assert');
	var math = require('mathjs');
	var turf = require('turf');

	//Database URL
	var url = 'mongodb://ec2-52-24-21-205.us-west-2.compute.amazonaws.com:27017/Geozones';

	// Sets the size of the zones
	var mZoneSize = 200;
	
	/**
	 * From a given location it fetches the geo-zone that encloses it.
	 *
	 * @param location: Point representing coordinates of current location of the device.
	 * @param currentZoneCallback: Callback function called when the geoZone has been fetched.
	 * @return True if a zone is found and successfully fetched, False otherwise.
	 */
	this.fetchByLocation = function(location, numRings, zonesCallback) {
		var container;
		//Convert the location message to a GeoJSON for easier opeations on it
		var locationGeoJSON = turf.point([location.longitude, location.latitude]);
		
		//It will only return the current zone
		if(numRings == 0){
			container = locationGeoJSON;
		}
		//It will return the current zone and the zones around it according to the number of rings requested
		else{
			container = getPolygon(locationGeoJSON, numRings, mZoneSize);		
		}

		MongoClient.connect(url, function(err, db) {
  			assert.equal(null, err);
  			findZones(db, container, zonesCallback);
		});		
	};
	
	function findZones(db, container, callback){
  		
  		// Get the documents collection 
  		var collection = db.collection('Geozones');
  		// Find some documents 
  		
  		//Variable to store db result
		collection.find(
  		{	
  			loc: 
  			{
     			$geoIntersects: {
        			$geometry: {
        				type: container.geometry.type,
						coordinates: container.geometry.coordinates
        			}
     			}
     		}
  		}).sort({ "loc.geometry.coordinates[0][0][1]" : -1, "loc.geometry.coordinates[0][0][0]" : 1}).toArray(function(err,result){
				assert.equal(null, err);
				db.close();
				callback(result);
			});
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
		/*
		* Christian M function
		*/
	};
	
	function getPolygon(locationGeoJSON, numRings, zoneSize){
		
		console.log('Fetching from location: ' + locationGeoJSON.geometry.coordinates);
		
		/*	
		 *  Calculates hypotenuse to generate polygon depending on number of rings requestd and the size
		 *	of the grid tiles containging the geozones.
		 */
		var	distanceFromCenter = math.eval('sqrt(2 * ' + numRings*zoneSize + ' ^ 2)')/1000; // in Km

		//Finds the for corners of the polygon to be created
		var NW = turf.destination(locationGeoJSON,distanceFromCenter , -45 ,'kilometers').geometry.coordinates,
			NE = turf.destination(locationGeoJSON,distanceFromCenter , 45 ,'kilometers').geometry.coordinates,
			SE = turf.destination(locationGeoJSON,distanceFromCenter , 135 ,'kilometers').geometry.coordinates,
			SW = turf.destination(locationGeoJSON,distanceFromCenter , -135 ,'kilometers').geometry.coordinates;
		var polygon = turf.polygon([[SW,NW,NE,SE,SW]]);

		return polygon;
	};
};