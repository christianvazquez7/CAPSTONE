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

	this.getCount = function() {
		return totalCount;
	};
};