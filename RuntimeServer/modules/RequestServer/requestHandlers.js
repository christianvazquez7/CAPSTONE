/**
 * This module is in charge of handling all the requests received
 * from the Android application and the Admin Dashboard.
**/
module.exports = function RequestHandlers() {

	/**
	 * Request handle for the crime statistics. Connects with the
	 * database to fetch the current statistics.
	 *
	 * @param response: A Json array with the current statistics.
	 */
	this.getStats = function(response) {
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
	this.getZones = function(parsedUrl, response) {

	}

	/**
	 * Delegates the handling of the location data to the LocRequestHandler.
	 *
	 * @param parsedUrl: Object containing the following parameters:
	 *   1) deviceId: Unique identifier for wear device.
	 *   2) velocity: Velocity of the user obtained from the accelerometer.
	 *   3) lat     : Current latitude of the wear device.
	 *   4) lon     : Current longitude of the wear device.
	 * @param response: if it was succesusfull or not in sending the data
	 */
	this.handleCheckIn = function(parsedUrl, response) {

	}

	/**
	 * Sends the HearBeat data to the WearRequestHandler.
	 *
	 * @param parsedUrl: Object containing the following parameters:
	 *   1) deviceId: Unique identifier for wear device.
	 *   2) bmp     : Heart beat readings in beats per minute.
	 * @param response: if it was succesusfull or not in sending the data
	 */
	this.handleHeartBeat = function(parsedUrl, response) {

	}

	/**
	 * Sends the Survey data to the WearRequestHandler.
	 *
	 * @param parsedUrl: Object containing the following parameters:
	 *   1) deviceId: Unique identifier for wearer device.
	 *   2) survey  : Rating selected by the user in response to a survey.
	 * @param response: if it was succesusfull or not in sending the data
	 */
	this.handleSurvey = function(parsedUrl, response) {

	}

	/**
	 * Gets the zone that matchs the given latitude and longitude.
	 *
	 * @param parsedUrl: Object containing the following parameters:
	 *   1) lat     : Current latitude.
	 *   2) lon     : Current longitude.
	 * @param response: the zone matching the given latitude and longitude
	 */
	this.getCurrentZone = function(parsedUrl, response) {

	}
};