/**
 * Page module, handles management of query offsets. The SODA API has limits
 * that define the amount of results returned in a query. Therefore, the Pager
 * determines the total amount of results and splits it into chunks (pages).
 * @constructor
 */
module.exports = function Pager(chunk) {

	var mChunkSize = chunk;
	var mTotalSize;
	var mCurrentOffset;

	/**
	 * Initializes the pager module. Determines number of pages from query result.
	 *
	 * @param query Query to perform and count results.
	 * @return True if query was successful, false otherwise.
	 */
	this.init = function(query) {

	};

	/**
	 * Resets all counters. Used to recycle object. After called, init must be
	 * called again to reuse pager for a different query.
	 */
	this.reset = function() {

	};

	/**
	 * Determines if all pages have been processed.
	 *
	 * @return True if more pages are still available. False otherwise.
	 */
	this.hasNext = function() {

	};

	/**
	 * Fetches the index of the next page in query.
	 *
	 * @return Index of next page. 
	 * @throws Error if no more pages exist.
	 */
	this.nextPage = function() {

	}

};