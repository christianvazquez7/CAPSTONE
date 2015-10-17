/**
 * This module is in charge of handling all the requests received
 * from the Android application and the Dashboard web page.
**/
module.exports = function RequestHandlers() {

	// Imports
	var logger = require('../../resources/utils/logger.js');
	var TelemetryRequestHandler = require('../TelemetryManager/telemetryRequestHandler.js');
	var DashboardRequestHandler = require('../DashboardRequestManager/dashboardRequestHandler.js');
	var LocationRequestHandler = require('../LocationRequestManager/locRequestHandler.js')
	
	// Initialization
	var mTelemetryHandler = new TelemetryRequestHandler();
	var mLocationHandler = new LocationRequestHandler();
	var mDashboardHandler = new DashboardRequestHandler();

	/**
	 * Request handle for the crime statistics. Connects with the
	 * database to fetch the current statistics.
	 *
	 * @param response: A protobuffer with the current statistics.
	 */
	this.getStats = function(req, res) {
		logger.debug("GET --> Get stats handle");
		mDashboardHandler.requestStats(function(err, result) {
			if (err) {
				res.statusCode = 404;
				res.send('No stats found');
				logger.error(err);
			}
			else {
				res.send(result);
				// logger.info('Stats result --> ', result);
			}
		});
	}

	/**
	 * Request handle for the fetching of the zones. Connects with the 
	 * KYA DB to fetch the zones requested.
	 *
	 * @param req: Object containing the following parameters:
	 *   1) northWest: Farthest north west point of area requested.
	 *   2) northEast: Farthest north east point of area requested.
	 *	 3) southWest: Farthest south west point of area requested.
	 *   4) southEast: Farthest south east point of area requested.
	 * @param response: A Json array with the requested zones.
	 */
	this.getZones = function(req, res) {
		// Decode string query to buffer
		gridBounds =  new Buffer(req.query.code1, 'base64');
		mDashboardHandler.requestZones(gridBounds, function(err, result) {
			res.send(result);
			// logger.info('Zones result --> ', result);
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
		logger.debug("POST --> Checkin handle");
		var locationData = req.body;
		mLocationHandler.handleRequest(locationData, function(err, result) {
			if (err) {
				res.statusCode = 404;
				logger.error(err);
			}
			else {
				res.send(result);
				// logger.info('Checkin result --> ', result);
			}
		});
	}

	/**
	 * Sends the HearBeat data to the TelemetryRequestHandler.
	 *
	 * @param req: Object containing the following parameters:
	 *   1) deviceId: Unique identifier for wear device.
	 *   2) bmp     : Heart beat readings in beats per minute.
	 * @param response: if it was succesusfull or not in sending the data
	 */
	this.handleHeartBeat = function(req, res) {
		logger.debug("POST --> Heartbeat handle");
		var telemetryData = req.body;
		mTelemetryHandler.handleTelemetry(telemetryData);
		res.send('SUCCESS');
	}

	/**
	 * Sends the Survey data to the TelemetryRequestHandler.
	 *
	 * @param req: Object containing the following parameters:
	 *   1) deviceId: Unique identifier for wearer device.
	 *   2) survey  : Rating selected by the user in response to a survey.
	 * @param response: if it was succesusfull or not in sending the data
	 */
	this.handleSurvey = function(req, res) {
		logger.debug("POST --> Survey handle");
		var telemetryData = req.body;
		mTelemetryHandler.handleTelemetry(telemetryData);
		res.send('SUCCESS');
	}
	
	/**
	 * Sends the Movement data to the TelemetryRequestHandler.
	 *
	 * @param req: Object containing the following parameters:
	 *   1) deviceId  : Unique identifier for wear device.
	 *   2) movement  : 
	 * @param res: if it was succesusfull or not in sending the data
	 */
	this.handleMovement = function(req, res) {
		logger.debug("POST --> Movement handle");
		var telemetryData = req.body;
		mTelemetryHandler.handleMovement(telemetryData);
		res.send('SUCCESS');
	}

	/**
	 * Gets the zone that matchs the given latitude and longitude.
	 *
	 * @param parsedUrl: Object containing the following parameters:
	 *   1) lat     : Current latitude.
	 *   2) lon     : Current longitude.
	 * @param response: the zone matching the given latitude and longitude
	 */
	this.handleCurrentZone = function(req, res) {
		logger.debug("POST --> Current zone handle");
		res.send('SUCCESS');
	}
};