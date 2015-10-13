/**
 * This module is in charge of handling all the requests received
 * from the Android application and the Dashboard web page.
**/
module.exports = function RequestHandlers() {

	// Imports
	var logger = require('./utils/logger.js');
	var TelemetryRequestHandler = require('../TelemetryManager/telemetryRequestHandler.js');
	var DashboardRequestHandler = require('../../../Dashboard/dashboardRequestHandler.js');
	var LocationRequestHandler = require('../LocationRequestManager/locRequestHandler.js')
	
	// Initialization
	var mTelemetryHandler = new TelemetryRequestHandler();
	var mLocationHandler = new LocationRequestHandler();
	var mDashboardHandler = new DashboardRequestHandler();
	var currentZone = 3;

	/**
	 * Request handle for the crime statistics. Connects with the
	 * database to fetch the current statistics.
	 *
	 * @param response: A Json array with the current statistics.
	 */
	this.getStats = function(req, res) {
	logger.debug("in app.getStats()");
		console.log('>>> getstats');
		var result;
		mDashboardHandler.requestStats(function(err, result) {
// 			console.log(result);

			if (err) {
				res.statusCode = 404;
				res.send('No stats found');
			}
			else {
				res.json(result);
			}
		});
	}

	/**
	 * Request handle for the fetching of the zones. Connects with the 
	 * KYA DB to fetch the zones requested.
	 *
	 * @param parsedUrl: Object containing the following parameters:
	 *   1) northWest: Farthest north west point of area requested.
	 *   2) southEast: Farthest sout east point of area requested.
	 *   3) area     : Size of area requested.
	 * @param response: A Json array with the requested zones.
	 */
	this.getZones = function(req, res) {
	logger.debug("in app.getZones()");
		console.log('>>> getZones');
		var northWest = req.params.northWest;
		var southEast = req.params.southEast;
		var area = req.params.area;
		
		mDashboardHandler.requestZones(northWest, southEast, area, function(err, result) {
// 			console.log(result);
			res.send(result);
		});
	}

	/**
	 * Delegates the handling of the location data to the LocRequestHandler.
	 *
	 * @param req: Object containing the following parameters:
	 *   1) deviceId: Unique identifier for wear device.
	 *   2) velocity: Velocity of the user obtained from the accelerometer.
	 *   3) lat     : Current latitude of the wear device.
	 *   4) lon     : Current longitude of the wear device.
	 * @param response: if it was succesusfull or not in sending the data
	 */
	this.handleCheckIn = function(req, res) {
		logger.debug("in app.handleCheckIn()");
		console.log('>>> handleCheckIn');
		var lat = req.params.lat;
		var lon = req.params.lon;
		var velocity = req.params.velocity;
		var zoneId = req.params.zoneId;
		mLocationHandler.handleRequest(lat, lon, velocity, zoneId);
		res.send('SUCCESS');
	}

	/**
	 * Sends the HearBeat data to the WearRequestHandler.
	 *
	 * @param req: Object containing the following parameters:
	 *   1) deviceId: Unique identifier for wear device.
	 *   2) bmp     : Heart beat readings in beats per minute.
	 * @param response: if it was succesusfull or not in sending the data
	 */
	this.handleHeartBeat = function(req, res) {
		console.log('>>> handleHeartBeat');
		
		var telemetryData = req.body;
		
		mTelemetryHandler.handleTelemetry(telemetryData, currentZone);
		res.send('SUCCESS');
	}

	/**
	 * Sends the Survey data to the WearRequestHandler.
	 *
	 * @param req: Object containing the following parameters:
	 *   1) deviceId: Unique identifier for wearer device.
	 *   2) survey  : Rating selected by the user in response to a survey.
	 * @param response: if it was succesusfull or not in sending the data
	 */
	this.handleSurvey = function(req, res) {
		console.log('>>> handleHeartSurvey');
		var telemetryData = req.body;
// 		console.log(telemetryData);
		mTelemetryHandler.handleTelemetry(telemetryData, currentZone);
		res.send('SUCCESS');
	}
	
	/**
	 * Sends the Movement data to the WearRequestHandler.
	 *
	 * @param req: Object containing the following parameters:
	 *   1) deviceId  : Unique identifier for wear device.
	 *   2) movement  : 
	 * @param res: if it was succesusfull or not in sending the data
	 */
	this.handleMovement = function(req, res) {
		console.log('>>> handleMovement');
		var telemetryData = req.body;
		mTelemetryHandler.handleTelemetry(telemetryData, currentZone);
	}

	/**
	 * Gets the zone that matchs the given latitude and longitude.
	 *
	 * @param parsedUrl: Object containing the following parameters:
	 *   1) lat     : Current latitude.
	 *   2) lon     : Current longitude.
	 * @param response: the zone matching the given latitude and longitude
	 */
	this.getCurrentZone = function(req, res) {
		console.log('>>> getCurrentZone');
		var lat = req.params.lat;
		var lon = req.params.lon;
		res.send('SUCCESS');
	}
};