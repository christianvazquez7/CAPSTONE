/**
 * Identifies the closest boundary to the next geo-zone and estimates 
 * the distance and time it will require to reach given boundary.
 */
 
module.exports = function ZoneAnalyzer() {
	
	/**
	 * Module imports.
	 */
	var GeoZone = require('./geoZone.js');
	var turf = require('turf');

	var mCurrentZone;
	var reference = {'NW':1, 'N':2, 'NE':3, 'W':4, 'L':5, 'E':6, 'SW':7, 'S':8, 'SE':9};

	/**
	 * Calculates time for next location request from Client
	 *
	 * @param velocity: Current Velocity of device
	 * @param location: Current location of device
	 * @param nearbyHigherRiskZones: List of higher risk zones surrounding the current location
	 * @return long containing time (in seconds) it will take to reach closest higher risk zone
	 */

	this.calculateTimeToZone = function(velocity,location,zonesCollection) {
		var mDistance = calculateDistance(location, zonesCollection);

		


		//Check if risk is higher in any of the surrounding zones

	};

	function getCurrentZoneIndex(location, zonesCollection){
		zonesCollection.forEach(function(geoZone,index){
			if(turf.inside(locationGeoJSON,geoZone)){
				mCurrentZone = geoZone;
				return index;
			}
		});
		//Error zone not found
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
	function calculateDistance(location, zonesCollection){
		var locationGeoJSON = turf.point([location.longitude, location.latitude]);	
		var nextZoneClosestPoint;
		var tempDistance;

		//Initialize to 200m
		var shortestDistance = 200;

		var zoneIndex = getCurrentZoneIndex(location,zonesCollection);
		var zonesFetchedCount = zonesCollection.count();

		//TODO: Check actual format to find risk of zone
		if(zonesFetchedCount == 4){
			switch(zoneIndex) {

    			case 0: /*Current zone is in the NW corner of the grid*/
        			//Calculate distance to closest HR zone E
        			if(zonesCollection[1].risk > mCurrentZone.risk){
        				tempDistance = distanceToZone(locationGeoJSON, zonesCollection[1], reference.E);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest HR zone S
        			if(zonesCollection[2].risk > mCurrentZone.risk){
        				tempDistance = distanceToZone(locationGeoJSON, zonesCollection[2], reference.S);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;
        			}
        			//Calculate distance to closest zone SE
        			if(zonesCollection[3].risk > mCurrentZone.risk){
        				tempDistance = distanceToZone(locationGeoJSON, zonesCollection[3], reference.SE);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;
        			}
        			else{
        				//TODO: Default distance
        			}
           			break;

     			case 1: /*Current zone is in NE corner of the grid*/
					//Calculate distance to closest zone W
        			if(zonesCollection[0].risk > mCurrentZone.risk){
        				tempDistance = distanceToZone(locationGeoJSON, zonesCollection[0], reference.W);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone SW
        			if(zonesCollection[2].risk > mCurrentZone.risk){
        				tempDistance = distanceToZone(locationGeoJSON, zonesCollection[2], reference.SW);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone S
        			if(zonesCollection[3].risk > mCurrentZone.risk){
        				tempDistance = distanceToZone(locationGeoJSON, zonesCollection[3], reference.S);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			else{
        				//TODO: Default time
        			}
					break;
     			
     			case 2: /*Current zone is in SW corner of the grid*/
           			//Calculate distance to closest zone N
           			if(zonesCollection[0].risk > mCurrentZone.risk){
        				tempDistance = distanceToZone(locationGeoJSON, zonesCollection[0], reference.N);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone NE	
        			if(zonesCollection[1].risk > mCurrentZone.risk){
        				tempDistance = distanceToZone(locationGeoJSON, zonesCollection[1], reference.NE);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone E
        			if(zonesCollection[3].risk > mCurrentZone.risk){
        				tempDistance = distanceToZone(locationGeoJSON, zonesCollection[3], reference.E);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			else{
        				//TODO: Default distance
        			}
        			break;
        		case 3:
        			/*Current zone is in SE corner of the grid*/
        			//Calculate distance to closest zone NW
           			if(zonesCollection[0].risk > mCurrentZone.risk){
        				tempDistance = distanceToZone(locationGeoJSON, zonesCollection[0], reference.NW);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone N	
        			if(zonesCollection[1].risk > mCurrentZone.risk){
        				tempDistance = distanceToZone(locationGeoJSON, zonesCollection[1], reference.N);
        				shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;	
        			}
        			//Calculate distance to closest zone W
        			if(zonesCollection[2].risk > mCurrentZone.risk){
        				tempDistance = distanceToZone(locationGeoJSON, zonesCollection[2], reference.W);
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

			//TODO: Check if zone has higher risk
			switch(zoneIndex) {
    			case 1:
        			/*Current zone is in N border of the grid*/
        			for(tempIndex = 0, referenceIndex = 4; tempIndex < 6; tempIndex++, referenceIndex++){
        				if(referenceIndex != reference.L && zonesCollection[tempIndex].risk > mCurrentZone.risk){
        					tempDistance = distanceToZone(locationGeoJSON, zonesCollection[tempIndex], referenceIndex);
        					shortestDistance = tempDistance < shortestDistance ? tempDistance : shortestDistance;
        				}
        			}
        			break;
     			case 2:
        			/* Current zone is in W border of the grid */
        			for(tempIndex = 0, referenceIndex = 2; tempIndex < 6; tempIndex++, referenceIndex++){
        				if(referenceIndex != reference.L && zonesCollection[tempIndex].risk > mCurrentZone.risk){        				
        					tempDistance = distanceToZone(locationGeoJSON, zonesCollection[tempIndex], referenceIndex);
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
        				if(referenceIndex != reference.L && zonesCollection[tempIndex].risk > mCurrentZone.risk){
        					tempDistance = distanceToZone(locationGeoJSON, zonesCollection[tempIndex], referenceIndex);
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
        				if(referenceIndex != reference.L && zonesCollection[tempIndex].risk > mCurrentZone.risk){        				
        					tempDistance = distanceToZone(locationGeoJSON, zonesCollection[tempIndex], referenceIndex);
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
        		if(referenceIndex != reference.L && zonesCollection[tempIndex].risk > mCurrentZone.risk){        				
      				tempDistance = distanceToZone(locationGeoJSON, zonesCollection[tempIndex], referenceIndex);
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
		switch(reference){
			case reference.NW:
				GeoZoneToAnalyze.coordinates[0][]
				break;
			case reference.N:
				break;
			case reference.NE:
				break;
			case reference.W:
				break;
			case reference.E:
				break;
			case reference.SW:
				break;
			case reference.S:
				break;
			case reference.SE:
				break;

		}
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