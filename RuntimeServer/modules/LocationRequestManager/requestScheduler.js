/**
 * This module calculates the frequency of location requests from to the Android app to 
 * the server. It assumes that an http request was received from the android app containing 
 * the current location and speed. With this data it call the necessary functions to 
 * identifies the closest higher risk geo-zone and estimates the distance and time it will require 
 * to reach given zone.
 */
 
module.exports = function RequestScheduler() {
	
	/**
	 * Module imports.
	 */
	var turf = require('turf');
	var ZoneFetcher = require('./zoneFetcher.js');
	var ZoneAnalyzer = require('./zoneAnalyzer.js');
	var ResponseBuilder = require('./responseBuilder.js');
	

	//Admin provided
	//Default = 1
	var numberOfRingsToFetch = 1;
	var probability = 50/100;

	//TODO: Calculate
	//Default = true
	var surveyFlag = true;

	var mCheckIn;


	var zoneFetchingCallback;
	var mResponseCallback;

	var fetcher = new ZoneFetcher();
	var analyzer = new ZoneAnalyzer(); 
	var responseBuilder = new ResponseBuilder();

	/**
	 * Call the necessary functions to prepare a response to the client about when to request a location check next
	 *
	 * @param responseCallbcak: Callback function to be called when the response is ready to be sent to the client
	 */
	this.scheduleNextRequest = function(checkIn, responseCallback) {
		mCheckIn = checkIn;
		mResponseCallback = responseCallback;
		fetcher.fetchByLocation(mCheckIn.location, numberOfRingsToFetch, zonesFetchingCallback);
	};
	

	/**
	 * Callback function to be called when the current geo-zone has been fetched from the database
	 *
	 * @param currentGeoZone: Object containing the current geo-zone.
	 */	
	zonesFetchingCallback = function onZonesFetched(error, geoZones) {
		if(error) mResponseCallback(error);

		/*Analyze zone to obtain the time to schedule the next location request*/
	 	var locationGeoJSON = turf.point([mCheckIn.location.longitude, mCheckIn.location.latitude]);	
		
		var timeForNextRequest = analyzer.calculateTimeToHRZone(mCheckIn.speed,locationGeoJSON,geoZones, function (err){ 
			mResponseCallback(err);
		});

		var currentZone = analyzer.getCurrentZone(locationGeoJSON,geoZones);
		if(currentZone == null) mResponseCallback(new Error("Zone not found"));
		
		surveyFlag = (Math.random() > probability);
		
		var response = responseBuilder.build(currentZone, timeForNextRequest, surveyFlag); 
		mResponseCallback(null, response);
		
	};	
};