/**
 * MongoManager module is in charge of the storing the parse GeoZone.
 */

module.exports = function MongoManager (mongoClient){

	var client = mongoClient;

	/*
	 * This method check if the geozone is inserted.
	 */
	function isInserted(zoneID, callback) {
		client.collection('Geozone').find({zone_id: zoneID}).count(function(err, result) {
			callback(null,result);
		});
	}

	/**
	 * This method add an object array in a format to storage.
	 * @return Return a boolean value if it was saved or not.
	 */
	this.addGeozone = function(geozone, callback) {
		isInserted(geozone.zone_id, function(error, result) {
			if((!error) && (!result)) {
				client.collection('Geozone').insert(geozone, function(err, result) {
					if(!err) {
						callback();
					}
					else {
						console.log("Error Adding Geozone!");
						callback();
					}
				});
			}
			else {
				console.log("Geozone " + geozone.zone_id + " already addded.");
				callback();
			}
		});
	}

	/**
	 * This method update an object array in a format to storage.
	 * @return Return a boolean value if it was saved or not.
	 */
	this.updateGeozone = function(classification, callback) {
		client.collection('Geozone').update({zone_id: classification.zone}, { $set: { level: classification.level, totalCrime: classification.totalCrime }}, function(err, result) {
			if(!err) {
				callback();
			}
			else {
				console.log("Error Updating Geozone!");
			}
		});
	}

	this.findZone = function(coordinate, callback) {
		client.collection('Geozone').find( { loc : { $geoIntersects : { $geometry : { type : "Point", coordinates : [ coordinate.longitude, coordinate.latitude] }}}}).toArray(function(err, result) {
			if(!err) {
				callback(result);
			}
		});
	}

	this.zoneCount = function(callback) {
		client.collection('Geozone').find().count(function(err, result) {
			callback(result);
		});
	}
}