/**
 * GeoZoneManager module is in charge of organize the building process of all the modules
 * such as classification and storage of GeoZones.
 */

/**
 * Module imports
 */
var Classifier 	= require('./GeozoneClassifier.js');
var GeozoneStorage 	= require('./GeozoneStorage.js');
var GridBuilder = require('./GridBuilder.js');

module.exports = function GeozoneManager (pgClient, mongoClient, finish_callback) {

	var gridBuilder = new GridBuilder()
	var pg = pgClient;
	var mongo = mongoClient;
	var geozoneStorage = new GeozoneStorage();
	var classifier;
	var geozoneList;
	var unclassifiedList;
	var geojson;
	var onFinish = finish_callback;
	var onBatchComplete;
	var onStorageComplete;

	/**
	 * This method is in charge of building the grid.
	 * @param nw: Northwest side of the grid.
	 * @param se: Southeast side of the grid.
	 * @param area: Area to calculate the size.
	 */
	this.buildGrid = function(nwCoordinate, seCoordinate, area, callback) {

		if(!this.isGridCreated(nwCoordinate, seCoordinate, area)) {
			geozoneList = gridBuilder.buildGrid(nwCoordinate, seCoordinate, area);
		}
		
		onStorageComplete = callback;
		storeGeozone();
	}

	/**
	 * This method check if the grid is created.
	 * @param nw: Northwest side of the grid.
	 * @param se: Southeast side of the grid.
	 * @param area: Area to calculate the size.
	 * @return Return a boolean value to check if it is created or not.
	 */
	this.isGridCreated = function(nwCoordinate, seCoordinate, area) {
		if(gridBuilder.isGridCreated(nwCoordinate, seCoordinate, area)) {
			return true;
		}
		return false;
	}

	/**
	 * This method feed crime into the GeoZone Classifier.
	 * @param List<Crime> : List of crime coming from the data provider.
	 * @param Marshall: Contains label information for requests.
	 */
	this.feedCrime = function(crime, marshall,callback) {
		console.log("Feeding crime....")
		onBatchComplete = callback;
		classifier.feedCrime(crime, marshall, onCrimeProcessed);

	}

	/**
	 * This method classify all the tile zone using a classfication strategy.
	 */
	this.classify = function() {
		classifier.beginClassification(function(err, result) {
			unclassifiedList = result;
			console.log('Classification Completed...');
			persistClassification();
		});
	}

	/**
	 *
	 */
	this.prepareToClassisfy = function(callback) {
		classifier.getParameter(callback);
	}
	/**
	 * This method drop the accumulator from the crime dictionaty collected
	 * on the SQL database.
	 * @return Return a boolean value if the data were deleted or not.
	 */
	this.clearClassificationData = function() {
		if(Classifier.clear()){
			console.log("The Data Classifier was clear!")
		}
		else {
			console.log("The Data Classifer was NOT clear!")
		}
	}

	/**
	 * This method begin the storing process for GeoZone.
	 */
	function storeGeozone() {
		if(geozoneList.length == 0){
			console.log("The Geozone List is Empty");
		}
		else {
			console.log("Initializing Geozone Storage...");
			geozoneStorage.init(geozoneList, mongo, onPersistingGeozone);
		}
	}

	function persistClassification() {
		if(unclassifiedList.length == 0) {
			console.log("The classification list is Empty");
		}
		else {
			console.log("Initializing Classification for Geozones...");
			geozoneStorage.persistClassification(unclassifiedList, onFinish)
		}
	}

	/**
	 * This method is use for the callback to the GeoZoneClassifier
	 */
	var onCrimeProcessed = function(err, result) {
		if(err) {
			console.error("There was an error feeding crime: ", err)
				return err
		}
		else {
			console.log(result)
			onBatchComplete();
		}
	}

	function onPersistingGeozone() {
		geozoneStorage.persistGeozone(onClassification);
	}

	function onClassification() {
		console.log("Initialing Geozone Classifier...");
		classifier = new Classifier(geozoneList, geozoneList.length, onStorageComplete, pg, mongo);
	}
}