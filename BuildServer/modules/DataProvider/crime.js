/**
 * POJO object for structured crime data.
 */
module.exports = function Crime(pLatitude,pLongitude,pType,pDate,pTime,pId,pIsDomestic){
	
	var latitude = pLatitude;
	var longitude = pLongitude;
	var type = pType;
	var date = pDate;
	var time = pTime;
	var id = pId;
	var isDomestic = pIsDomestic;
	var page;
	var offset;

	/**
	 * Parses a Json list into a structured list of Crime data.
	 * 
	 * @param jsonList: List of json crime records.
	 * @param marshall: Translator of api labels.
	 */
	Crime.fromList = function(jsonList, marshall) {
		var crimeList = [];
		for (var i =0 ; i < jsonList.length ; i++) {
			var crimeJson = jsonList[i];
			if(marshall.getLatitudeLabel() == marshall.getLongitudeLabel()) {
				var latitude = crimeJson[marshall.getLatitudeLabel()].latitude;
				var longitude = crimeJson[marshall.getLongitudeLabel()].longitude;
			}
			else {
				var latitude = crimeJson[marshall.getLatitudeLabel()];
				var longitude = crimeJson[marshall.getLongitudeLabel()];
			}
			var type = crimeJson[marshall.getTypeLabel()];
			var date = crimeJson[marshall.getDateLabel()];
			var time = crimeJson[marshall.getTimeLabel()];
			var id = crimeJson[marshall.getIdLabel()];
			var isDomestic = crimeJson[marshall.getDomesticLabel()];
			crimeList.push(new Crime(latitude,longitude,type,date,time,id,isDomestic));
		}
		return crimeList;
	};

	/**
	 * Gets the latitude of the crime.
	 */
	this.getLatitude = function() {
		return latitude;
	};

	/**
	 * Gets the longitude of the crime.
	 */
	this.getLongitude = function() {
		return longitude;
	};

	/**
	 * Gets the type of the crime.
	 */
	this.getType = function() {
		return type;
	};

	/**
	 * Gets the date of the crime.
	 */
	this.getDate = function() {
		return date;
	};

	/**
	 * Gets the time of the crime.
	 */
	this.getTime = function() {
		return time;
	};

	/**
	 * Gets the Id of the crime.
	 */
	this.getId = function() {
		return id;
	};

	/**
	 * Gets the page offset of this crime within a query.
	 */
	this.getOffset = function() {
		return offset;
	};

	/**
	 * Gets the page of this crime within a query.
	 */
	this.getPage = function() {
		return page;
	};

	/**
	 * Sets the offset for this crime within a query.
	 *
	 * @param val: Offset value to assign to crime object.
	 */
	this.setOffset = function(val) {
		offset = val;
	};

	/**
	 * Sets the page of this crime within a query.
	 *
	 * @param val: Page value to assign to crime object.
	 */
	this.setPage = function(val) {
		page = val;
	};

	/**
	 * Gets the domestic attribute of the crime.
	 */
	this.isDomestic = function() {
		return isDomestic;
	};
};