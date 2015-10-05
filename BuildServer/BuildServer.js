var windowStart;
var windowEnd;
var threshold;
var src;
var northWest;
var southEast;
var area;
var DataProvider = require('./modules/DataProvider/dataProvider.js');

//Instantiate all necessary required modules here.

//Parse areguments and call main function here.

/**
 * Main Function that is called with parsed arguments
 * @param args: Object containing the following parameters:
 *   1) windowStart: What is the beggining date to start extracting?
 *   2) windowEnd: When is the end date to start extracting?
 *   3) threshold: Maximum amount of crimes.
 *   4) src: SODA API URL where data is stored.
 *   5) northWest: Farthest north west point of area under study.
 *   6) southEast: Farthest sout east point of area under study.
 *   7) area: Area under study.
 */
function main(args) {

}

/**
 * Callback that is triggered whenever the DataProvider processes a batch of
 * of crimes. 
 * @param crimes: List of processed crime objects.
 */
function onCrimesProcessed(crimes) {

}

/**
 * Callback that should be triggered whenever the window of crime span has been
 * processed.
 */
function onWindowFinished() {

}

/**
 * Triggers grid construction using GeoZoneManager.
 */
function buildGrid() {

}