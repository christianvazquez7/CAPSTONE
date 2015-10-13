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
	var GeoPoint = KYA.GeoPoint;

	var recordProcessedCallback;
	
	var mStorageManager = new TelemetryStorageManager();

	/**
	 * Function to decode protobuffer message, identify components of message and send it to the storage manager.
	 *
	 * @param telemetryDataBuffer: Buffer contaning telemetry data to be processed
	 */ 
	this.handleTelemetryData = function(telemetryDataBuffer) {
		var telemetryRecord = Telemetry.decode(telemetryDataBuffer);
		
		var surveyFlag = (telemetryRecord.survey!=null),
		heartRateFlag = (telemetryRecord.heartRate!=null);
		
		//Check if there is either survey data or heart rate measurements data to process
		if(surveyFlag||heartRateFlag){
			mStorageManager.processRecord(telemetryRecord, surveyFlag, heartRateFlag, recordProcessedCallback);
		}
		else{
			recordProcessedCallback("No data to process",null);
		}
	};

	/**
	 * Function to decode protobuffer message containg location data from the client to track movement
	 *
	 * @param GeoPointBuffer: Buffer contaning GeoPoint (lat,lon,timestamp)
	 */ 
	this.handleMovementData = function(GeoPointBuffer) {
		
		var geoPoint = GeoPoint.decode(GeoPointBuffer);
		
		mStorageManager.storeMovementData(geoPoint, recordProcessedCallback);
		
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
};