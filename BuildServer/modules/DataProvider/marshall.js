/**
 * Contains label information for requests. Translates queries to different
 * SODA API's with similar data but different labeling.
 */
module.exports = function Marshall(lat,lon,typ,dat,tim,id,dom,ign) {

	var mLatLabel = lat;
	var mLongLabel = lon;
	var mTypeLabel = typ;
	var mDateLabel = dat;
	var mTimeLabel = tim;
	var mIdLabel = id;
	var mDomLabel = dom;
	var mIgnoreList = ign;

	/**
	 * Get the latitude label format (required).
	 */
	this.getLatitudeLabel = function() {
		return mLatLabel;
	};

	/**
	 * Get the longitude label format (required).
	 */	
	this.getLongitudeLabel = function() {
		return mLongLabel;
	};

	/**
	 * Get the type label format (required).
	 */
	this.getTypeLabel = function() {
		return mTypeLabel;
	};

	/**
	 * Get the date label format (required).
	 */
	this.getDateLabel = function() {
		return mDateLabel;
	};

	/**
	 * Get the time label format (optional).
	 */
	this.getTimeLabel = function() {
		return mTimeLabel;
	};

	/**
	 * Get the ID label format (optional).
	 */
	this.getIdLabel = function() {
		return mIdLabel;
	};

	/**
	 * Get the Domestic label format (optional).
	 */
	this.getDomesticLabel = function() {
		return mDomLabel;
	};

	/**
	 * Get the types of crimes that should be ignored (optional).
	 */
	this.getIgnoreList = function() {
		return mIgnoreList;
	};

};