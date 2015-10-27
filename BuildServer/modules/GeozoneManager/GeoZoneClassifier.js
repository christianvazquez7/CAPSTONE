/**
 * GeoZoneClassifier module is in charge of 
 * classify tile based on the zoneID.
 */

/**
 * Module imports
 */
var GeoCoordinate = require('./GeoCoordinate.js');
var DataClassificationStorage = require('./DataClassificationStorage.js');
var MongoManager = require('./MongoManager.js');
var Strategy = require('./ClassificationStrategy.js');
var Geozone = require('./Geozone.js');

/**
 * @Constructor get the list of crime with the marshall
 */
module.exports = function GeozoneClassifier (zone, size, callback, client, mongoClient) {

	
	var unclassifiedZone = zone;
	var classifiedZone = [];
	var onClassifierSet = callback;
	var mongo = new MongoManager(mongoClient);

	var storage = new DataClassificationStorage(client);
	var strategy = new Strategy();
	var isCreated = false;

	storage.createTable(size, function(err, result, callback) {
		if(err) {
			console.error(err);
		}
		else {
			console.log(result);
			onClassifierSet();
		}
	});

	var crimeCount
	var classificationCount = 0;
	var onBatchComplete;
	var currentCrimeIndex;
	var crimeLength;
	var classificationLength = unclassifiedZone.length;
	var currentBatch;
	var that = this;
	var notPinpointed = 0;
	var pinpointCount = 0;

	var maxZone;
	var minZone;

	var mapZone;

	var onClassification;

	/**
	 * This method is use for as a callback method for pinpoint
	 */
	function onPinpoint() {
		currentCrimeIndex ++;
		if(currentCrimeIndex < crimeLength) {
			that.pinpoint(new GeoCoordinate(currentBatch[currentCrimeIndex].getLatitude(), currentBatch[currentCrimeIndex].getLongitude()), onPinpoint);
		} 
		else {
			console.log("Batch Completed. " +pinpointCount+ " crimes were pinpointed and "+notPinpointed+" were not pinpointed.");
			onBatchComplete();
		}
	}

	/**
	 * This method received the crime list and the marshall
	 * @param List<crime> : List of crime
	 * @param Marshall : marshall to classify each crime.
	 * @param callback : callback method to it finished.
	 */
	this.feedCrime = function(crime, marshall, callback) {


		var ignoreList = marshall.getIgnoreList()
		var isValidCrime = true;
		var filtered = [];

		for (var i = 0; i < crime.length; i++) {
			for (var j = 0; j < ignoreList.length; j++) {
				if(crime[i].getType() == ignoreList[j]) {
					isValidCrime = false;
					break;
				}
			}

			if(isValidCrime) {
				filtered.push(crime[i]);
			}
			isValidCrime = true;
		}

			onBatchComplete = callback;
			currentCrimeIndex = 0;
			crimeLength = filtered.length;
			currentBatch = filtered;
			console.log("There were " + crimeLength + " filtered from ", crime.length);
			this.pinpoint(new GeoCoordinate(filtered[0].getLatitude(), filtered[0].getLongitude()), onPinpoint);
	}
	
	/**
	 * This method incriase the ZoneID accumulator by one
	 * when the zone is pinpointed.
	 */
	var updateDictonary = function(zoneID, callback) {
		storage.updateCrimeCount(zoneID, callback)
	}

	/**
	 * This method return the zoneID where the crime was
	 * pinpointed
	 * @return Return the zoneID of the pinpointed crime.
	 */
	this.pinpoint = function(coordinates, callback) {
		if(coordinates.getLongitude() != null || coordinates.getLatitude() != null) {
			var location = {
				latitude : parseFloat(coordinates.getLatitude()),
				longitude : parseFloat(coordinates.getLongitude())
			};
			
			mongo.findZone(location, function(found) {
				if(found[0] != undefined){
					pinpointCount++;
					console.log("Zone " + found[0].zone_id + " have been pinpointed... " + (currentCrimeIndex + 1) + " of ", crimeLength);
					updateDictonary(parseInt(found[0].zone_id), callback);
				}
				else {
					notPinpointed++;
					callback();
				}

			});
		}
		else {
			notPinpointed++;
			callback();
		}
	}

	/**
	 * This method clears the data of the dictonary.
	 * @return Return a boolean value if it was clear or not.
	 */
	this.clear = function() {
		if(storage.clearData()){
			console.log("The Data of the SQL Database was clear!")
		}
		else {
			console.log("The Data of the SQL Database was NOT clear!")
		}

	}

	/**
	 * TODO: CLassification of zones!
	 * This method classify all the tile zone using a classfication strategy.
	 * @return Return a list of GeoZone
	 */
	this.beginClassification = function(callback) {
		onClassification = callback;
		if(classificationCount < classificationLength) {
			classifyZone(classificationCount);
		}
		else {
			callback(null, classifiedZone);
		}
	}

	this.getParameter = function(callback) {
		storage.getMaxMin(function(err, max, min) {
			if(!err) {
				maxZone = max;
				minZone = min;
				console.log("The maximun crime count within the zone is " +maxZone+ " and minimun crime count within the zone is ", minZone);
				callback();
			}
		})
	}

	/**
	 * This method classify each zone and then create a Geozone.
	 * @param count: Counter to iterate between zone.
	 * @param callback: Callback function use to call the function when the zone classification is completed.
	 */
	function classifyZone(count) {
		storage.getZoneCount(count, function(err, result) {
			if(!err) {
				strategy.classify(maxZone, minZone, result, function(level, totalCrime) {
					classifiedZone.push({zone: count, level: level, totalCrime: totalCrime});
					classificationCount++;
					that.beginClassification(onClassification);
				});
			}
		});
	}
}