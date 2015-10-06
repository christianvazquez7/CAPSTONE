module.exports = function Request(pSource,pResource,pToken,pWhere,pOrder,pOffset,pLimit){

	var where = pWhere;
	var limit = pLimit;
	var source = pSource;
	var resource = pResource;
	var token = pToken;
	var order = pOrder;
	var offset = pOffset;

	this.hasLimit = function() {
		return limit !== undefined;
	};

	this.hasWhere = function() {
		return where !== undefined;
	};

	this.hasOffset = function() {
		return offset !== undefined;
	};

	this.hasOrder = function() {
		return order !== undefined;
	};

	this.getLimit = function() {
		return limit;
	};

	this.getWhere = function() {
		return where;
	};

	this.getOffset = function() {
		return offset;
	};

	this.getOrder = function() {
		return order;
	};

	this.getSource = function() {
		return source;
	};

	this.getResource = function() {
		return resource;
	};

	this.getToken = function() {
		return token;
	};
};