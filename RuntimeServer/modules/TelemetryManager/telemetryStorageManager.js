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


	
	/**
	 * Function to process record containing a survey response, the heartbeat measurement or both
	 *
	 * @param telemetryRecord: Protocol Buffer message decoded containg information about the record to be stored
	 * @param surveyFlag: Flag to identiify if the record contains a survey response
	 * @param heartRateFlag: Flag to identiify if the record contains heart rate measurements
	 * @param callback: Callback function to call after processing record
	 */	
	this.processRecord = function(telemetryRecord, surveyFlag, heartRateFlag, callback) {
		
		console.log("Processing record");
		
		var surveyID,
			  heartRateID;
			
    //Initiate connection to database
		client.connect(function(err) {
  			if(err) {
    			callback(err, null);
  			}
  			
  			//Checks if there is survey data to process
  			if(surveyFlag){
  				
          console.log('Processing survey');
  				
          //Query to insert survey record
  				//Returns survey record's auto-generated id to use it when creating or updating the telemetry record in the database 
  				var query = 'INSERT INTO survey_response (perceived_risk, actual_risk) '+
  							'VALUES (' + telemetryRecord.survey.perceivedRisk +', ' + telemetryRecord.survey.actualRisk +') ' +
  							'RETURNING survey_id';
  				
  				client.query(query, function(err, result) {
  					
  					console.log("Query: " + query);
    				
    				if(err) {
    					callback(err, null);
	    			}
	    			
	    			//Testing
	    			console.log ("Result: Survey added with ID " + result.rows[0].survey_id);

   					surveyID = result.rows[0].survey_id;

            //Query to insert or update telemetry record with survey ID
            var query2 = 'INSERT INTO telemetry_record (user_id, survey_id, notification_id, zone_id) ' +
                 'VALUES (' + telemetryRecord.userID +', ' + surveyID + ', ' + telemetryRecord.notificationID + ', ' + telemetryRecord.zoneID + ') ' +
                 'ON CONFLICT (user_id, notification_id) ' + 
                 'DO UPDATE SET survey_id = EXCLUDED.survey_id ';
          
            client.query(query2, function(err, result) {
              
              console.log("Query: " + query2);
              
              if(err) {
                callback(err, null);   
              }

              //Testing
              console.log ("Result: Record added for user " + telemetryRecord.userID);
              
              //Close the connection
              client.end();
              if(!heartRateFlag){
                callback(null, "Success");
              }
            }); 
        	});
  			}

  			//Checks if there is heart rate data to process
  			if(heartRateFlag){

          console.log('Processing heart_rate');
  				
          //Query to insert heart rate measurement record
  				//Returns heart reate record's auto-generated id to use it when creating or updating the telemetry record in the database 
  				var query3 = 'INSERT INTO heart_rate (heart_rate_before, heart_rate_after) VALUES (' + telemetryRecord.heartRate.before +', ' + 
          telemetryRecord.heartRate.after +') RETURNING heart_rate_id';

          client.query(query3, function(err, result) {

            console.log('Query: ' + query3);
    				
            if(err) {
      					return console.error('error running heart rate query', err);
	    			}

	    			heartRateID = result.rows[0].heart_rate_id;
            //Testing
	    			console.log ("Result: Heart rate entry added with ID " + heartRateID);

            //Query to insert or update telemetry record with heart rate ID
            var query4 = 'INSERT INTO telemetry_record (user_id, heart_rate_id, tel_timestamp, notification_id, zone_id) ' +
                         'VALUES (' + telemetryRecord.userID +', ' + heartRateID + ', NOW(),' + telemetryRecord.notificationID + ', ' + telemetryRecord.zoneID + ') ' +
                         'ON CONFLICT (user_id, notification_id) ' + 
                         'DO UPDATE SET heart_rate_id = EXCLUDED.heart_rate_id';
          
            client.query(query4, function(err, result) {

              console.log('Query: ' + query4);
            
              if(err) {
                console.log("Error in query");
                return console.error('error running record (heart rate) query', err);
              }

              //Testing
              console.log ("Record added for user: " + telemetryRecord.userID);
            
              //Close the connection  
              client.end();
              
              callback(null, "Success");   
            });  
          });		
  			}
		});		
	};

	/**
	 * Function to store location point to eventually be used to track user movement
	 *
	 * @param GeoPoint: Protocol Buffer message decoded containg location data (latitude, longitude, timestamp)
	 * @param callback: Callback function to call after processing record
	 */
	this.storeMovementData = function(GeoPoint, callback) {

		client.connect(function(err) {
        console.log ("Processing Location Data for Telemetry");
        
        if(err) {
    			return console.error('could not connect to postgres', err);
  			}
  				
  			//Query to insert survey record
  			//Returns survey record's auto-generated id to use it when creating or updating the telemetry record in the database 
  			var query = 'INSERT INTO movement (user_id, geo_point, capture_time) VALUES (' + GeoPoint.userID + ', POINT(' + GeoPoint.latitude + ', ' + GeoPoint.longitude +'), NOW() ) ' +
                    'RETURNING movement_id';
        
        client.query(query, function(err, result) {

          console.log('Query: ' + query);

    			if(err) {
            callback(err, null);
	   			}
	    			
	   			//Testing
	   			console.log ('Point added with ID: ' + result.rows[0].movement_id + ' for user: ' + GeoPoint.userID);
          
          //Close the connection  
          client.end();
          callback(null, "Success");    			 
        });	
		});	
	};

};