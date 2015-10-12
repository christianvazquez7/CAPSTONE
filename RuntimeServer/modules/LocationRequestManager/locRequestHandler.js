/**
 * This module is called from the server to handle the incoming location reporting request 
 * from the client. The module takes this request and calls a scheduler that calculates the
 * risk of the current zone and the time that the client should wait until sending the next
 * request to the server.
**/
module.exports = function LocationRequestHandler(latitude,longitude,velocity,clientID) {
	
	/**
	 * Module imports.
	 */
	var RequestScheduler = require('./requestScheduler.js');
	var Point = require('./point.js');
	
	var mClientID = clientID;
	var mLocation = new Point(latitude,longitude);
	var mVelocity = velocity;
	var responseCallback;

	/**
	 * Call functions required to schedule the next request	
	 */
	this.handleRequest = function() {

	};



	/**
	 * Callback function to be called when the nearby geoZones have been fetched from the database
	 *
	 * @param responseString: String with the response to be sent to the client.
	 */	
	this.responseCallback = function onResponseReady(responseString){

	};

};