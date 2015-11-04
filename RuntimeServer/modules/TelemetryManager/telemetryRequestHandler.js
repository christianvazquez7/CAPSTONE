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
	var GeoPoint = KYA.GeoPoint;
	
	var mUserID;
	var mNotificationID;
	var mCurrentZone;
	var recordProcessedCallback;

	/**
	 * Call functions required to schedule the next request	
	 */
	this.handleTelemetryData = function(telemetryDataBuffer) {
		var telemetryRecord = Telemetry.decode(telemetryDataBuffer);
		console.log('Telemetry record handle:')
		console.log(telemetryRecord);
	};

	/**
	 * Function to decode protobuffer message containg location data from the client to track movement
	 *
	 * @param GeoPointBuffer: Buffer contaning GeoPoint (lat,lon,timestamp)
	 */ 
	this.handleMovementData = function(GeoPointBuffer) {
		
		var geoPoint = GeoPoint.decode(GeoPointBuffer);
		console.log('Telemetry movement record handle:')
		console.log(geoPoint);
		
	};

	/**
	 * Callback function to be called when the nearby geoZones have been fetched from the database
	 *
	 * @param responseString: String with the response to be sent to the client.
	 */	
	this.recordProcessedCallback = function onRecordProcessed() {
		
	};

};