/**
 * This module is called from the server to handle the incoming location check-in
 * from the client. This check-in comes in the for of a protobuffer message. 
 * The module receives this message, decodes it, and calls a scheduler that finds the
 * the current zone and the time that the client should wait until sending the next
 * request to the server.
**/
module.exports = function LocationRequestHandler() {
	
	/**
	 * Module imports.
	 */
	var RequestScheduler = require('./requestScheduler.js');
	var ProtoBuf = require('protobufjs');
	
	/**
	 * Protobuffer message decoding variables
	 */

	//Check path 
	var protoBuilder = ProtoBuf.loadProtoFile('C:/Users/LuisR/Documents/GitHub/CAPSTONE/RuntimeServer/resources/kya.proto');
	var KYA = protoBuilder.build("KYA");
	var CheckIn = KYA.CheckIn;
	var GeoPoint = KYA.GeoPoint;

	/**
	 * Call functions required to schedule the next request	
	 * 
	 */
	this.handleRequest = function(checkInBuffer, callback) {
		var checkIn = CheckIn.decode(checkInBuffer);
		var scheduler = new RequestScheduler();
		scheduler.scheduleNextRequest(checkIn, callback);
	};

};