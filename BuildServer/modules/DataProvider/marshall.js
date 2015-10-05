/**
 * Contains label information for requests. Translates queries to different
 * SODA API's with similar data but different labeling.
 */
module.exports = function Marshall() {

	var mLatLabel;
	var mLongLabel;
	var mTypeLabel;
	var mDateLabel;
	var mTimeLabel;
	var mIdLabel;
	var mDomLabel;
	var mIgnoreList;

	/**
	 * Get the latitude label format (required).
	 */
	this.getLatitudeLabel = function() {

	};

	/**
	 * Get the longitude label format (required).
	 */	
	this.getLongitudeLabel = function() {

	};

	/**
	 * Get the type label format (required).
	 */
	this.getTypeLabel = function() {

	};

	/**
	 * Get the date label format (required).
	 */
	this.getDateLabel = function() {

	};

	/**
	 * Get the time label format (optional).
	 */
	this.getTimeLabel = function() {

	};

	/**
	 * Get the ID label format (required).
	 */
	this.getIdLabel = function() {

	};

	/**
	 * Get the Domestic label format (optional).
	 */
	this.getDomesticLabel = function() {

	};

	/**
	 * Get the types of crimes that should be ignored (optional).
	 */
	this.getIgnoreList = function() {

	};

};