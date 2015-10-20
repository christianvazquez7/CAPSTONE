/**
 * 	Builds protocol messages for response to client 
 */
module.exports = function ResponseBuilder() {
	

	/**
	 * Module imports.
	 */	

	var ProtoBuf = require("../../node_modules/protobufjs");
	var builder = ProtoBuf.loadProtoFile("../../resources/kya.proto");
	var KYA = builder.build("KYA");
	var CheckInResponse = KYA.CheckInResponse;
	var GeoZone = KYA.GeoZone;


	/**
	 * Builds the protocol buffer with the response for the client
	 *
	 * @return String with response to client
	 */
	this.build = function(currentZone, nextRequestTime, surveyFlag) {
		var currentZone = new GeoZone(currentZone.level,currentZone.crimeRate,currentZone.loc.coordinates);
		var response = new CheckInResponse(currentZone,nextRequestTime,surveyFlag);
		var responseBuffer = response.encode();
		var responseMessage = responseBuffer.toBuffer();
		return responseMessage;	
	};


};