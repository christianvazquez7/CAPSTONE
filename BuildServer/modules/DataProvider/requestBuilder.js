/**
 * Builds http requests for SODA API.
 */
module.exports = function RequestBuilder(pSource, pToken, pResource, marshall) {

	var Request = require('./request.js');
	var source = pSource;
	var token = pToken;
	var resource = pResource;
	var start;
	var end;
	var offset;
	var increasing;
	var limit;


	/**
	 * Specifies the start date for crime lookup.
	 *
	 * @param startString: Start date of crime interval.
	 */
	this.start = function(startString) {
		start = startString;
		return this;
	};

	/**
	 * Specifies the end date for crime lookup.
	 *
	 * @param endString: End date of crime interval.
	 */
	this.end = function(endString) {
		end = endString;
		return this;
	};

	/**
	 * Specifies the page to be fetched.
	 *
	 * @param offsetString: Page number of query result.
	 */
	this.offset = function(offsetString) {
		offset = offsetString;
		return this;
	};

	this.increasing = function(isIncreasing) {
		increasing = isIncreasing;
		return this;
	};

	this.limit = function(pLimit) {
		limit = pLimit;
		return this;
	};

	/**
	 * Creates the query string.
	 *
	 * @return The query string to the remote SODA service.
	 */
	this.build =  function() {
		var where;

		if (end === undefined && start === undefined) {

		} else {
			if (end !== undefined && start !== undefined ) {
				where = marshall.getDateLabel() + " >= " + "'" + start + "'" + " AND " + marshall.getDateLabel() + " <= " + "'" + end + "'";
			} else if (end === undefined) {
				where = marshall.getDateLabel() + " >= " + "'" + start + "'";
			} else if (start === undefined) {
				where = marshall.getDateLabel() + " <= " + "'" + end + "'";
			}
		}

		var order;
		if(increasing !== undefined) {
			if(increasing) {
				order = marshall.getDateLabel() + " ASC";
			} else {
				order = marshall.getDateLabel() + " DESC";
			}
		}

		var request = new Request(source, resource, token, where, order, offset, limit);

		start = undefined;
		end = undefined;
		offset = undefined;
		increasing = undefined;
		limit = undefined;

		return request;
	};

};