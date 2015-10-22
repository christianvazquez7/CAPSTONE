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
	var GeoPoint = require('../../../BuildServer/modules/GeoZoneManager/GeoCoordinate.js');
	var ZoneFetcher = require('./zoneFetcher.js');
	var ZoneAnalyzer = require('./zoneAnalyzer.js');
	var ResponseBuilder = require('./responseBuilder.js');
	var GeoZone = require('./geoZone.js');

	

	//Admin provided
	//Default = 1
	var numberOfRingsToFetch = 1;

	//TODO: Calculate
	//Default = true
	var surveyFlag = true;

	var mCurrentGeoZone;
	var mCheckIn;
	var mResponse;
	var mTimeForNextRequest;

	var zoneFetchingCallback;
	var responseCallback;

	var fetcher = new ZoneFetcher();
	var analyzer = new ZoneAnalyzer(); 
	var responseBuilder = new ResponseBuilder();

	/**
	 * Call the necessary functions to prepare a response to the client about when to request a location check next
	 *
	 * @param responseCallback: Callback function to be called when the response is ready to be sent to the client
	 */
	this.scheduleNextRequest = function(checkIn, callback) {
		mCheckIn = checkIn;
		responseCallback = callback;
		fetcher.fetchByLocation(mCheckIn.location, numberOfRingsToFetch, zonesFetchingCallback);
	};
	

	/**
	 * Callback function to be called when the current geo-zone has been fetched from the database
	 *
	 * @param currentGeoZone: Object containing the current geo-zone.
	 */	
	zonesFetchingCallback = function onZonesFetched(geoZones) {
		console.log("Zones fetched");
		console.log(geoZones);
		//Analyze zone to obtain the time to schedule the next location request
	//	analyzer.analyzeZones(geoZones);
	//	mTimeForNextRequest = analyzer.calculateTimeToHRZone(mCheckIn.speed,mCheckIn.location);
	//	mCurrentGeoZone = analyzer.getCurrentZone();

	//	mResponse = responseBuilder.build(mCurrentGeoZone, mTimeForNextRequest, surveyFlag); 

	//	responseCallback(mResponse);
	};
};