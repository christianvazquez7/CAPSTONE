/**
 * Handles all requests to SODA server, notifies data provider when data
 * is ready or ended. Delegates parsing to Crime class, paging to the Pager, and 
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
	var mCurrentPage;
	
	/**
	 * Initializes the module to fetch data from an external source with a predefined schema.
	 * The request handler is initialized asynchronously. Any method call before onReady is
	 * triggered will result in undefined behavior. During initialization, the pager fetches
	 * paging information from the base request.
	 *
	 * @param onReady: Callback that will be triggered when the requestHandler is finished
	 * initialization.
	 * @param onRecordProcessed: Callback triggered every time a record is processed when
	 * request data is called.
	 * @param onLasRecordProcessed: Callback triggered when no records remain.
	 * @param source: The SODA source from which to obtain data.
	 * @param token: The SODA application token used for retrieval of data from the source.
	 * @param resource: The SODA dataset to access within the source.
	 * @param chunk: The size of the pages fetched from the  source (max 1000).
	 * @param marshall: The marshall to parse source labels to kya namespace.
	 * @param lastPage: The last page that was processed. This will be undefined if no pages,
	 * were processed. If this is not undefined, a previous fetching operation was interrupted
	 * and its state is being preserved.
	 * @param lastOffset: The last crime processed within the page. This will be undefined if no crime,
	 * were processed. If this is not undefined, a previous fetching operation was interrupted
	 * and its state is being preserved.
	 * @param start: Start date from where crimes should be fetched from. The format
	 * for this parameter is a string in the form of yyyy/mm/dd.
	 * @param end: End date from where crimes should be fetched. The format
	 * for this parameter is a string in the form of yyyy/mm/dd.
	 *
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
		mPager.init(baseRequest,onReady,onError);
	};

	/**
	 * Queries the SODA service for new data. It will fetch data of the next page defined by the pager.
	 * If no data remains to be fetched, the end callback will be trigerred for the caller, notifying 
	 * that all criminal data has been fetched.
	 */
	this.requestData = function() {
		if(mPager.hasNext()) {
			var nextPage = mPager.nextPage();
			mCurrentPage = mPager.getCurrentPage();
			var dataRequest = requestBuilder.start(mStart).end(mEnd).limit(mChunk).offset(nextPage).increasing(true).build();

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

	/**
	 * Local callback triggered when the SODA request has finished execution. If the query was succesful,
	 * the onDataRecieved will be called. Else, the onError will be called.
	 *
	 * @param err: Error that occured during request. If no error ocurred,
	 * this parameter will be null and OnError will be called.
	 * @param response: The response from the SODA service.
	 * @param data: The data fetched from the SODA source. This will be in
	 * JSON format, with labels still in the sources namespace.
	 */
	function onSodaResponse(err,response,data) {
		if(err !== null) {
			onError(err);
		} else {
			onDataRecieved(data);
		}
	}

	/**
	 * Error callback trigered if a SODA query was unsuccessful.
	 *
	 * @param err: The error object thrown by SODA request.
	 */
	function onError(err) {
		throw new Error('An error ocurred from the SODA server.');
	}

	/**
	 * Local callback for when queries are succesful. The dara will
	 * be parsed into crime objects using the marshall. In this method the translation
	 * between namespaces occurs. All crimes that have already been processed (defined by
	 * the persistent state in "lastPagePage" and "lastOffset") will be removed
	 * from the crime list.
	 */
	function onDataRecieved(data){
		var crimeList = Crime.fromList(data,mMarshall);
		if (mLastOffset !== undefined && mLastOffset !== null) {
			var splicedCrimeList = [];

			for (var i = mLastOffset + 1 ; i<crimeList.length ; i++) {
				crimeList[i].setPage(mCurrentPage);
				crimeList[i].setOffset(i);
				splicedCrimeList.push(crimeList[i]);
			}
			
			mOnRecordProcessed(splicedCrimeList);
			mLastOffset = undefined;
		} else {
			for (var i = 0 ; i < crimeList.length ; i++) {
				crimeList[i].setPage(mCurrentPage);
				crimeList[i].setOffset(i);
			}
			mOnRecordProcessed(crimeList);
		}
	}
};