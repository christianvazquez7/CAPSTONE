/**
 * 	Builds protocol messages for response to client 
 */
module.exports = function ResponseBuilder() {
	

	/**
	 * Module imports.
	 */	

	var ProtoBuf = require("../../node_modules/protobufjs");
	
	var builder = ProtoBuf.loadProtoFile('C:/Users/LuisR/Documents/GitHub/CAPSTONE/RuntimeServer/resources/kya.proto'),
		KYA = builder.build("KYA"),
		CheckInResponse = KYA.CheckInResponse,
		GeoZone = KYA.GeoZone,
		GeoPoint = KYA.GeoPoint;

	/**
	 * Builds the protocol buffer with the response for the client
	 *
	 * @return encoded message to send to client
	 */
	this.build = function(currentZone, nextRequestTime, surveyFlag) {
		var geoPointsAr = [];
		for(var i = 0 ; i < currentZone.loc.geometry.coordinates[0].length - 1; i ++){
			geoPointsAr.push(new GeoPoint('', currentZone.loc.geometry.coordinates[0][i][1], currentZone.loc.geometry.coordinates[0][i][0]));
		}
		var currentZone = new GeoZone(currentZone.zoneID, currentZone.level, currentZone.crimeRate, geoPointsAr);
		var response = new CheckInResponse(currentZone,nextRequestTime,surveyFlag);
		var responseBuffer = response.encode();
		var responseMessage = responseBuffer.toBuffer();
		return responseMessage;	
	}; 
};