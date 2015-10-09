/**
 * GeoZoneClassifier module is in charge of 
 * classify tile based on the zoneID.
 */

/**
 * Module imports
 */
var geoCoordiante = require('./geoCoordiante.js');
var storage = require('./DataClassificationStorage.js');
var strategy = require('./ClassificationStrategy.js');
var geoZone = require('./GeoZone.js');

/**
 * @Constructor get the list of crime with the marshall
 */
module.exports = function GeoZoneClassifier (geoJson) {

	var crimeCount
	var storage
	var mGrid = geoJson


	/**
	 * This method received the crime list and the marshall
	 * @param List<crime> : List of crime
	 * @param Marshall : marshall to classify each crime.
	 * @param callback : callback method to it finished.
	 */
	this.feedCrime = function(List<Crime>, Marshall, callback) {

	}
	
	/**
	 * This method incriase the ZoneID accumulator by one
	 * when the zone is pinpointed.
	 */
	this.updateDictonary = function(zoneID) {


	}

	/**
	 * This method return the zoneID where the crime was
	 * pinpointed
	 * @return Return the zoneID of the pinpointed crime.
	 */
	this.pinpoint = function() {

	}

	/**
	 * This method clears the data of the dictonary.
	 * @return Return a boolean value if it was clear or not.
	 */
	this.clear = function() {


	}

	/**
	 * This method classify all the tile zone using a classfication strategy.
	 * @return Return a list of GeoZone
	 */
	this.beginClassification = function() {

	}
}