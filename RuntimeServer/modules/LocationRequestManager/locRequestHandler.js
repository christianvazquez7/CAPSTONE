/**
 * This module is called from the server to handle the incoming location reporting request 
 * from the client. The module takes this request and calls a scheduler that calculates the
 * risk of the current zone and the time that the client should wait until sending the next
 * request to the server.
**/
module.exports = function LocationRequestHandler() {
	
	/**
	 * Module imports.
	 */
	var RequestScheduler = require('./requestScheduler.js');
	var GeoPoint = require('../../../BuildServer/modules/GeoZoneManager/GeoCoordinate.js');
	var ProtoBuf = require("../../node_modules/protobufjs");
	

	var protoBuilder = ProtoBuf.loadProtoFile("../../resources/kya.proto");
	var KYA = protoBuilder.build("KYA");
	var CheckIn = KYA.CheckIn;
	var GeoPoint = KYA.GeoPoint;

	
	var responseCallback;

	/**
	 * Call functions required to schedule the next request	
	 */
	this.handleRequest = function(checkInBuffer, callback) {
		var checkIn = CheckIn.decode(checkInBuffer);
		var scheduler = new RequestScheduler();

		scheduler.scheduleNextRequest(checkIn, callback);
	};





	/**
	 * Callback function to be called when the nearby geoZones have been fetched from the database
	 *
	 * @param responseString: String with the response to be sent to the client.
	 */	
	responseCallback = function onResponseReady(responseString){

	};


};