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
	 * Initialization is asynchronous. Any method invoked before the callback is
	 * triggered will result in undefined behavior.
	 *
	 * @param request: Request object that contains all element to perform the
	 * desired query for crime objects.
	 * @param callback: Called when query is succesful.
	 * @param onError: Callback trigerred if an error occurs during initialization.
	 * @return True if query was successful, false otherwise.
	 */
	this.init = function(request,callback,onError) {
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
			console.log('hereee');
			if(err !== null) {
				onError();
			}
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

	/**
	 * Gets the amount of pages for the initialized query. Default value is 0.
	 *
	 * @return Number of pages in query.
	 */
	this.getPages = function() {
		return numberOfPages;
	};

	/**
	 * Gets the current page that is being processed.
	 *
	 * @return Number of page that is currently being processed.
	 */
	this.getCurrentPage = function() {
		return currentPage;
	};

	/**
	 * Determines if all pages have been processed.
	 *
	 * @return True if more pages are still available. False otherwise.
	 */
	this.hasNext = function() {
		return currentPage < numberOfPages;
	};

	this.setLastPage = function(pageNumber) {
		currentPage = pageNumber;
	};

	/**
	 * Fetches the index of the next page in query.
	 *
	 * @return Index of next page. 
	 */
	this.nextPage = function() {
		return mChunkSize * (currentPage++);
	};
};