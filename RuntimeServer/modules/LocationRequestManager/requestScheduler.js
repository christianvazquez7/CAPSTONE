/**
 * This module calculates the frequency of location requests from to the Android app to 
 * the server. It assumes that an http request was received from the android app containing 
 * the current location and velocity. With this data it call the necessary functions to 
 * identifies the closest higher risk geo-zone and estimates the distance and time it will require 
 * to reach given zone.
 */
 
module.exports = function RequestScheduler(velocity,location) {
	
	/**
	 * Module imports.
	 */
	var Point = require('./point.js');
	var ZoneFetcher = require('./zoneFetcher.js');
	var ZoneAnalyzer = require('./zoneAnalyzer.js');
	var ResponseBuilder = require('./responseBuilder.js');
	var GeoZone = require('./geoZone.js');

	var mCurrentGeoZone;
	var mLocation = location;
	var mVelocity = velocity;
	var mResponse;
	var mCurrentZoneCallback;
	var mNearbyZonesCallback;

	/**
	 * Call the necessary functions to prepare a response to the client about when to request a location check next
	 *
	 * @param responseCallback: Callback function to be called when the response is ready to be sent to the client
	 */
	this.scheduleNextRequest = function(responseCallback) {

	};
	
	/**
	 * Callback function to be called when the current geo-zone has been fetched from the database
	 *
	 * @param currentGeoZone: Object containing the current geo-zone.
	 */	
	this.mCurrentZoneCallback = function onCurrentZoneFetched(currentGeoZone) {

	};
	
	/**
	 * Callback function to be called when the nearby geoZones have been fetched from the database
	 *
	 * @param nearbyGeoZones: List of nearby geo-zones fetched from the database.
	 */	
	this.mNearbyZonesCallback = function onNearbyZonesFetched(nearbyGeoZones) {

	};
	
	/**
	 * Uses the zone fetcher module to find the zones surrounding the current location
	 * 
	 * @param 
	 */	
	this.findNearbyZones = function() {

	};
	
	

};