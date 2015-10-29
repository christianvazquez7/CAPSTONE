/**
 * Contains all elements necessary to perform a SODA request using the node-socrata
 * node module. Used as an abstraction to handle requests uniformly.
 */
module.exports = function Request(pSource,pResource,pToken,pWhere,pOrder,pOffset,pLimit){

	var where = pWhere;
	var limit = pLimit;
	var source = pSource;
	var resource = pResource;
	var token = pToken;
	var order = pOrder;
	var offset = pOffset;

	/**
	 * Determie if the request object has a limit of results per pages.
	 *
	 * @return True if a page limit has been defined. False otherwise.
	 */
	this.hasLimit = function() {
		return limit !== undefined;
	};

	/**
	 * Determie if the request object has a WHERE constraint defined.
	 *
	 * @return True if a WHERE constraint has been defined. False otherwise.
	 */
	this.hasWhere = function() {
		return where !== undefined;
	};

	/**
	 * Determie if the request object has an offset of the page that shoud be fetched.
	 *
	 * @return True if a page has a page offset. False otherwise.
	 */
	this.hasOffset = function() {
		return offset !== undefined;
	};

	/**
	 * Determie if the request object has a defined order (ASC or DESC).
	 *
	 * @return True if the request specifies order. False otherwise.
	 */
	this.hasOrder = function() {
		return order !== undefined;
	};

	/**
	 * Get the Limit parameter of the built request.
	 *
	 * @return Limit (chunk) of crimes within one page fetched from the request.
	 */
	this.getLimit = function() {
		return limit;
	};

	/**
	 * Get all defined WHERE constraints.
	 *
	 * @return A string defining the WHERE constraints for this request object.
	 */
	this.getWhere = function() {
		return where;
	};

	/**
	 * Get the offset (page) to fetch with this request.
	 *
	 * @return Number that specifies the page to be fetched.
	 */
	this.getOffset = function() {
		return offset;
	};

	/**
	 * Get the order of request.
	 *
	 * @return A string that defines the order of the request results ("ORDER BY ASC/DESC").
	 */
	this.getOrder = function() {
		return order;
	};

	/**
	 * Get the source from which this request will fetch from the external database.
	 *
	 * @return A string defining the SODA source for this request object.
	 */
	this.getSource = function() {
		return source;
	};

	/**
	 * Get the resource from which this request will fetch from the external SODA source.
	 *
	 * @return A string defining the SODA resource for this request object.
	 */
	this.getResource = function() {
		return resource;
	};

	/**
	 * Get the application token to be used for the SODA request.
	 *
	 * @return A string defining the SODA application for this request object.
	 */
	this.getToken = function() {
		return token;
	};
};