/**
 * DataClassificationStorage module is in charge of storing crime
 * data into a SQL database
 */

module.exports = function DataClassificationStorage(client) {

	var crimeCount
	var storage
	var zoneLength;
	var zoneCount;
	var onInsertComplete;
	var that = this;
	var pgClient = client;

	function onTableInserted() {
		if(zoneCount < zoneLength) {
			create(zoneCount, onTableInserted);
		} else {
			onInsertComplete(null, "Insertion Completed...");
		}
	}

	/**
	 * This method create the table for the classfication
	 */
	 this.createTable = function(size, callback){
		pgClient.query("SELECT Count(zoneid) FROM classifier", function(error, count) {
			if (error) {
				callback("There was a problem when counting zoneids", null)
			}
			else if(size != count.rows[0].count){
				clearData(function(err) {
					console.log("Amount of rows to insert: " + size + ". Amount of rows previously: ", count.rows[0].count)
					if (!err) {
		 				zoneLength = size;
		 				zoneCount = 0;
		 				onInsertComplete = callback;
		 				onTableInserted();
					}
				});
			}
			else {
				callback(null, "Not table replacement needed");
			}
		});

	 }

	 function create(zone, callback) {
	 	pgClient.query("INSERT INTO classifier (zoneID) values ($1)", [zone], function(err, result) {
	 		if(!err) {
	 			zoneCount++;
	 			callback();
	 		}
	 	});
	}

	/**
	 * This method set on a query the zone to be increase
	 */
	this.updateCrimeCount = function(zoneID, callback) {
		pgClient.query("UPDATE classifier SET crimecounter = crimecounter + 1 WHERE zoneid = $1", [zoneID], function(err, result) {
			if(!err){
				callback();
			}
		});
	}

	/**
	 * This method clears the column with the data accumulated.
	 * @return Return a boolean value if it was clear or not.
	 */
	var clearData = function(callback) {
		pgClient.query("DELETE FROM classifier", function(err) {
 			if(err) {
 				callback("The values on the table were NOT deleted or were deleted already!");		
 			}
 			else {
 				console.log("The values on the table were deleted already!");
 				callback(null);
 			}
 		});
	}

	this.getMaxMin = function(callback) {
		pgClient.query("SELECT min(crimecounter), max(crimecounter) FROM classifier", function(err, result) {
 			if(err) {
 				console.log("The values on the table were NOT deleted or were deleted already!");		
 			}
 			else {
				callback(null, result.rows[0].max, result.rows[0].min);		
 			}
 		});
	}

	this.getZoneCount = function(zoneID, callback) {
		pgClient.query("SELECT crimecounter FROM classifier WHERE zoneid = $1", [zoneID], function(err, result) {
			if(err) {
				console.log("The values on the table were NOT deleted or were deleted already!");		
			}
			else {
				callback(null, result.rows[0].crimecounter);
 			}
		});
	}
}