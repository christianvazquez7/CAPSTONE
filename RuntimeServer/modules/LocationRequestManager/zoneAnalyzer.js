/**
 * Analyzes a zone by identigying the current zone where user in a set of zones,
 * identifying the shortest distance to a higher risk zone (or lower if specified
 * by user), and estimating the time it will take to reach given zone. 
 */
 
module.exports = function ZoneAnalyzer() {
	
	/**
	 * Module imports.
	 */
	var turf = require('turf');
    var zoneSize = 200; 	

	var reference = {'NW':1, 'N':2, 'NE':3, 'W':4, 'L':5, 'E':6, 'SW':7, 'S':8, 'SE':9};
    var that = this;
    var minTimeForResponse = 1;
    var logger = require('../../utils/logger.js');


	/**
	 * Calculates time for next location request from Client finding an estimate time to reach the closest
	 * higher risk zone or obtaining a default time in case the are no higher risk zone surrounding the area.
	 * //Zones sorted by longitude (increasing) and by latitude (decreasing)
	 * @param speed: Current speed of device
	 * @param location: Current location of device
	 * @param nearbyHigherRiskZones: List of higher risk zones surrounding the current location
	 * @return long containing time (in seconds) it will take to reach closest higher risk zone
	 */
	this.calculateTimeToHRZone = function(speed,locationGeoJSON, zonesToAnalyze, negDelta, errCallback) {            
            if (typeof(speed) == 'undefined' || speed == null || speed < 0){
                return 1;
            }
            var mDistance = getDistance(locationGeoJSON, zonesToAnalyze, negDelta, errCallback);
            
            if(speed >= 0 && speed <= 1){
                if(mDistance < 1){
                    return 1;
                }
                return mDistance;
            }
            if(speed > 50){
                if(mDistance < 1){
                    return 1;
                }
                return mDistance;
            }

            var time = mDistance/speed;

            if(time < 1){
                return 1;
            }
            //logger.log('info', 'Time: ' + time);
            return time;
	};

	this.getCurrentZone = function(locationGeoJSON, zonesToAnalyze) {
        for(var i = 0; i < zonesToAnalyze.length; i++){
            var poly = turf.polygon([zonesToAnalyze[i].loc.coordinates[0]]); 
            if(turf.inside(locationGeoJSON,poly)) {
                return zonesToAnalyze[i];
            }
        }
        return null;
	};

	 function getCurrentZoneIndex(locationGeoJSON, zonesToAnalyze){
        for(var i = 0; i < zonesToAnalyze.length; i++){
            var poly = turf.polygon([zonesToAnalyze[i].loc.coordinates[0]]); 
            if(turf.inside(locationGeoJSON, poly)) {
                return i;
            }
        }
        return null;
	};
	
	
	
	/**
	 * Calculates distance to closest higher risk zone
	 * 
	 */
	function getDistance(locationGeoJSON,zonesToAnalyze, negDelta, errorCallback){

		var tempDistance;

		//Initialize default distance to geo zone size 
		var shortestDistance = zoneSize;

		var zoneIndex = getCurrentZoneIndex(locationGeoJSON, zonesToAnalyze);

        var currentZone = that.getCurrentZone(locationGeoJSON, zonesToAnalyze);


        if(currentZone == null){
            errorCallback(new Error('Zone not found')); 
            return;
        }
        if(zoneIndex == null){
            errorCallback(new Error('Index not found')); 
            return;
        }
            

		var zonesFetchedCount = zonesToAnalyze.length;

		if(zonesFetchedCount == 4){
			switch(zoneIndex) {

    			case 0: /*Current zone is in the NW corner of the grid*/
        			//Calculate distance to closest HR zone E
        			if( (zonesToAnalyze[1].level > currentZone.level) || ((negDelta) && (zonesToAnalyze[1].level != currentZone.level)) ){
        				tempDistance = distanceToZone(locationGeoJSON, zonesToAnalyze[1], reference.E);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest HR zone S
        			if( (zonesToAnalyze[2].level > currentZone.level) || ((negDelta) && (zonesToAnalyze[2].level != currentZone.level)) ){
        				tempDistance = distanceToZone(locationGeoJSON, zonesToAnalyze[2], reference.S);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;
        			}
        			//Calculate distance to closest zone SE
        			if( (zonesToAnalyze[3].level > currentZone.level) || ((negDelta) && (zonesToAnalyze[3].level != currentZone.level)) ){
        				tempDistance = distanceToZone(locationGeoJSON, zonesToAnalyze[3], reference.SE);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;
        			}
           			break;

     			case 1: /*Current zone is in NE corner of the grid*/
					//Calculate distance to closest zone W
        			if((zonesToAnalyze[0].level > currentZone.level) || ((negDelta) && (zonesToAnalyze[0].level != currentZone.level)) ){
        				tempDistance = distanceToZone(locationGeoJSON, zonesToAnalyze[0], reference.W);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone SW
        			if((zonesToAnalyze[2].level > currentZone.level) || ((negDelta) && (zonesToAnalyze[2].level != currentZone.level)) ){
        				tempDistance = distanceToZone(locationGeoJSON, zonesToAnalyze[2], reference.SW);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone S
        			if((zonesToAnalyze[3].level > currentZone.level) || ((negDelta) && (zonesToAnalyze[3].level != currentZone.level)) ){
        				tempDistance = distanceToZone(locationGeoJSON, zonesToAnalyze[3], reference.S);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
					break;
     			
     			case 2: /*Current zone is in SW corner of the grid*/
           			//Calculate distance to closest zone N
           			if( (zonesToAnalyze[0].level > currentZone.level) || ((negDelta) && (zonesToAnalyze[0].level != currentZone.level))  ){
        				tempDistance = distanceToZone(locationGeoJSON, zonesToAnalyze[0], reference.N);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone NE	
        			if( (zonesToAnalyze[1].level > currentZone.level) || ((negDelta) && (zonesToAnalyze[1].level != currentZone.level)) ){
        				tempDistance = distanceToZone(locationGeoJSON, zonesToAnalyze[1], reference.NE);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone E
        			if( (zonesToAnalyze[3].level > currentZone.level) || ((negDelta) && (zonesToAnalyze[3].level != currentZone.level)) ){
        				tempDistance = distanceToZone(locationGeoJSON, zonesToAnalyze[3], reference.E);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
                    break;
        		case 3: /*Current zone is in SE corner of the grid*/
        			//Calculate distance to closest zone NW
           			if( (zonesToAnalyze[0].level > currentZone.level) || ( (negDelta) && (zonesToAnalyze[0].level != currentZone.level) ) ){
        				tempDistance = distanceToZone(locationGeoJSON, zonesToAnalyze[0], reference.NW);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone N	
        			if( (zonesToAnalyze[1].level > currentZone.level) || ( (negDelta) && (zonesToAnalyze[1].level != currentZone.level) ) ){
        				tempDistance = distanceToZone(locationGeoJSON, zonesToAnalyze[1], reference.N);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone W
        			if( (zonesToAnalyze[2].level > currentZone.level) || ( (negDelta) && (zonesToAnalyze[2].level != currentZone.level) ) ){
        				tempDistance = distanceToZone(locationGeoJSON, zonesToAnalyze[2], reference.W);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;
        			}
        			break;
        		default:
        			errorCallback(new Error('Wrong index')); 
					
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
        				if((referenceIndex != reference.L) && ( (zonesToAnalyze[tempIndex].level > currentZone.level) || (negDelta && (zonesToAnalyze[tempIndex].level != currentZone.level)))){
        					tempDistance = distanceToZone(locationGeoJSON, zonesToAnalyze[tempIndex], referenceIndex);
        					shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;
        				}
        			}
        			break;
     			case 2:
        			/* Current zone is in W border of the grid */
        			for(tempIndex = 0, referenceIndex = 2; tempIndex < 6; tempIndex++, referenceIndex++){
        				if((referenceIndex != reference.L) && ( (zonesToAnalyze[tempIndex].level > currentZone.level) || (negDelta && (zonesToAnalyze[tempIndex].level != currentZone.level)))){        				
        					tempDistance = distanceToZone(locationGeoJSON, zonesToAnalyze[tempIndex], referenceIndex);
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
        				if((referenceIndex != reference.L) && ( (zonesToAnalyze[tempIndex].level > currentZone.level) || (negDelta && (zonesToAnalyze[tempIndex].level != currentZone.level)))){
        					tempDistance = distanceToZone(locationGeoJSON, zonesToAnalyze[tempIndex], referenceIndex);
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
        				if((referenceIndex != reference.L) && ( (zonesToAnalyze[tempIndex].level > currentZone.level) || (negDelta && (zonesToAnalyze[tempIndex].level != currentZone.level)))){        				
        					tempDistance = distanceToZone(locationGeoJSON, zonesToAnalyze[tempIndex], referenceIndex);
        					shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;
        				}
        			}
        			break;
        		default:
        			errorCallback(new Error('Incorrect sorting of zones')); 
 			}
            return shortestDistance; 
		}
		else if((zonesFetchedCount == 9) && (zoneIndex==4)){
			for(tempIndex = 0, referenceIndex = 1; tempIndex < 9; tempIndex++, referenceIndex++){
        		if((referenceIndex != reference.L) && ( (zonesToAnalyze[tempIndex].level > currentZone.level) || (negDelta && (zonesToAnalyze[tempIndex].level != currentZone.level)))){        				
      				tempDistance = distanceToZone(locationGeoJSON, zonesToAnalyze[tempIndex], referenceIndex);
      				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;
   				}
        	}
		}
		else{
			errorCallback(new Error('Zones fetched incorrectly')); 
		}
        return shortestDistance;
	};
	
	function distanceToZone(locationGeoJSON, GeoZoneToAnalyze, zoneReference){
		var closestPointInZone;
/*        console.log("---------------------------------------------------");
        console.log("Reference to location: " + zoneReference);
        console.log("Geozone to analyze: ");
        console.log(GeoZoneToAnalyze);
        console.log("loc: ");
        console.log(locationGeoJSON);
*/
		switch(zoneReference){
			case reference.NW:
				//Measure distance to SE corner of the zone
				closestPointInZone = turf.point([GeoZoneToAnalyze.loc.coordinates[0][3][0], GeoZoneToAnalyze.loc.coordinates[0][3][1]]);
//                console.log("\nRef NW");
				break;
			case reference.N:
				//Measure distance to S boundary of the zone
				closestPointInZone = turf.point([locationGeoJSON.geometry.coordinates[0], GeoZoneToAnalyze.loc.coordinates[0][0][1]]);
//                console.log("\nRef N");
				break;
			case reference.NE:
				//Measure distance to SE corner of the zone
				closestPointInZone = turf.point([GeoZoneToAnalyze.loc.coordinates[0][0][0], GeoZoneToAnalyze.loc.coordinates[0][0][1]]);
//                console.log("\nRef NE");
				break;
			case reference.W:
				//Measure distance to E boundary of the zone
				closestPointInZone = turf.point([GeoZoneToAnalyze.loc.coordinates[0][2][0], locationGeoJSON.geometry.coordinates[1]]);
//                console.log("\nRef W");
				break;
			case reference.E:
				//Measure distance to W boundary of the zone
				closestPointInZone = turf.point([GeoZoneToAnalyze.loc.coordinates[0][0][0], locationGeoJSON.geometry.coordinates[1]]);
//                console.log("\nRef E");
				break;
			case reference.SW:
				//Measure distance to NE corner of the zone
				closestPointInZone = turf.point([GeoZoneToAnalyze.loc.coordinates[0][2][0], GeoZoneToAnalyze.loc.coordinates[0][2][1]]);
//				console.log("\nRef SW");
                break;
			case reference.S:
				//Measure distance to N boundary of the zone
				closestPointInZone = turf.point([locationGeoJSON.geometry.coordinates[0], GeoZoneToAnalyze.loc.coordinates[0][1][1]]);
//				console.log("\nRef S");
                break;
			case reference.SE:
				//Measure distance to NE corner of the zone
				closestPointInZone = turf.point([GeoZoneToAnalyze.loc.coordinates[0][1][0],GeoZoneToAnalyze.loc.coordinates[0][1][1]]);
//				console.log("Ref SE");
                break;
			default:
				//TODO: Error
			}

            var distanceToClosestZone = turf.distance(locationGeoJSON, closestPointInZone, 'kilometers')*1000;
			return distanceToClosestZone;
	}
};