/**
 * GeozoneStorage module is in charge convert the GeoZone into format that
 * can manage the MongoManager before storing
 */

/**
 * Module imports
 */
var MongoManager = require('./MongoManager.js');

/**
 * @constructor Receive a GeoZone
 */
module.exports = function GeozoneStorage (){

	var mGeozone;
	var cGeozone;
	var mongo;
	var geozoneLength;
	var geozoneCount;
	var onClassified;

	this.init = function(geozone, mongoClient, persistingCallback, finishCallback) {
		mGeozone = geozone;
		mongo = new MongoManager(mongoClient);
		persistingCallback();
	}

	/**
	 * This method is use as a callback for the storage of the geozones.
	 */
	function onZoneStored() {
		if(geozoneCount < geozoneLength) {
			onZoneAdded(geozoneCount, onZoneStored);
		}
		else {
			geozoneCount = 0;
			onClassified();
		}
	}

	/**
	 * This method is use as a callback for the storage of the geozones.
	 */
	function onZoneClassified() {
		if(geozoneCount < geozoneLength) {
			onZoneUpdated(geozoneCount, onZoneClassified);
		}
		else {
			onClassified();
		}
	}

	/**
	 * This method is use to handle the database storage
	 */
	this.persistGeozone = function(geozone_callback) {
		console.log("Persisting Geozones: ", mGeozone.length);
		geozoneLength = mGeozone.length;
		geozoneCount = 0;
		onClassified =  geozone_callback;
		mongo.zoneCount(function(found) {
			if(found == geozoneLength) {
				console.log("All the geozones are stored...");
				onClassified();
			}
			else {
				onZoneStored();
			}
		});
	}

	this.persistClassification = function(classifier, classifier_callback) {
		cGeozone = classifier;
		console.log("Persisting Classification: ", cGeozone.length);
		geozoneLength = classifier.length;
		geozoneCount = 0;
		onClassified = classifier_callback;
		onZoneClassified();
	}

	/**
	 * This method is used for the callback when a GeoZone is stored.
	 */
	function onZoneAdded(index, callback) {
		geozoneCount++;
		console.log('Adding Geozone ', index);
		mongo.addGeozone(mGeozone[index].getZone(), callback);
	}

	/**
	 * This method is used for the callback when a GeoZone is updated.
	 */
	function onZoneUpdated(index, callback) {
		geozoneCount++;
		console.log('Updating Classification of Geozone ', index);
		mongo.updateGeozone(cGeozone[index], callback);
	}
}