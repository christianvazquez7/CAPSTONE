/**
 * Scheduler handles sleep patterns of the data provider. The DataProvider 
 * keeps the scheduler updated on latest requests. When data is not available
 * or throttling limits have been reached, this module schedules an alarm and
 * sends the data provider to sleep.
 */
module.exports = function Scheduler(limit) {
	var mLastRequest;
	var mLimit = limit;
	var mRequestHour;

	/**
	 * Sends the data provider to sleep.
	 *
	 * @param desiredTime: Time request that may be overriden by the scheduler.
	 */
	this.sleep = function(desiredTime) {

	};

	/**
	 * Sets the latest request size.
	 */
	this.setLastRequest = function(lastRequest) {

	};

	/**
	 * Sets the numer of requests in the last hour.
	 */
	this.setRequestHour = function(requestHour) {

	};

};