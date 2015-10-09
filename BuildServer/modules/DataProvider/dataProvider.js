/**
 * The data provider module connects to a remote service through the SODA API.
 * It’s purpose is to “serially” extract data from this service, and structure
 * it into crime POJO’s. These are then made available to other modules to 
 * classify or cluster criminal areas. Its main components include:
 * 	
 *	a)Marshall
 *  b)Request Handler
 *  c)Scheduler
 *  d)Pager
 *  e)RequestBuilder
 */
module.exports = function DataProvider(source,limit) {

	/**
	 * Module imports.
	 */
	var Scheduler = require('./scheduler.js');
	var RequestHandler = require('./requestHandler.js');


	var mSrouce = source;
	var mLastProcessedId;
	var mLastProcessedDate;
	var mScheduler = new Scheduler(limit);
	var mRequestHandler = new RequestHandler();

	/**
	 * Requests data from the remote service. Forwards request to request handler.
	 * Data will be return asynchronously in callback passed as parameter.
	 *
	 * @param callback: Callback to which data will be returned as a list of Crimes.
	 * @param chunkSize: Size of requested data.
	 * @param lastRecordId: Id of last crime processed.
	 * @param lastRecordDate: Date of last crime processed.
	 */
	this.getData = function(callback,chunkSize,lastRecordId,lastRecordDate) {

	};

	/**
	 * Updates the last record in the KYA DB.
	 *
	 * @param lastRecordId: Id of last record processed.
	 * @param lastRecordDate: Date of last record processed.
	 * @param callback: Called when last record has been updated.
	 */
	function updateLastRecord(lastRecordId,lastRecordDate,callback) {

	};

	/**
	 * Fetch last record accessed from KYA DB.
	 *
	 * @param callback: Called when last record is fetched.
	 */
	function getLastRecordAccessed(callback) {

	};

	/**
	 * Callback for last record fetching.
	 *
	 * Proto message that contains id and date of last record processed.
	 */
	function onLastRecordFetched(proto) {

	};

	/**
	 * Callback for last record updating.
	 */
	function onLastRecordUpdated() {

	};
};