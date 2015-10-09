/**
 * CoordinateConverter module convert coordinates into tile of an specific
 * area. Also, convert tile into coodinate to create the GeoJson.
 */

/**
 * Module Import
 */
geoPoint = require('./GridPoint.js');
geoCoordinate = require('./geoCoordinate.js');

module.exports = function Converter () {

	var conversionFactor;

	/**
	 * This method convert coordinate into tile
	 * @param coordinate: Latitude and Longitude
	 * @param area: Area to determine the size of the grid
	 * @return Tile based on the coordinate
	 */
	this.coordinateToTile = function(coordinate, area) {


	}

	/**
	 * This method convert tile into coordinate.
	 * @param x: x-position from the left top corner.
	 * @param y: y-position from the lett top corner.
	 * @param area: Area to determine the size of the grid
	 * @return The coordinate based on the location (x-position, y-position) 
	 * of the tile.
	 */
	this.tileToCoordinate = function(x, y, area) {


	}

	/**
	 * This is method change the area size into the 
	 * corresponding values for the formula for the grid calculation
	 * @param area: is the area inserted for the size.
	 * @return Return the respective size for the calculation
	 */
	this.translateArea = function(area) {

	}
}