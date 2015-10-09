/**
 * Handles request to fetch the zones and the 
 * crimes statistics from the database.
 */
 
module.exports = function DashboardRequestHandler() {
	
	/**
	 * Module imports.
	 */
	var GeoZone = require('./geoZone.js');
	var Stats = require('./stats.js');
	
	var geoZoneList;
	
	
	/**
	 * Fetch the current crime statistics from KYA DB.
	 *
	 * @param callback: Callback function to be called when the crime statistics have been fecthed from the database.
	 */
	this.requestStats = function(callback) {
	
	};
	
	/**
	 * Fetch the zones from KYA DB.
	 *
	 * @param nwPoint: the north west point
	 * @param sePoint: the south east point
	 * @param area: the size 
	 * @param callback: Callback function to be called when the zones have been fetched from the database.
	 */
	this.requestZones = function(nwPoint, sePoint, area, callback) {
	
	};
	
};