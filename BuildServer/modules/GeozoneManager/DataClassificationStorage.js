/**
 * DataClassificationStorage module is in charge of storing crime
 * data into a SQL database
 */

module.exports = function DataClassificationStorage () {

	var crimeCount
	var storage
	
	/**
	 * This method set on a query the zone to be increase
	 */
	this.setClassification = function(query) {


	}

	/**
	 * This method clears the column with the data accumulated.
	 * @return Return a boolean value if it was clear or not.
	 */
	this.dropClassification = function(callback) {

	}
}