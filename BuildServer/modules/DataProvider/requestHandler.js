/**
 * Handles all requests to SODA server, notifies data provider when data
 * is ready. Delegates parsing to Crime class, paging to the Pager, and 
 * request building to the RequestBuilder.
 */
module.exports = function RequestHandler(chunk) {
	
	/**
	 * Module imports.
	 */
	var Crime = require('./crime.js');
	var MarshallBuilder = require('./marshallBuilder.js');
	var RequestBuilder = require('./requestBuilder.js');
	var Pager = require('./pager.js');

	var requestBuilder = new RequestBuilder();
	var Pager = new Pager(chunk);
	var dataCallback;

	/**
	 * Queries the SODA service to check if unprocessed records exist.
	 *
	 * @param source: SODA endpoint.
	 * @param lastCrimeId: Id of last crime processed.
	 * @param lastCrimeDate: Date of last crime processed.
	 * @return True if new data exists, false otherwise.
	 */
	this.hasNewData = function(source,lastCrimeId,lastCrimeDate) {

	};

	/**
	 * Queries the SODA service for new data.
	 *
	 * @param source: SODA endpoint.
	 * @param callback: Callback to notify when data is ready.
	 * @param marshall: Label translator for query.
	 * @param lastCrimeId: Id of last crime processed.
	 * @param lastCrimeDate: Date of last crime processed.
	 */
	this.requestData = function(source, callback, marshall, lastCrimeId, lastCrimeDate) {

	};

	/**
	 * Local callback for when queries are completed.
	 */
	function onDataRecieved(){

	};

};