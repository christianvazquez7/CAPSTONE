/**
 * This module creates and draws the grids for the zones in the map.
 */
 
module.exports = function ZoneManager() {

	/**
	 * Module imports.
	 */
	var turf = require('../../node_modules/turf');
	
	/**
	 * Gets the color for a risk level classification.
	 *
	 * @param level: (int) the risk level classification
	 * @return String: the level's color in hexadecimal
	 */
	function getLevelColor(level) {
		var color;
  		switch(level) {
  			case 1:
  				color = '#389D26';
				break;

			case 2:
				color = '#46C0AC';
                break;
			
			case 3:
				color = '#4C9EBB';
				break;

			case 4:
				color = '#1A3971';
				break;

			case 5:
				color = '#2B1364';
				break;

			case 6:
				color = '#BEBEBE';
				break;

			case 7:
				color = '#F6FA2D';
				break;

			case 8:
				color = '#ECF33B';
				break;

			case 9:
				color = '#EC690E';
				break;

			case 10:
				color = '#F41E1F';
				break;

			default:
				color = 'grey';
				break;
		};
		return color;
	};

	this.getLevelColor_ = function(level) {
		return getLevelColor(level);
	}

	this.getGeoJson = function(zonesJson) {
		var features = [];
		for(var i = 0; i < zonesJson.length; i++) {
			var zoneLevel = zonesJson[i].level;
			var zoneColor = getLevelColor(zoneLevel);
			var polygon = turf.polygon(
 				zonesJson[i].loc.coordinates,
 				{ zone_id: zonesJson[i].zone_id,level: zoneLevel, totalCrime: zonesJson[i].totalCrime, color: zoneColor}
 			);
			features.push(polygon);
 		}
		
		return turf.featurecollection(features);
	}
};