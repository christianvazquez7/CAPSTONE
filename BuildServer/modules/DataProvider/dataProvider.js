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
	var conString = "postgres://postgres:Aguaseka7!@localhost/KYAUtility";
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
	 * Initialize the data provider.
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
				if(result.length > 0) {
					console.log('closing');
					console.log(result.rows[0]);
					mLastPage = result.rows[0].lastpage;
					mLastOffset = result.rows[1].lastoffset;
				}
				mPgClient.end();

				mRequestHandler.init(onProviderReady, onRecords , onEnd, source, appToken,resource, mChunk, mMarshall, mLastPage, mLastOffset, start, end);
			});

		});
	};


	/**
	 * Requests data from the remote service. Forwards request to request handler.
	 * Data will be return asynchronously in callback passed as parameter.
	 *
	 * @param callback: Callback to which data will be returned as a list of Crimes.
	 * @param chunkSize: Size of requested data.
	 * @param lastRecordId: Id of last crime processed.
	 * @param lastRecordDate: Date of last crime processed.
	 */
	this.getData = function(dataCallback,endCallback) {
		mUserEndCallback = endCallback;
		mUserDataCallback = dataCallback;
		mScheduler.addRequest();
		mRequestHandler.requestData();
	};

	function onRecords(records) {
		mUserDataCallback(records);
		that.getData(mUserDataCallback,mUserEndCallback);
	}

	function onEnd() {
		mUserEndCallback();
	}

	this.setChunkSize = function(size) {
		if (mChunk > 1000) {
			console.log('Error: SODA only permits a maximum chunk of 1000');
			return;
		}
		mChunk = size;
	};
};