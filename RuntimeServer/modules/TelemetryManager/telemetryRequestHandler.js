/**
*	This module is responsible for receiving telemetry data from the client, extracting 
*   it from http requests, and storing it in a database.
**/
module.exports = function TelemetryRequestHandler(telemetryDataBuffer, currentZoneID) {
	
	/**
	 * Module imports.
	 */
	var TelemetryStorageManager = require('./telemetryStorageManager.js');
	var ProtoBuf = require("../../resources/protobufjs");
	
	var mUserID;
	var mNotificationID;
	var mCurrentZone;
	var recordProcessedCallback;

	/**
	 * Call functions required to schedule the next request	
	 */
	this.handleTelemetry = function() {

	};

	/**
	 * Callback function to be called when the nearby geoZones have been fetched from the database
	 *
	 * @param responseString: String with the response to be sent to the client.
	 */	
	this.recordProcessedCallback = function onRecordProcessed() {
		
	};

};