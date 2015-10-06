/**
 * Builder for Marshall classes.
 */
module.exports = function MarshallBuilder() {
	var Marshall = require('./marshall.js');

	var mLatLabel;
	var mLongLabel;
	var mTypeLabel;
	var mDateLabel;
	var mTimeLabel;
	var mIdLabel;
	var mDomLabel;
	var mIgnoreList;

	/**
	 * Sets the latitude label for Marshall under construction.
	 *
	 * @param value: Value to be assigned.
	 */
	this.lat = function(value) {
		mLatLabel = value;
		return this;
	};

	/**
	 * Sets the longitude label for Marshall under construction.
	 *
	 * @param value: Value to be assigned.
	 */
	this.lon = function(value) {
		mLongLabel = value;
		return this;
	};

	/**
	 * Sets the type label for Marshall under construction.
	 *
	 * @param value: Value to be assigned.
	 */
	this.type = function(value) {
		mTypeLabel = value;
		return this;
	};

	/**
	 * Sets the date label for Marshall under construction.
	 *
	 * @param value: Value to be assigned.
	 */
	this.date = function(value) {
		mDateLabel = value;
		return this;
	};

	/**
	 * Sets the time label for Marshall under construction.
	 *
	 * @param value: Value to be assigned.
	 */
	this.time = function(value) {
		mTimeLabel = value;
		return this;
	};

	/**
	 * Sets the id label for Marshall under construction.
	 *
	 * @param value: Value to be assigned.
	 */
	this.id = function(value) {
		mIdLabel = value;
		return this;
	};

	/**
	 * Sets the domestic for Marshall under construction.
	 *
	 * @param value: Value to be assigned.
	 */
	this.domestic = function(value) {
		mDomLabel = value;
		return this;
	};

	/**
	 * Sets the ignore list for Marshall under construction.
	 *
	 * @param value: Value to be assigned.
	 */
	this.ignore = function(value) {
		mIgnoreList = value;
		return this;
	};

	/**
	 * Sets the latitude for Marshall under construction.
	 * Builds a new Marshall object.
	 */
	this.build = function() {
		var marshall = new Marshall(mLatLabel,mLongLabel,mTypeLabel,mDateLabel,mTimeLabel,mIdLabel,mDomLabel,mIgnoreList);
		mLatLabel = undefined;
		mLongLabel = undefined;
		mTypeLabel = undefined;
		mDateLabel = undefined;
		mTimeLabel = undefined;
		mIdLabel = undefined;
		mDomLabel = undefined;
		mIgnoreList = undefined;
		return marshall;
	};

};