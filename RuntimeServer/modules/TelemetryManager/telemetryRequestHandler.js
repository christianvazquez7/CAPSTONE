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
	 * Function to decode protobuffer messages, identify components of message and send it to the storage manager.
	 *
	 * @param telemetryDataBuffer: Buffer contaning telemetry data to be processed
	 */ 
	this.handleTelemetryData = function(telemetryDataBuffer, callback) {
		var telemetryRecord = Telemetry.decode(telemetryDataBuffer);
		
		//Check if there is either survey data or heart rate measurements data to process
		var surveyFlag = (telemetryRecord.survey!=null),
		heartRateFlag = (telemetryRecord.heartRate!=null);
		
		//Create sotrage manager to process (add or update) the record
		if(surveyFlag||heartRateFlag){
			mStorageManager.processRecord(telemetryRecord, surveyFlag, heartRateFlag, callback);
		}
		else{
			callback(new Error('No data in record to process'));
		}
	};

	/**
	 * Function to decode protobuffer message containg location data from the client to track movement
	 *
	 * @param GeoPointBuffer: Buffer contaning GeoPoint (lat,lon,timestamp)
	 */ 
	this.handleMovementData = function(GeoPointBuffer, callback) {
		
		var geoPoint = GeoPoint.decode(GeoPointBuffer);
		
		mStorageManager.storeMovementData(geoPoint, callback);
		
	};
};