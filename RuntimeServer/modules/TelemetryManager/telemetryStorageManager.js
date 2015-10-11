/**
*	This module is responsible for storing and updating records in the telemetry database
*   
**/
module.exports = function TelemetryStorageManager() {
	
	/**
	 * Module imports.
	 */
	var pg = require('../../node_modules/pg');
 
	var conString = "postgres://postgres:kyateam@localhost:5432/KYA_SQL_DB";
 
	var client = new pg.Client(conString);


	
	this.processRecord = function(telemetryRecord, surveyFlag, heartRateFlag, movementFlag, callback) {
		console.log("Processing record");

		client.connect(function(err) {
  			if(err) {
  				console.log("Connection error");
    			return console.error('could not connect to postgres', err);
  			}
  		
  			client.query('SELECT NOW() AS "theTime"', function(err, result) {
    			if(err) {
    				console.log("Error in query");
      				return console.error('error running query', err);
	    		}
    			console.log("Results: " + result.rows[0].theTime);

   				client.end();

   				callback(err, result.rows[0].theTime);
  			});
		});
		
	};

};