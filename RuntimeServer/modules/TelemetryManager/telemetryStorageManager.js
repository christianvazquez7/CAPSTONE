/**
*	This module is responsible for storing and updating records in the telemetry database
*   
**/
module.exports = function TelemetryStorageManager() {
	
	/**
	 * Module imports.
	 */
	var pg = require('../../node_modules/pg');
  
  //Luis
	var conString = "postgres://postgres:kyateam@localhost:5432/KYA_SQL_DB";

  //Christian
  //var conString = "postgres://postgres:Aguaseka7!@localhost:5433/KYA_SQL_DB";
  
  //Remote
  //var conString = "postgres://kyadb:CapstoneProject2015@postgresql-kya.cch3ie56ioks.us-west-2.rds.amazonaws.com:5432/KYA_SQL_DB"; 
	var client;

	/**
	 * Function to process record containing a survey response, the heartbeat measurement or both
	 *
	 * @param telemetryRecord: Protocol Buffer message decoded containg information about the record to be stored
	 * @param surveyFlag: Flag to identiify if the record contains a survey response
	 * @param heartRateFlag: Flag to identiify if the record contains heart rate measurements
	 * @param callback: Callback function to call after processing record
	 */	
	this.processRecord = function(telemetryRecord, surveyFlag, heartRateFlag, callback) {
		
    client = new pg.Client(conString);

		var surveyID,
			  heartRateID;
		if(!surveyFlag && !heartRateFlag){
      callback(new Error('No telemetry data to process'));
      return;
    }
    //Initiate connection to database
		client.connect(function(err) {
  			if(err) {
    			callback(err);
          return;
  			}
  			
  			//Checks if there is survey data to process
  			if(surveyFlag){
  				
            //Query to insert or update telemetry record with survey ID
            var surveyQuery = 'INSERT INTO telemetry_record (user_id, notification_id, zone_id, s_actual_risk, s_perceived_risk, r_timestamp) ' +
                 "VALUES ('" + telemetryRecord.userID + "', '" + telemetryRecord.notificationID + "', " + telemetryRecord.zoneID + ', ' + telemetryRecord.survey.actualRisk + 
                  ', ' + telemetryRecord.survey.perceivedRisk + ', NOW() ) ' +
                 'ON CONFLICT (user_id, notification_id) ' + 
                 'DO UPDATE SET s_actual_risk = EXCLUDED.s_actual_risk, s_perceived_risk = EXCLUDED.s_perceived_risk ';
          
            client.query(surveyQuery, function(err, result) {
              
              if(err) {
                callback(err);   
              }

              //Testing
              //console.log ("Result: Record added for user " + telemetryRecord.userID);
              
              
              if(!heartRateFlag){
                callback(null, "Success");
                return;
              }
              else{
                //Close the connection
                client.end();
              }
            }); 
        	
  			}

  			//Checks if there is heart rate data to process
  			if(heartRateFlag){
  				var hrQuery;
          if(telemetryRecord.heartRate.before){
              hrQuery = 'INSERT INTO telemetry_record (user_id, notification_id, zone_id, hr_before, r_timestamp) ' +
                         "VALUES ('" + telemetryRecord.userID + "', '" + telemetryRecord.notificationID + "', " + telemetryRecord.zoneID + ', ' + telemetryRecord.heartRate.before + ', NOW() )' +
                         'ON CONFLICT (user_id, notification_id) ' + 
                         'DO UPDATE SET hr_before = EXCLUDED.hr_before';
          }
          else{

              hrQuery = 'INSERT INTO telemetry_record (user_id, notification_id, zone_id, hr_after, r_timestamp) ' +
                         "VALUES ('" + telemetryRecord.userID + "', '" + telemetryRecord.notificationID + "', " + telemetryRecord.zoneID + ', ' + telemetryRecord.heartRate.after + ', NOW() ) ' +
                         'ON CONFLICT (user_id, notification_id) ' + 
                         'DO UPDATE SET hr_after = EXCLUDED.hr_after';
          }

          client.query(hrQuery, function(err, result) {
    				
            if(err) {
      					callback(err);
	    			}
            
            //Close the connection  
            client.end();
              
            callback(null, "Success");   
            
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
    client = new pg.Client(conString);
    
		client.connect(function(err) {
        
        if(err) {
    			callback(err);
  			}
  				
  			//Query to insert movement record  			
  			var query = "INSERT INTO movement (user_id, geo_point, capture_time) VALUES ( '" + GeoPoint.userID + "' , POINT( " + GeoPoint.latitude + ', ' + GeoPoint.longitude +'), NOW() ) ' +
                    'RETURNING movement_id';
        
        client.query(query, function(err, result) {

    			if(err) {
            callback(err);
	   			}
	    			          
          //Close the connection  
          client.end();

          callback(null, "Success");    			 
        });	
		});	
	};

};