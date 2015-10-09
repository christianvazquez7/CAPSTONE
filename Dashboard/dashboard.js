/**
 * The Dashboard module is the component in charge of the dashboard construction.
 * Communicates with the MapController to draw the map, grids and zones in the dashboard.
 * It also fetches from the database the crimes statistics and a list of zones.
 */
 
module.exports = function Dashboard(width, height) {
	
	/**
	 * Module imports.
	 */
	var GridController = require('./gridController.js');
	var MapController = require('./mapController.js');
	var DashboardRequestHandler = require('./dashboardRequestHandler.js');
	var Stats = require('./stats.js');
	
	var mapLatitude;
	var mapLongitude;
	var zoneList;
	var gridGeoJSON;
	var width;
	var height;
	var reductionFactor;
	
	/**
	 * Constructs a new Google Map object.
	 *
	 * @param nw: (LatLgn) the north west latitude and longitude coordinate
	 * @param se: (LatLgn) the south east latitude and longitude coordinate
	 * @param area: (int) the size of the grids
	 */
	this.buildMap = function(nw, sw, area) {

	};
	
	/**
	 * Callback function to be called when the map is dragged.
	 *
	 * @param newLat: (double) the new latitude coordinate
	 * @param newLgt: (double) the new longitude coordinate
	 */
	this.onMapDrag = function(newLat, newLgt) {
	
	};
	
	/**
	 * Callback function to be called when a click is detected on a grid.
	 *
	 * @param lat: (double) the grid's latitude
	 * @param lgt: (double) the grid's longitude
	 * @param gridID: (int) the grid's id
	 */
	this.onGridClicked = function(lat, lgt, gridId) {
	
	};
	
	/**
	 * Callback function to be called when the crimes statistics have been
	 * fetched from the database.
	 *
	 * @param stats: (Stats) the crime statistics
	 */
	this.onStatsFetched = function(stats) {
	
	};
	
	/**
	 * Callback function to be called when the zones have been fetched
	 * from the database.
	 *
	 * @param zoneslist: (List<GeoZones>) the list of zones
	 */
	this.onZonesFetched = function(zoneList) {
	
	};
	
};