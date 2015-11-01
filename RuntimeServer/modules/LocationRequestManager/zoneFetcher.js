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
	var math = require('mathjs');
	var turf = require('turf');

	//Database URL
	var url = 'mongodb://ec2-52-24-21-205.us-west-2.compute.amazonaws.com:27017/Geozone';

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
		else if (numRings == 1){
			container = getPolygon(locationGeoJSON, numRings, mZoneSize);		
		}
		else{
			throw "Cannot fetch more than 1 ring";
		}

		connectToDB(url, function(err, db) {			
  			if(err) throw err;
  			console.log("Connection successful");
  			findZones(db, container, zonesCallback);
		});
	};
	
	function connectToDB(url, callback){
		MongoClient.connect(url, function(err, db) {
  			callback(err,db);
		});			
	}

	function findZones(db, container, callback){
  		
  		// Get the documents collection 
  		var collection = db.collection('Geozone');
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
  		}).toArray(function(err,result){
				if(err) throw err;
				result.sort(function(a, b) {
    				// Sort by latitude decreasing
    				var dLat = parseFloat(b.loc.coordinates[0][0][1]) - parseFloat(a.loc.coordinates[0][0][1]);
    				if(dLat) return dLat;

    				// If there is a tie, sort by longitude increasing
    				var dLon = parseFloat(a.loc.coordinates[0][0][0]) - parseFloat(b.loc.coordinates[0][0][0]);
    				return dLon;
					});				
				db.close();
				callback(result);
				});
  	};
	
	
	function getPolygon(locationGeoJSON, numRings, zoneSize){
		
		//console.log('Fetching from location: ' + locationGeoJSON.geometry.coordinates);
		
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