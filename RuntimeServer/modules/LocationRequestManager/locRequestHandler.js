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
	var ProtoBuf = require(__dirname + '/../../node_modules/protobufjs');
	var ZoneFetcher = require('../LocationRequestManager/zoneFetcher.js');

	
	/**
	 * Protobuffer message decoding variables
	 */
	process.chdir(__dirname);
	var protoBuilder = ProtoBuf.loadProtoFile("../../../proto/KYA.proto");
	var KYA = protoBuilder.build("com.nvbyte.kya");
	var CheckIn = KYA.CheckIn;
	var GeoPoint = KYA.GeoPoint;
	var GeoZone = KYA.GeoZone;


	/**
	 * Call functions required to schedule the next request	
	 * 
	 */
	this.handleRequest = function(checkInBuffer, callback) {
		var checkIn = CheckIn.decode(checkInBuffer);
		var scheduler = new RequestScheduler();
		scheduler.scheduleNextRequest(checkIn, callback);
	};

	/**
	 * Fetch current zone and deliver it to server.
	 */
	this.handleZoneRequest = function(geoBuffer,callback) {
		var geopoint = GeoPoint.decode(geoBuffer);
		var fetcher = new ZoneFetcher();
		fetcher.fetchByLocation(geopoint,0, function(err,zone){
			if(err) callback(err);
			else {
				var geoPointsAr = [];
				for(var i = 0 ; i < zone[0].loc.coordinates[0].length - 1; i ++){
					geoPointsAr.push(new GeoPoint('', zone[0].loc.coordinates[0][i][1], zone[0].loc.coordinates[0][i][0]));
				}
				var currentZoneObj = new GeoZone(zone[0].level, +zone[0].totalCrime, '10/10/2015',zone[0].zone_id, geoPointsAr);
				var response = currentZoneObj.encode().toBuffer();
				callback(null,response);
			}
		});
	};
};