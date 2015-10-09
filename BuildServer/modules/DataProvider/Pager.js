/**
 * Page module, handles management of query offsets. The SODA API has limits
 * that define the amount of results returned in a query. Therefore, the Pager
 * determines the total amount of results and splits it into chunks (pages).
 * @constructor
 */
module.exports = function Pager() {

	var Socrata = require('node-socrata');
	var mChunkSize = 0;
	var numberOfPages = 0;
	var currentPage = 0;

	/**
	 * Initializes the pager module. Determines number of pages from query result.
	 *
	 * @param query Query to perform and count results.
	 * @param callback called when query is succesful.
	 * @return True if query was successful, false otherwise.
	 */
	this.init = function(request,callback) {
		mChunkSize = request.getLimit();
		var config = {
			hostDomain: request.getSource(),
			resource: request.getResource(),
			XAppToken: request.getToken()
		};

		var params = {
			$select: ['count(*)'],
			$where: request.getWhere()
		};

		var soda = new Socrata(config);
		console.log(params);
		soda.get(params,function(err,response,data){
			console.log(data);
			numberOfPages = Math.ceil(data[0].count/parseFloat(request.getLimit()));
			console.log('Number of pages ' +numberOfPages);
			mCurrentOffset = 0;
			callback();
		});
	};

	/**
	 * Resets all counters. Used to recycle object. After called, init must be
	 * called again to reuse pager for a different query.
	 */
	this.reset = function() {
		currentPage = 0;
		numberOfPages = 0;
		mChunkSize = 0;
	};

	this.getPages = function() {
		return numberOfPages;
	};

	/**
	 * Determines if all pages have been processed.
	 *
	 * @return True if more pages are still available. False otherwise.
	 */
	this.hasNext = function() {
		console.log(currentPage);
		return currentPage < numberOfPages;
	};

	this.setLastPage = function(pageNumber) {
		currentPage = pageNumber;
	};

	/**
	 * Fetches the index of the next page in query.
	 *
	 * @return Index of next page. 
	 * @throws Error if no more pages exist.
	 */
	this.nextPage = function() {
		return mChunkSize * (currentPage++);
	};
};