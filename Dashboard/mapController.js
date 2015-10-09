/**
 * MapController is in charge of the creation of the map, the grids 
 * and the zones. 
 */
 
module.exports = function MapController(nw, se, width, height) {

	/**
	 * Module imports.
	 */
	var GeoZone = require('./geoZone.js');
	var ZoneManager = require('./zoneManager.js');
	
	var viewLatitude;
	var viewLongitude;
	var viewHeigh;
	var viewWidth;
	var currentLatitude;
	var currentLongitude;
	var map;
	
	
	/**
	 * Gets the current latitude from the map object.
	 *
	 * @return double: the current latitude
	 */
	this.getCurrentGridLatitude = function() {

	};
	
	/**
	 * Gets the current longitude from the map object.
	 *
	 * @return double: the current longitude
	 */
	this.getCurrentGridLongitude = function() {

	};
	
	/**
	 * Function to be called when the map is zoomed.
	 *
	 * @param lat: (double) the new latitude location
	 * @param lgt: (double) the new longitude location
	 * @param area: (int) the area of 
	 * @param callback: Callback function to be called when the map is zoomed.
	 */
	this.zoomIn = function(lat, lgt, area, callback) {

	};

	/**
	 * Creates a rectangle object using the grid's coordinates
	 * and then draws each rectangle in the map.
	 *
	 * @param grids: (GeoJSON) the grids to draw
	 * @param callback: Callback function to be called when a grid is clicked.
	 */
	this.drawGrid = function(grids, callback) {

	};
	
	/**
	 * Creates a rectangle object using the zone's coordinates
	 * and then draws each rectangle in the map.
	 *
	 * @param geoZones: (List<GeoZones>)  the list of zones to draw
	 */
	this.drawZones = function(geoZones) {
	
	};
	
	/**
	 * Draws a new map given the location's latitude and longitude.
	 *
	 * @param lat: (double) the location's latitude
	 * @param lgt: (double) the location's longitude
	 * @param width: (double) the map's width
	 * @param height: (double) the map's height
	 * @param callback: Callback function to notify 
	 */
	this.drawMap = function(lat, lgt, width, height, callback) {
	
	};
	
	/**
	 * Draws the crime statistics, including the maximum and
	 * minimum number of crimes and the crime rate.
	 *
	 * @param stats: (Stats) the crimes statistics
	 */
	this.drawStats = function(stats) {
	
	};
	
	/**
	 * Draw the zone's statistics. This includes the risk level,
	 * number of crimes and crime rate.
	 *
	 * @param geoZone: (GeoZone) the zone's statistics
	 */
	this.drawZoneStats = function(geoZone) {
	
	};
	
	/**
	 * Callback function to be called when a click event 
	 * in a zone is detected.
	 *
	 * @param zoneId: (int) the zone's id
	 */
	this.onZoneClicked = function(zoneId) {
	
	};
	
	/**
	 * Removes all grids and zones from the map.
	 *
	 */
	this.clear = function() {
	
	};
	
};