var unit = require('unit.js');
var ZoneManager = require('../zonesManager.js');

function getCorrectZoneColor() {
	var zoneManager = new ZoneManager();
	unit.value(zoneManager.getLevelColor_(1)).isEqualTo('#389D26');
	unit.value(zoneManager.getLevelColor_(2)).isEqualTo('#46C0AC');
	unit.value(zoneManager.getLevelColor_(3)).isEqualTo('#4C9EBB');
	unit.value(zoneManager.getLevelColor_(4)).isEqualTo('#1A3971');
	unit.value(zoneManager.getLevelColor_(5)).isEqualTo('#2B1364');
	unit.value(zoneManager.getLevelColor_(6)).isEqualTo('#BEBEBE');
	unit.value(zoneManager.getLevelColor_(7)).isEqualTo('#F6FA2D');
	unit.value(zoneManager.getLevelColor_(8)).isEqualTo('#ECF33B');
	unit.value(zoneManager.getLevelColor_(9)).isEqualTo('#EC690E');
	unit.value(zoneManager.getLevelColor_(10)).isEqualTo('#F41E1F');
}

function getIncorrectZoneColor() {
	var zoneManager = new ZoneManager();
	unit.value(zoneManager.getLevelColor_(11)).isEqualTo('grey');
	unit.value(zoneManager.getLevelColor_(0)).isEqualTo('grey');
}

function convertToGeoJson() {
	zones = [
		{ _id: '562cd83cf62d032440e6ce66',
	    zone_id: 159131,
	    level: 1,
	    totalCrime: '0',
	    loc: { type: 'Polygon', coordinates: [[ -66.47502795394774, 18.38916479752872 ],
	    									 [ -66.47502795394774, 18.39832743179517 ], 
	    									 [ -66.44412890609618, 18.39832743179517 ], 
	    									 [ -66.44412890609618, 18.38916479752872 ], 
	    									 [ -66.47502795394774, 18.38916479752872 ]] } },
	  	{ _id: '562cd850f62d032440e6cfbe',
	    zone_id: 159475,
	    level: 2,
	    totalCrime: '20',
	    loc: { type: 'Polygon', coordinates: [[ -66.47502795394774, 18.38916479752872 ],
	    									 [ -66.47502795394774, 18.39832743179517 ], 
	    									 [ -66.44412890609618, 18.39832743179517 ], 
	    									 [ -66.44412890609618, 18.38916479752872 ], 
	    									 [ -66.47502795394774, 18.38916479752872 ]] } }
	];

	var zoneManager = new ZoneManager();
	var result = zoneManager.getGeoJson(zones);

	// Check if properties where added
	unit.value(result.features[0].properties.zone_id).isEqualTo('159131');
	unit.value(result.features[0].properties.totalCrime).isEqualTo(0);
	unit.value(result.features[0].properties.color).isEqualTo('#389D26');
	unit.value(result.features[1].properties.zone_id).isEqualTo('159475');
	unit.value(result.features[1].properties.totalCrime).isEqualTo(20);
	unit.value(result.features[1].properties.color).isEqualTo('#46C0AC');
}

suite('ZoneManager', function() {
	test('Getting color of a zone when the zone\'s level is correct.', getCorrectZoneColor);
	test('Getting color of a zone when the zone\'s level is wrong.', getIncorrectZoneColor);
	test('Converting a Json Array to a GeoJson and adding properties to the GeoJson.', convertToGeoJson);
});