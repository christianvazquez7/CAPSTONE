/**
 * POJO object for structured crime data.
 */
module.exports = function Crime(){
	
	var latitude;
	var longitude;
	var type;
	var date;
	var time;
	var id;
	var isDomestic;

	/**
	 * Parses a Json list into a structured list of Crime data.
	 * 
	 * @param jsonList: List of json crime records.
	 * @param marshall: Translator of api labels.
	 */
	Crime.fromList = function(jsonList, marshall) {

	};

	/**
	 * Gets the latitude of the crime.
	 */
	this.getLatitude = function() {

	};

	/**
	 * Gets the longitude of the crime.
	 */
	this.getLongitude = function() {

	};

	/**
	 * Gets the type of the crime.
	 */
	this.getType = function() {

	};

	/**
	 * Gets the date of the crime.
	 */
	this.getDate = function() {

	};

	/**
	 * Gets the time of the crime.
	 */
	this.getTime = function() {

	};

	/**
	 * Gets the Id of the crime.
	 */
	this.getId = function() {

	};

	/**
	 * Gets the domestic attribute of the crime.
	 */
	this.isDomestic = function() {

	};
};