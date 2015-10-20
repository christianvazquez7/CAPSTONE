/**
 * Identifies the closest boundary to the next geo-zone and estimates 
 * the distance and time it will require to reach given boundary.
 */
 
module.exports = function ZoneAnalyzer() {
	
	/**
	 * Module imports.
	 */
	var GeoZone = require('./geoZone.js');
	var turf = require('../../node_modules/turf');
	

	var mCurrentZone;
	var mZonesToAnalyze;
	var reference = {'NW':1, 'N':2, 'NE':3, 'W':4, 'L':5, 'E':6, 'SW':7, 'S':8, 'SE':9};

	

	this.analyzeZones = function (zonesToAnalyze){
		mZonesToAnalyze = zonesToAnalyze;
	};

	/**
	 * Calculates time for next location request from Client finding an estimate time to reach the closest
	 * higher risk zone or obtaining a default time in case the are no higher risk zone surrounding the area.
	 *
	 * @param velocity: Current Velocity of device
	 * @param location: Current location of device
	 * @param nearbyHigherRiskZones: List of higher risk zones surrounding the current location
	 * @return long containing time (in seconds) it will take to reach closest higher risk zone
	 */
	this.calculateTimeToHRZone = function(velocity,location) {
        var locationGeoJSON = turf.point([location.longitude, location.latitude]);
		var mDistance = getDistance(locationGeoJSON, mZonesToAnalyze);
		return mDistance/velocity;
	};

	this.getCurrentZone = function(){
		return mCurrentZone;	
	};

	function getCurrentZoneIndex(locationGeoJSON, mZonesToAnalyze){
		mZonesToAnalyze.forEach( function(geoZone,index){
			if(turf.inside(locationGeoJSON,geoZone)){
				mCurrentZone = geoZone;
				return index;
			}
		});
		//Error zone not found
	};
	
	
	
	/**
	 * Calculates distance to closest higher risk zone
	 * 
	 */
	function getDistance(locationGeoJSON, mZonesToAnalyze){
		
		var nextZoneClosestPoint;
		var tempDistance;

		//Initialize to 200m
		var shortestDistance = 200;

		var zoneIndex = getCurrentZoneIndex(location,mZonesToAnalyze);
		var zonesFetchedCount = mZonesToAnalyze.length;

		//TODO: Check actual format to find risk of zone
		if(zonesFetchedCount == 4){
			switch(zoneIndex) {

    			case 0: /*Current zone is in the NW corner of the grid*/
        			//Calculate distance to closest HR zone E
        			if(mZonesToAnalyze[1].level > mCurrentZone.level){
        				tempDistance = distanceToZone(locationGeoJSON, mZonesToAnalyze[1], reference.E);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest HR zone S
        			if(mZonesToAnalyze[2].level > mCurrentZone.level){
        				tempDistance = distanceToZone(locationGeoJSON, mZonesToAnalyze[2], reference.S);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;
        			}
        			//Calculate distance to closest zone SE
        			if(mZonesToAnalyze[3].level > mCurrentZone.level){
        				tempDistance = distanceToZone(locationGeoJSON, mZonesToAnalyze[3], reference.SE);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;
        			}
        			else{
        				//TODO: Default distance
        			}
           			break;

     			case 1: /*Current zone is in NE corner of the grid*/
					//Calculate distance to closest zone W
        			if(mZonesToAnalyze[0].level > mCurrentZone.level){
        				tempDistance = distanceToZone(locationGeoJSON, mZonesToAnalyze[0], reference.W);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone SW
        			if(mZonesToAnalyze[2].level > mCurrentZone.level){
        				tempDistance = distanceToZone(locationGeoJSON, mZonesToAnalyze[2], reference.SW);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone S
        			if(mZonesToAnalyze[3].level > mCurrentZone.level){
        				tempDistance = distanceToZone(locationGeoJSON, mZonesToAnalyze[3], reference.S);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			else{
        				//TODO: Default time
        			}
					break;
     			
     			case 2: /*Current zone is in SW corner of the grid*/
           			//Calculate distance to closest zone N
           			if(mZonesToAnalyze[0].level > mCurrentZone.level){
        				tempDistance = distanceToZone(locationGeoJSON, mZonesToAnalyze[0], reference.N);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone NE	
        			if(mZonesToAnalyze[1].level > mCurrentZone.level){
        				tempDistance = distanceToZone(locationGeoJSON, mZonesToAnalyze[1], reference.NE);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone E
        			if(mZonesToAnalyze[3].level > mCurrentZone.level){
        				tempDistance = distanceToZone(locationGeoJSON, mZonesToAnalyze[3], reference.E);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			else{
        				//TODO: Default distance
        			}
        			break;
        		case 3:
        			/*Current zone is in SE corner of the grid*/
        			//Calculate distance to closest zone NW
           			if(mZonesToAnalyze[0].level > mCurrentZone.level){
        				tempDistance = distanceToZone(locationGeoJSON, mZonesToAnalyze[0], reference.NW);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone N	
        			if(mZonesToAnalyze[1].level > mCurrentZone.level){
        				tempDistance = distanceToZone(locationGeoJSON, mZonesToAnalyze[1], reference.N);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone W
        			if(mZonesToAnalyze[2].level > mCurrentZone.level){
        				tempDistance = distanceToZone(locationGeoJSON, mZonesToAnalyze[2], reference.W);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;
        			}
        			else{
        				//TODO: Default distance
        			}
        			break;
        		default:
        			//TODO: Error fetching zones
					//Incorrect sorting of zones
 			}
 			return shortestDistance; 
		}
		else if(zonesFetchedCount == 6){
			var referenceIndex,
				tempIndex;

			switch(zoneIndex) {
    			case 1:
        			/*Current zone is in N border of the grid*/
        			for(tempIndex = 0, referenceIndex = 4; tempIndex < 6; tempIndex++, referenceIndex++){
        				if(referenceIndex != reference.L && mZonesToAnalyze[tempIndex].level > mCurrentZone.level){
        					tempDistance = distanceToZone(locationGeoJSON, mZonesToAnalyze[tempIndex], referenceIndex);
        					shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;
        				}
        			}
        			break;
     			case 2:
        			/* Current zone is in W border of the grid */
        			for(tempIndex = 0, referenceIndex = 2; tempIndex < 6; tempIndex++, referenceIndex++){
        				if(referenceIndex != reference.L && mZonesToAnalyze[tempIndex].level > mCurrentZone.level){        				
        					tempDistance = distanceToZone(locationGeoJSON, mZonesToAnalyze[tempIndex], referenceIndex);
        					shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        				}
        				if(referenceIndex == reference.NE || referenceIndex == reference.E){
        						referenceIndex ++;
        				}        					        					
        			}
        			break;
     			case 3:
        			/*Current zone is in E border of the grid*/
        			for(tempIndex = 0, referenceIndex = 1; tempIndex < 6; tempIndex++, referenceIndex++){
        				if(referenceIndex != reference.L && mZonesToAnalyze[tempIndex].level > mCurrentZone.level){
        					tempDistance = distanceToZone(locationGeoJSON, mZonesToAnalyze[tempIndex], referenceIndex);
        					shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	      					        					
        				}
        				if(referenceIndex == reference.N || referenceIndex == reference.L){
        						referenceIndex ++;
        				}  
        			}
        			break;
        		case 4:
        			/*Current zone is in S border of the grid*/
        			for(tempIndex = 0, referenceIndex = 1; tempIndex < 6; tempIndex++, referenceIndex++){
        				if(referenceIndex != reference.L && mZonesToAnalyze[tempIndex].level > mCurrentZone.level){        				
        					tempDistance = distanceToZone(locationGeoJSON, mZonesToAnalyze[tempIndex], referenceIndex);
        					shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;
        				}
        			}
        			break;
        		default:
        			//TODO: Error fetching zones
					//Incorrect sorting of zones
 			} 
		}
		else if((zonesFetchedCount == 9) && (zoneIndex==5)){
			for(tempIndex = 0, referenceIndex = 1; tempIndex < 9; tempIndex++, referenceIndex++){
        		if(referenceIndex != reference.L && mZonesToAnalyze[tempIndex].level > mCurrentZone.level){        				
      				tempDistance = distanceToZone(locationGeoJSON, mZonesToAnalyze[tempIndex], referenceIndex);
      				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;
   				}
        	}
		}
		else{
			//TODO
			//Error fetching zones
			//Incorrect number of zones fetched
		}
	}
	
	function distanceToZone(locationGeoJSON, GeoZoneToAnalyze, reference){
		var closestPointInZone;
		switch(reference){
			case reference.NW:
				//Measure distance to SE corner of the zone
				closestPointInZone = turf.point([GeoZoneToAnalyze.loc.coordinates[0][2][0], [GeoZoneToAnalyze.loc.coordinates[0][2][1]]);
				break;
			case reference.N:
				//Measure distance to S boundary of the zone
				closestPointInZone = turf.point(locationGeoJSON.coordinates[0], [GeoZoneToAnalyze.loc.coordinates[0][2][1]]);
				break;
			case reference.NE:
				//Measure distance to SE corner of the zone
				closestPointInZone = turf.point([GeoZoneToAnalyze.loc.coordinates[0][3][0]], [GeoZoneToAnalyze.loc.coordinates[0][3][1]]);
				break;
			case reference.W:
				//Measure distance to E boundary of the zone
				closestPointInZone = turf.point([GeoZoneToAnalyze.loc.coordinates[0][2][0], locationGeoJSON.coordinates[1]);
				break;
			case reference.E:
				//Measure distance to W boundary of the zone
				closestPointInZone = turf.point([GeoZoneToAnalyze.loc.coordinates[0][0][0], locationGeoJSON.coordinates[1]);
				break;
			case reference.SW:
				//Measure distance to NE corner of the zone
				closestPointInZone = turf.point([GeoZoneToAnalyze.loc.coordinates[0][1][0],[GeoZoneToAnalyze.loc.coordinates[0][1][1]);
				break;
			case reference.S:
				//Measure distance to N boundary of the zone
				closestPointInZone = turf.point(locationGeoJSON.coordinates[0], [GeoZoneToAnalyze.loc.coordinates[0][0][1]]);
				break;
			case reference.SE:
				//Measure distance to NE corner of the zone
				closestPointInZone = turf.point([GeoZoneToAnalyze.loc.coordinates[0][0][0],[GeoZoneToAnalyze.loc.coordinates[0][0][1]);
				break;
			default:
				//TODO: Error
			}

			return turf.distance(locationGeoJSON, closestPointInZone, 'kilometers');
	}
};