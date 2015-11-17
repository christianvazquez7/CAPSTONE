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
	process.chdir(__dirname);
	var builder = ProtoBuf.loadProtoFile('../../../proto/KYA.proto'),
		KYA = builder.build("com.nvbyte.kya"),
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
	this.build = function (currentZone, previousZone, nextRequestTime, surveyFlag) {
		var geoPointsAr = [];
		for(var i = 0 ; i < currentZone.loc.coordinates[0].length - 1; i ++){
			geoPointsAr.push(new GeoPoint('', currentZone.loc.coordinates[0][i][1], currentZone.loc.coordinates[0][i][0]));
		}
		var currentZoneObj = new GeoZone(currentZone.level, currentZone.totalCrime, '10/10/2015',currentZone.zone_id, geoPointsAr);

		var geoPointsAr1 = [];
		for(var i = 0 ; i < currentZone.loc.coordinates[0].length - 1; i ++){
			geoPointsAr1.push(new GeoPoint('', currentZone.loc.coordinates[0][i][1], currentZone.loc.coordinates[0][i][0]));
		}
		var previousZoneObj = new GeoZone(previousZone.level, previousZone.totalCrime, '10/10/2015', previousZone.zone_id, geoPointsAr1);		
		
		var response = new CheckInResponse(nextRequestTime,surveyFlag,currentZoneObj, previousZoneObj);
		
		var responseBuffer = response.encode().toBuffer();
		return responseBuffer;	
	}; 
};