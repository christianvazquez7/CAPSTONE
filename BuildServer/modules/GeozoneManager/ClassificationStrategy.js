/**
 * ClassificationStrategy module is i charge of classify each tile
 * that will become GeoZone
 */

/**
 * @Constructor Get the strategy to be used
 */
module.exports = function ClassificationStrategy (log) {

	var level;
	var strategyLog = log;
	/**
	 * This method calculate level of each tile
	 * @param max: is the maximun number of crime in a zone.
	 * @param min: is the minimun number of crime in a zone.
	 * @param count: is the crime count in a zone.
	 * @param strategy_callback: Callback function to return the linear quantization of the crime.
	 */
	this.classify = function(max, min, count, strategy_callback) {
		level = 1 + Math.round(((count-min)/(max-min))*9);
		strategyLog.notice('The level of the crime count ' + count + ' is ', level);
		strategy_callback(level, count);
	}
}