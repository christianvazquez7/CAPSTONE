/**
*	This module is responsible for receiving telemetry data from the client, extracting 
*   it from http requests, and storing it in a database.
**/
module.exports = function TelemetryRequestHandler() {
	
	/**
	 * Module imports.
	 */
	var TelemetryStorageManager = require('./telemetryStorageManager.js');
	var ProtoBuf = require("../../node_modules/protobufjs");
	
	//Protocol buffer initialization
	var protoBuilder = ProtoBuf.loadProtoFile("../../resources/kya.proto");
	var KYA = protoBuilder.build("KYA");
	var Telemetry = KYA.Telemetry;

	var recordProcessedCallback;
	var mStorageManager = new TelemetryStorageManager();

	/**
	 * Function to decode protobuffer message, identify components of message and send it to the storage manager.
	 */ 
	this.handleTelemetry = function(telemetryDataBuffer, currentZoneID) {
		var telemetryRecord = Telemetry.decode(telemetryDataBuffer);
		
		var surveyFlag = (telemetryRecord.survey!=null),
		heartRateFlag = (telemetryRecord.heartRate!=null),
		movementFlag = (telemetryRecord.movement!=null);
		
		//Testing purposes
		surveyFlag = true;

		if(surveyFlag||heartRateFlag||movementFlag){
			mStorageManager.processRecord(telemetryRecord, surveyFlag, heartRateFlag, movementFlag, recordProcessedCallback);
		}
		else{
			recordProcessedCallback("No data to process",null);
		}
		
		//testing purposes
		// var mUserID = telemetryRecord.userID;
		// var mNotificationID = telemetryRecord.notificationID;
		// var mCurrentZone = 	currentZoneID;
		// theTest(telemetryRecord,mUserID,mNotificationID,mCurrentZone);
	};

	/**
	 * Callback function to be called when the record has been processed in the databae
	 *
	 * @param responseString: String with the response to be sent to the client.
	 */	
	recordProcessedCallback = function onRecordProcessed(err, message) {
		if (err){
			console.log("Error: " + err);
		}
		else{
			console.log("Results: " + message);
		}	
	};

	/*
	 * Testing Purposes
	 */
		function theTest(telemetryRecord,mUserID,mNotificationID,mCurrentZone){
		console.log("Test Results: ");
		console.log("Record: " + telemetryRecord);
		console.log("UID: " + mUserID);
		console.log("NID: " + mNotificationID)
		console.log("ZID: " + mCurrentZone);
		console.log("success");
	}

};