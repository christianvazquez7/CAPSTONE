/**
 * This module communicates with the database to find the current GeoZone where
 * the device is. It also fetches the zones around the current zone according to
 * the number of rings requested
 */
 
module.exports = function ZoneFetcher() {
	
	/**
	 * Module imports.
	 */
	var MongoClient = require('mongodb').MongoClient;
	var ObjectId = require('mongodb').ObjectID;
	var math = require('mathjs');
	var turf = require('turf');

	//Database URL
	var url = 'mongodb://ec2-52-24-21-205.us-west-2.compute.amazonaws.com:27017/GeozonePR';

	// Sets the size of the zones
	var mZoneSize = 200;
	 
	/**
	 * From a given location it fetches the geo-zone that it belongs to. 
	 * A number of rings around the current zone can be assigned to fetch the zones
	 * surrounding the current one. An input of 0 numRings will fetch only the current location.
	 *
	 * @param location: GeoPoint object containing location to fecth the zone from.
	 * @param numRings: Number of rings to fetch around the zone where the location belongs to.
	 * @param zonesCallback: Callback to be called when the zones have been fetched.
	 * 
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
		else if (numRings == 1){
			container = getPolygon(locationGeoJSON, numRings, mZoneSize);		
		}
		//Currently only supports only 0 or 1 rings around the current zone
		else{
			zonesCallback(new Error("Cannot fetch more than 1 ring"));
		}

		//Start connection to db
		connectToDB(url, function(err, db) {			
  			if(err) zonesCallback(err);
  			findZones(db, container, zonesCallback);
		});
	};
	
	/**
	 * Local method to handle database connection
	 *
	 * @param url: Database server url
	 * @param callback: callback to return an instance of the data base or an error mesasage
	 * 
	 */
	function connectToDB(url, callback){
		//Connection to db
		MongoClient.connect(url, function(err, db) {
  			callback(err,db);
		});			
	}

	/**
	 * Local method to query the database zone(s)
	 *
	 * @param db: An instance of the database to fetch the zones from
	 * @param container: polygon container used for fetching rings around the current zone.
	 * @param callback: Callback to be called when the zones have been fetched.
	 * 
	 */
	function findZones(db, container, callback){
  		
  		// Get the documents collection 
  		var collection = db.collection('Geozone');
  		// Find some documents 
  		
  		//Query zones and sort them by ascending longitude and descending latitude
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
  		}).toArray(function(err,result){
				if(err) callback(err);
				result.sort(function(a, b) {
    				// Sort by latitude decsencding
    				var dLat = parseFloat(b.loc.coordinates[0][0][1]) - parseFloat(a.loc.coordinates[0][0][1]);
    				if(dLat) return dLat;

    				// If there is a tie, sort by longitude ascending
    				var dLon = parseFloat(a.loc.coordinates[0][0][0]) - parseFloat(b.loc.coordinates[0][0][0]);
    				return dLon;
				});				
				db.close();
				callback(null, result);
				});
  	};
	
	/**
	 * Generates polygon geojson used to fetch multiple zones from the database
	 *
	 * @param locationGeoJSON: GeoJSON object containing location to build the polygon around
	 * @param numRings: Number of rings to calculate area of the polygon
	 * @param zoneSize: Geozone size assigned to build the grid
	 * 
	 * @return polygon: polygon geojson to fetch zones
	 */
	function getPolygon(locationGeoJSON, numRings, zoneSize){
		
			
		//Calculates hypotenuse to generate polygon depending on number of rings requestd and the size
		//of the grid tiles containging the geozones.
		var	distanceFromCenter = math.eval('sqrt(2 * ' + numRings*zoneSize + ' ^ 2)')/1000; // in Km

		//Finds the four corners of the polygon to be created
		var NW = turf.destination(locationGeoJSON,distanceFromCenter , -45 ,'kilometers').geometry.coordinates,
			NE = turf.destination(locationGeoJSON,distanceFromCenter , 45 ,'kilometers').geometry.coordinates,
			SE = turf.destination(locationGeoJSON,distanceFromCenter , 135 ,'kilometers').geometry.coordinates,
			SW = turf.destination(locationGeoJSON,distanceFromCenter , -135 ,'kilometers').geometry.coordinates;
		//Creates polygon using turf library
		var polygon = turf.polygon([[SW,NW,NE,SE,SW]]);

		return polygon;
	};
};