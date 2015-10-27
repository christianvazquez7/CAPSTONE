/**
 * ClassificationStrategy module is i charge of classify each tile
 * that will become GeoZone
 */

/**
 * @Constructor Get the strategy to be used
 */
module.exports = function ClassificationStrategy () {

	var level;
	/**
	 * This method calculate level of each tile
	 * @param max: is the maximun number of crime in a zone.
	 * @param min: is the minimun number of crime in a zone.
	 * @param count: is the crime count in a zone.
	 * @return Return the result of the linear quantization of the crime.
	 */
	this.classify = function(max, min, count, callback) {
		level = 1 + Math.round((count/(max-min))*9);
		callback(level, count);
	}
}