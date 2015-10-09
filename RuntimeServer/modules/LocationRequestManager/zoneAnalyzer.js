/**
 * Identifies the closest boundary to the next geo-zone and estimates 
 * the distance and time it will require to reach given boundary.
 */
 
module.exports = function ZoneAnalyzer() {
	
	/**
	 * Module imports.
	 */
	var GeoZone = require('./geoZone.js');

	var mClosestZone;
	var mDistance;
	var mZoneList;
	var mLocation;
	var mVelocity;

	/**
	 * Calculates time for next location request from Client
	 *
	 * @param velocity: Current Velocity of device
	 * @param location: Current location of device
	 * @param nearbyHigherRiskZones: List of higher risk zones surrounding the current location
	 * @return long containing time (in seconds) it will take to reach closest higher risk zone
	 */
	this.calculateTimeToZone = function(velocity,location,nearbyHigherRiskZones) {
		
	};
	
	
	/**
	 * From the zones list it finds the closest higher risk zone to current location
	 * 
	 * @param nearbyHigherRiskZones: List of higher risk zones surrounding the current location
	 */
	function findClosestZone(nearbyHigherRiskZones){
		
	}
	
	/**
	 * Calculates distance to closest higher risk zone
	 * 
	 */
	function calculateDistance(){
		
	}
	
	/**
	 * Identifies if one of the nearby zones has a higher risk than the current zone
	 * 
	 * @param nearbyZones: List of zones around the current geo-zone
	 * @param currentZone: GeoZone object with that contains the current zone the device is in.
	 * @return If the risk increases it returns a list of the zones with higher risk, 
	 * otherwise it returns an empty list
	 */
	this.riskIncrease = function (nearbyZones, currentZone){
		
	}

};