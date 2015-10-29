/**
 * Scheduler handles sleep patterns of the data provider. The DataProvider 
 * keeps the scheduler updated on latest requests. When data is not available
 * or throttling limits have been reached, this module schedules an alarm and
 * sends the data provider to sleep.
 */
module.exports = function Scheduler(limit, timeWindow, sleepPeriod) {
	var sleep = require('sleep');
	var mLastAnchor;
	var mLimit = limit;
	var mSleep = sleepPeriod;
	var mWindow = timeWindow;
	var totalCount = 0;

	/**
	 * Adds a request to the count tracking for limit detection. If the count
	 * exceeds the amount of requests defined by "limit" within the time period
	 * defined by "timeWindow", the build server will sleep for "sleepPeriod"
	 * to avoid exceeding the limit defined by the source.
	 */
	this.addRequest = function() {
		if (mLastAnchor === undefined || (Date.now() - mLastAnchor > timeWindow)) {
			mLastAnchor = Date.now();
			totalCount = 0;
		} else if (Date.now() - mLastAnchor <= timeWindow) {
			if(totalCount + 1 > mLimit) {
				sleep.sleep(mSleep);
				mLastAnchor = Date.now();
				totalCount = 0;
			}
		}
		totalCount ++;
	};

	/**
	 * Get the request count that have happened within the current time window.
	 *
	 * @return: The number of requests that have been tracked for the current
	 * window frame.
	 */
	this.getCount = function() {
		return totalCount;
	};
};