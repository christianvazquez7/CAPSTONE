/**
 * GridBuilder module is in charge of building 
 * grids where each tile is identified by an ID. 
 */

/**
 * Module imports
 */
var converter = require('./Converter.js');

module.exports = function GridBuilder (){

	var converter
	var result;
	var zoneID;
	var nwLat
	var nwLon
	var seLat
	var seLon

	/**
	 * This method build the grid thematic. Each tile will has
	 * a unique zone number.
	 * @param area: Area to calculate the size.
	 * @param nwLatLon: NW coordinate (Highest coordinate to begin the grid).
	 * @param seLatLon: SE coordinate (Lowest coordinate to end the grid).
	 */
	this.buildGrid = function(area, nwLatLon, seLatLon) {


	}

	/**
	 * This method return the grid already created
	 * @return Return the grid already created.
	 */
	this.getGrid = function() {

	}

	/**
	 * This method check if the grid is already created.
	 * @return Return a boolean value if it was ready created or not.
	 */
	this.isGridCreated = function(nwLatLon, seLatLon, area) {

	}
}

/**
 * This method create the Tile polygon for the in Json polygon object.
 * @param x: x-position from the left top corner.
 * @param y: y-position from the left top corner.
 * @param area: Area to calculate the size.
 * @return Tile in a json polygon object.
 */
var createTilePolygon = function(GridPoint) {


}