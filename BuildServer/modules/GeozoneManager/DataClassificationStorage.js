/**
 * DataClassificationStorage module is in charge of storing crime
 * data into a SQL database
 */

module.exports = function DataClassificationStorage(client, log) {

	classificationLog = log;
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
	 * This method create the table for the classification
	 * @param size: Size of the row to be created.
	 * @param tableCreation_callback: Callback function when the inserting is completed.
	 */
	 this.createTable = function(size, tableCreation_callback){
		pgClient.query("SELECT Count(zoneid) FROM classifier", function(error, count) {
			if (error) {
				tableCreation_callback("There was a problem when counting zoneids", null)
				classificationLog.alert('There was a problem when counting zoneids: ', error);
			}
			else if(size != count.rows[0].count){
				that.clearData(function(err) {
					console.log("Amount of rows to insert: " + size + ". Amount of rows previously: ", count.rows[0].count)
					classificationLog.notice("Amount of rows to insert: " + size + ". Amount of rows previously: ", count.rows[0].count);
					if (!err) {
		 				zoneLength = size;
		 				zoneCount = 0;
		 				onInsertComplete = tableCreation_callback;
		 				onTableInserted();
					}
				});
			}
			else {
				classificationLog.warning('No Table replacement needed');
				tableCreation_callback(null, "Not table replacement needed");
			}
		});

	 }

	 /**
	  * This method create the zones row in the classififcation table.
	  * @param zone: Zone count to be insert.
	  * @param creation_callback: Callback function when creation is done.
	  */
	 function create(zone, creation_callback) {
	 	pgClient.query("INSERT INTO classifier (zoneID) values ($1)", [zone], function(err, result) {
	 		if(!err) {
	 			zoneCount++;
	 			classificationLog.notice('Insertion of zone ' + zone + ' successfully completed');
	 			creation_callback();
	 		}
	 		else {
	 			classificationLog.critical('There was a problem inserting zone ', zone);
	 		}
	 	});
	}

	/**
	 * This method set on a query the zone to be increase
	 * @param zoneID: Zone id of zone to be update
	 * @param updateCrime_callback: Callback function use when is done.
	 */
	this.updateCrimeCount = function(zoneID, updateCrime_callback) {
		pgClient.query("UPDATE classifier SET crimecounter = crimecounter + 1 WHERE zoneid = $1", [zoneID], function(err, result) {
			if(!err){
				classificationLog.notice('Updating of zone ' + zoneID + ' successfully completed');
				updateCrime_callback();
			}
			else {
				classificationLog.critical('There was a problem updating zone ', zoneID);
			}
		});
	}

	/**
	 * This method clears the column with the data accumulated.
	 * @param clear_callback: Callback function when the data is cleared.
	 */
	this.clearData = function(clear_callback) {
		pgClient.query("DELETE FROM classifier", function(err) {
 			if(err) {
 				classificationLog.warning('The values in the classification table were NOT DELETED or WERE DELETED already');
 				clear_callback("The values for classification were NOT deleted or were deleted already!", null);		
 			}
 			else {
 				classificationLog.notice('The values in classification table were deleted');
 				clear_callback(null, "The values for classification were deleted!");
 			}
 		});
	}

	/**
	 * This method retreive the max and min for the classification strategy
	 * @param maxMin_callback: Callback function use for retreiving of the max and min
	 */
	this.getMaxMin = function(maxMin_callback) {
		pgClient.query("SELECT min(crimecounter), max(crimecounter) FROM classifier", function(err, result) {
 			if(err) {
 				classificationLog.critical('The max and min for the classification strategy were NOT RETREIVE!');
 			}
 			else {
 				classificationLog.notice('The max and min for the classification strategy were retreive');
				maxMin_callback(null, result.rows[0].max, result.rows[0].min);		
 			}
 		});
	}

	/**
	 * This method retreive the crime count of the zone for the classification strategy
	 * @param zoneID: zone id of the zone to get crime count
	 * @param zoneCount_callback: Callback function use for retreiving of the crime count
	 */
	this.getZoneCount = function(zoneID, zoneCount_callback) {
		pgClient.query("SELECT crimecounter FROM classifier WHERE zoneid = $1", [zoneID], function(err, result) {
			if(err) {
				classificationLog.critical('The crime count of the zone ' + zoneID + ' WERE NOT retreive');
				console.log("The values on the table were NOT deleted or were deleted already!");		
			}
			else {
				classificationLog.notice('The crime count of the zone ' + zoneID + ' were retreive');
				zoneCount_callback(null, result.rows[0].crimecounter);
 			}
		});
	}
}