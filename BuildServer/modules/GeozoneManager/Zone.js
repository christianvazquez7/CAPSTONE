/**
 * The zone class contains the polygon and the unique ID of the zone
 */

/**
 * Module Import
 */
geoCoordinate = require('./geoCoordinate.js');

module.exports = function GeoCoordinate (polygon, id) {

	var zoneID = id;
	var topLeft = new geoCoordinate(polygon.topLeft_latitude, polygon.topLeft_longitude);
	var topRight = new geoCoordinate(polygon.topRight_latitude, polygon.topRight_longitude);
	var bottomRight = new geoCoordinate(polygon.bottomRight_latitude, polygon.bottomRight_longitude);
	var bottomLeft = new geoCoordinate(polygon.bottomLeft_latitude, polygon.bottomLeft_longitude);
	var area = polygon.area;

	/**
	 * This method return the coordinate of the top left corner of the zone.
	 * @return Return the top right corner of the zone
	 */
	this.getTopLeftCoordinate = function() {
		return JSON.parse('{"latitude": ' + topLeft.getLatitude() + ', "longitude":' + topLeft.getLongitude() + '}');
	}

	/**
	 * This method return the coordinate of the top right corner of the zone.
	 * @return Return the top right corner of the zone
	 */
	this.getTopRightCoordinate = function() {
		return JSON.parse('{"latitude": ' + topRight.getLatitude() + ', "longitude":' + topRight.getLongitude() + '}');
	}

	/**
	 * This method return the coordinate of the bottom right corner of the zone.
	 * @return Return the bottom right corner of the zone
	 */
	 this.getBottomRightCoordinate = function() {
	 	return JSON.parse('{"latitude": ' + bottomRight.getLatitude() + ', "longitude":' + bottomRight.getLongitude() + '}');
	 }

	/**
	 * This method return the coordinate of the bottom left corner of the zone.
	 * @return Return the bottom left corner of the zone
	 */
	 this.getBottomLeftCoordinate = function() {
	 	return JSON.parse('{"latitude": ' + bottomLeft.getLatitude() + ', "longitude":' + bottomLeft.getLongitude() + '}');
	 }

	 /**
	  * This method return the ID of the zone
	  * @return Return the zone ID
	  */
	  this.getZoneID = function() {
	  	return zoneID;
	  }

	  this.getArea = function() {
	  	return area;
	  }
}