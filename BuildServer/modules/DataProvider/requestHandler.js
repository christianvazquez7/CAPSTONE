/**
 * Handles all requests to SODA server, notifies data provider when data
 * is ready. Delegates parsing to Crime class, paging to the Pager, and 
 * request building to the RequestBuilder.
 */
module.exports = function RequestHandler() {
	
	/**
	 * Module imports.
	 */
	var Crime = require('./crime.js');
	var c = new Crime();
	var RequestBuilder = require('./requestBuilder.js');
	var Pager = require('./pager.js');
	var Socrata = require('node-socrata');



	var mPager = new Pager();
	var mMarshall;
	var mLastPage;
	var mLastOffset;
	var requestBuilder;
	var mStart;
	var mEnd;
	var mChunk;
	var dataCallback;
	var mSource;
	var baseRequest;
	var config;
	var soda;
	var mOnRecordProcessed;
	var mOnLastRecordProcessed;
	var self = this;
	
	/**
	 * Initializes the module to fetch data from an external source with a predefined schema.
	 */
	this.init = function(onReady,onRecordProcessed, onLastRecordProcessed,source,token,resource,chunk,marshall,lastPage,lastOffset,start,end) {
		mMarshall = marshall;
		requestBuilder = new RequestBuilder(source,token,resource,mMarshall);
		mStart = start;
		mEnd = end;
		mChunk = chunk;
		mSource = source;
		mOnRecordProcessed = onRecordProcessed;
		mOnLastRecordProcessed = onLastRecordProcessed;
		mLastPage = lastPage;
		mLastOffset = lastOffset;
		baseRequest = requestBuilder.start(mStart).end(mEnd).limit(chunk).increasing(true).build();

		if(lastPage !== undefined) {
			mPager.setLastPage(lastPage);
		}

		config = {
			hostDomain: baseRequest.getSource(),
			resource: baseRequest.getResource(),
			XAppToken: baseRequest.getToken()
		};

		soda = new Socrata(config);
		mPager.init(baseRequest,onReady);
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
	this.requestData = function() {
		console.log(mPager.hasNext());
		if(mPager.hasNext()) {
			var dataRequest = requestBuilder.start(mStart).end(mEnd).limit(mChunk).offset(mPager.nextPage()).increasing(true).build();

			var params = {
					$where: dataRequest.getWhere(),
					$limit: dataRequest.getLimit(),
					$offset: dataRequest.getOffset(),
					$order: dataRequest.getOrder()
			};
			soda.get(params,onSodaResponse);

		} else {
			mOnLastRecordProcessed();
		}
	};

	function onSodaResponse(err,response,data) {
		if(err !== null) {
			onError(err);
		} else {
			onDataRecieved(data);
		}
	}

	function onError(err) {
		console.log('An error ocurred fetching data from the SODA server');
	}

	/**
	 * Local callback for when queries are completed.
	 */
	function onDataRecieved(data){
		console.log('Parsing data fetched');
		var crimeList = Crime.fromList(data,mMarshall);
		console.log('fetched '+ crimeList.length + ' crimes...');
		if (mLastOffset !== undefined) {
			console.log('Removing unwanted elements from list.');
			var splicedCrimeList = [];
			for (var i = mLastOffset + 1 ; i<crimeList.length ; i++) {
				splicedCrimeList.push(crimeList[i]);
			}
			console.log('Notify subscriber...');
			mOnRecordProcessed(splicedCrimeList);
			self.requestData();
			mLastOffset = undefined;
		} else {
			console.log('Notify subscriber...');
			mOnRecordProcessed(crimeList);
			self.requestData();
		}
	}
};