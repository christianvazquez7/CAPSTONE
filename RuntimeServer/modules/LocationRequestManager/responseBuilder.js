/**
 * 	Builds protocol messages for response to client 
 */
module.exports = function ResponseBuilder() {
	

	/**
	 * Module imports.
	 */	
	var ProtoBuf = require("../../node_modules/protobufjs");
	/**
	 * Protocol buffer decoding imports
	 */ 
	 //TODO: Absolute paths?
	var builder = ProtoBuf.loadProtoFile('C:/Users/LuisR/Documents/GitHub/CAPSTONE/RuntimeServer/resources/kya.proto'),
		KYA = builder.build("KYA"),
		CheckInResponse = KYA.CheckInResponse,
		GeoZone = KYA.GeoZone,
		GeoPoint = KYA.GeoPoint;

	/**
	 * Builds the protocol buffer with the response for the client
	 * @param: currentZone: 
	 * @param: nextRequestTime
	 * @param: surveyFlag
	 * @return: encoded message to send to client
	 */
	this.build = function (currentZone, nextRequestTime, surveyFlag) {
		var geoPointsAr = [];
		for(var i = 0 ; i < currentZone.loc.coordinates[0].length - 1; i ++){
			geoPointsAr.push(new GeoPoint('', currentZone.loc.coordinates[0][i][1], currentZone.loc.coordinates[0][i][0]));
		}
		var currentZoneObj = new GeoZone(currentZone.zone_id, currentZone.level, currentZone.totalCrime, geoPointsAr);
		var response = new CheckInResponse(currentZoneObj,nextRequestTime,surveyFlag);
		var responseBuffer = response.encode().toBuffer();
		return responseBuffer;	
	}; 
};