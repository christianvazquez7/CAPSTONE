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
module.exports = function DataProvider(marshall) {

	/**
	 * Module imports.
	 */
	var Scheduler = require('./scheduler.js');
	var RequestHandler = require('./requestHandler.js');
	var pg = require('pg');

	//var conString = "postgres://postgres:Aguaseka7!@localhost/KYAUtility"; // Christian PostgreSQL Server
	var conString = "postgres://postgres:joel@localhost:5433/KYA"; // Joel PostgreSQL Server
	var mLastPage;
	var mLastOffset;
	var mRequestHandler = new RequestHandler();
	var mChunk = 1000;
	var mPgClient = new pg.Client(conString);
	var mUserDataCallback;
	var mUserEndCallback;
	var mMarshall = marshall;
	var that = this;
	var mScheduler = new Scheduler(1000,3600000,3600);

	
	/**
	 * Initialize the data provider. This occurs asynchronously as it prepares the 
	 * pager for operation. Any operation before the object is initialize will have
	 * undefined behavior. Initialization will recover session data from the local
	 * database, which includes the last page that was processed and the last offset
	 * within the next page that was processed. This will help the module retain
	 * state if operation is interrupted.
	 *
	 * @param onProviderReady: Callback object to trigger when the dataProvider has
	 * finished initialization succesfully.
	 * @param source: SODA source to fetch data from.
	 * @param appToken: Registered SODA token for the application.
	 * @param resource: Dataset to acces from the SODA source.
	 * @param start: Start date from where crimes should be fetched from. The format
	 * for this parameter is a string in the form of yyyy/mm/dd.
	 * @param end: End date from where crimes should be fetched. The format
	 * for this parameter is a string in the form of yyyy/mm/dd.
	 *
	 * Note: Start and date can be used in three different formats:
	 * 1) If start is defined but end is undefined it will fetch all crimes after
	 * start date inclusive.
	 * 2) If start is undefined and end is defined, all crimes below the end date 
	 * will be fetched (inclusive).
	 * 3) If both start and end are defined, the dataprovider will fetch crimes
	 * within the window defines by start and end with bounds inclusive.
	 */
	this.init = function(onProviderReady,source,appToken,resource,start,end) {
		mPgClient.connect(function(err) {
			if(err) {
				return console.error('could not connect to postgres', err);
			}
			mPgClient.query('SELECT * FROM utility', function(err, result) {
				if(err) {
					return console.error('error running query', err);
				}
				if(result.rows.length > 0) {
					mLastPage = result.rows[0].lastpage;
					mLastOffset = result.rows[0].lastoffset;
				}
				mPgClient.end();

				mRequestHandler.init(onProviderReady, onRecords , onEnd, source, appToken,resource, mChunk, mMarshall, mLastPage, mLastOffset, start, end);
			});

		});
	};


	/**
	 * Requests data from the remote service. Forwards request to request handler.
	 * Data will be return asynchronously in callback passed as parameter. This
	 * callback should be called for each pege. When you call this method and no
	 * crimes are left, the end callback will notify the caller that all the data
	 * has been fetched from the remote source.
	 *
	 * @param dataCallback: Callback to which data will be returned as a list of Crimes.
	 * @param endCallback: Callback to be called when the dataprovider is finished fetching
	 * all crimes within the constraints defined during initialization.
	 */
	this.getData = function(dataCallback,endCallback) {
		mUserEndCallback = endCallback;
		mUserDataCallback = dataCallback;
		mScheduler.addRequest();
		mRequestHandler.requestData();
	};

	/**
	 * Local callback from when the requestHandler has fetched data from the remote
	 * source.
	 *
	 * @param records: A list of crimes fetched from the remote soda source-resource
	 * pair. This lists will not include crimes that have already been processed
	 * as defined by the external database.
	 */
	function onRecords(records) {
		mUserDataCallback(records);
	}

	/**
	 * Local callback that is triggered when the requestHandler is finished processing
	 * crime records.
	 */
	function onEnd() {
		mUserEndCallback();
	}

	/**
	 * Sets the chunk size for the dataprovider. The default chunk size is 1000 which is also
	 * the maximum value assignable for a SODA API. The crimes fetched from the SODA source
	 * will be extracted in pages containg chunk amount of crimes.
	 *
	 * @param size: Size of pages at which the crimes should be fetched from the remote source.
	 */
	this.setChunkSize = function(size) {
		if (mChunk > 1000) {
			console.log('Error: SODA only permits a maximum chunk of 1000');
			return;
		}
		mChunk = size;
	};
};