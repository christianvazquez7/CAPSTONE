/**
*	This module is responsible for receiving telemetry data from the client, extracting 
*   it from http requests, and storing it in a database.
**/
module.exports = function TelemetryRequestHandler() {
	
	/**
	 * Module imports.
	 */
	var ProtoBuf = require("../../node_modules/protobufjs");
	
	//Protocol buffer initialization
	var protoBuilder = ProtoBuf.loadProtoFile("../../resources/kya.proto");
	var KYA = protoBuilder.build("KYA");
	var Telemetry = KYA.Telemetry;
	
	var mUserID;
	var mNotificationID;
	var mCurrentZone;
	var recordProcessedCallback;

	/**
	 * Call functions required to schedule the next request	
	 */
	this.handleTelemetry = function(telemetryDataBuffer, currentZoneID) {
		var telemetryRecord = Telemetry.decode(telemetryDataBuffer);
		console.log('Telemetry record handle:')
		console.log(telemetryRecord);
		console.log('Current zone id: ' + currentZoneID);
	};

	/**
	 * Callback function to be called when the nearby geoZones have been fetched from the database
	 *
	 * @param responseString: String with the response to be sent to the client.
	 */	
	this.recordProcessedCallback = function onRecordProcessed() {
		
	};

};