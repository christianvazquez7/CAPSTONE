/**
 * ClassificationStrategy module is i charge of classify each tile
 * that will become GeoZone
 */

/**
 * Module imports
 */
var StandardDeviation = require('./StandardDeviation.js');
var Quantile = require('./Quantile.js');

/**
 * @Constructor Get the strategy to be used
 */
module.exports = function ClassificationStrategy () {

	/**
	 * This method calculate level of each tile
	 * @param zoneGrid: is the object array zones
	 * @return Return an object with classificated tiles
	 */
	this.classify = function(zoneGrid) {


	}
}