/**
 * Builds http requests for SODA API.
 */
module.exports = function RequestBuilder() {
	var source;
	var start;
	var end;
	var offset;

	/**
	 * Specifies the http endpoint for the service.
	 *
	 * @param sourceString: Address to endpoint.
	 */
	this.source = function(sourceString) {
		source = sourceString;
		return this;
	};

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

	};

	/**
	 * Creates the query string.
	 *
	 * @return The query string to the remote SODA service.
	 */
	this.build =  function() {

	};

}