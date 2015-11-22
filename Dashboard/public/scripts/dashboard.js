/**
 * The Dashboard module is the component in charge of the dashboard construction.
 * Communicates with the MapController to draw the map, grids and zones in the dashboard.
 * It also fetches from the database the crimes statistics and a list of zones.
 */
 
// Map localization
var mapLatitude, mapLongitude;

// Grid initialization parameters
var swPoint,
	nePoint,
	initArea, 			// the initial size of the grids
	currentArea, 		// the current size of the grids
	thresholdArea,
	reductionFactor;	// the reduction factor for each level of the grids

// Protocol Buffers
var ProtoBuf = dcodeIO.ProtoBuf,
	builder = ProtoBuf.loadProtoFile("KYA.proto"),
	KYA = builder.build("com.nvbyte.kya"),
	GridBounds = KYA.GridBounds,
	GeoPoint = KYA.GeoPoint;
	Threshold = KYA.Threshold;

var currentMaxZone,
	maxZoneLength;
/**
 * Gets the current crime statistics when the HTML
 * document is ready.
 */
$(document).ready(function() {
	// Specify bounds for the initial position of the grid
	// Change this to indicate the location for the grids
	var swLat = 17.918636,
		swLng = -67.299500,
		neLat = 18.536909,
		neLng = -65.176392;

	// Specify the map's location
	// Change this to indicate the location of the area of study
	var mapLocLat = 18.210952,
		mapLocLng = -66.492914;

	// var swLat = 41.588743,
	// 	swLng = -87.967529,
	// 	neLat = 42.051332,
	// 	neLng = -87.377014;

	// var mapLocLat = 41.8369,
	// 	mapLocLng = -87.6847;

	// Initial grid size
	var initialArea = 20;

	$("#maxZoneMap").hide();			// Hides the max zone map
	$("#loading-img").hide();			// Hides the loading animation

	buildMap(mapLocLat, mapLocLng, swLat, swLng, neLat, neLng, initialArea);
	requestStats();					// Fetch current statatistics from database
});
	

this.prevMaxZone = function() {
	if (currentMaxZone == 1) {
		currentMaxZone = 1;
		if (maxZoneLength > 1) {
			showNextButton()
		}
	}
	else {
		currentMaxZone = currentMaxZone - 1;

		if (currentMaxZone == 1) {
			hidePrevButton();
		}

		if (currentMaxZone < maxZoneLength) {
			showNextButton();
		}
		drawMaxZone(currentMaxZone-1);
	}
}

this.nextMaxZone = function() {
	if (currentMaxZone == maxZoneLength) {
		currentMaxZone = maxZoneLength;
		if (maxZoneLength > 1) {
			showPrevButton()
		}
	}
	else {
		currentMaxZone = currentMaxZone + 1;

		if (currentMaxZone == maxZoneLength) {
			hideNextButton();
			if (maxZoneLength > 1) {
				showPrevButton();
			}
		}

		if (currentMaxZone > 1 && currentMaxZone < maxZoneLength) {
			showPrevButton();
		}
		drawMaxZone(currentMaxZone-1);
	}
}

this.resetCurrentMaxZone = function() {
	currentMaxZone = 1;
}

/**
 * Constructs a new Google Map object.
 *
 * @param locLat: (double) the map's latitude
 * @param locLng: (double) the map's longitude
 * @param swLat: (double) the south west latitude for the grid position
 * @param swLng: (double) the south west longitude for the grid position
 * @param neLat: (double) the north east latitude for the grid position
 * @param neLng: (double) the north east longitude for the grid position
 * @param area: (int) the size of the grids
 */
this.buildMap = function(locLat, locLng, swLat, swLng, neLat, neLng, area) {
	initArea = area;
	reductionFactor = 10;
	thresholdArea = 0.2;
	currentMaxZone = 1;
	swInitLatLng = new google.maps.LatLng(swLat, swLng);
	neInitLatLng = new google.maps.LatLng(neLat, neLng);
	setThreshold();
	drawMap(locLat, locLng, swInitLatLng, neInitLatLng, initArea, onGridClicked, onBackButtonClicked, onMapDrag, onZoomOut, onMaxBackButtonClicked);
};

this.setThreshold = function() {

	// Preparing buffer for HTTP request 
	var threshold = new Threshold(thresholdArea);
	var buffer = threshold.encode();
	var message = buffer.toArrayBuffer();

	$.ajax({
		url:  'http://localhost:3000/threshold',
		type: 'POST',
		data: message,
		contentType: 'application/octet-stream',
		processData: false,
		success: function(res) {
			
		}
	});
}

/**
 * Callback function to be called when the map is dragged.
 *
 * @param newLat: (double) the new latitude coordinate
 * @param newLgt: (double) the new longitude coordinate
 */
this.onMapDrag = function() {
	if (currentArea > thresholdArea && currentArea < initArea) {
		clearGrids();
		// requestNewGrid(gridArea);
		drawGrid(getCurrentSwPoint(), getCurrentNePoint(), currentArea, onGridClicked);
    }
    else if (currentArea == thresholdArea) {
    	map.setZoom(map.getZoom() - 2);
    	newBounds = map.getBounds();
    	map.setZoom(map.getZoom() + 2);
    	clearZones();
    	requestZones(newBounds);
    }
};

/**
 * Callback function to be called when a click is detected on a grid.
 *
 * @param lat: (double) the grid's latitude
 * @param lgt: (double) the grid's longitude
 * @param gridID: (int) the grid's id
 */
this.onGridClicked = function(swCoord, neCoord, areaOfGrid) {
	lastBounds = map.getBounds();
	isReady(swCoord, neCoord, areaOfGrid);
};

this.onZoomOut = function() {
	if (currentArea > thresholdArea && currentArea < initArea) {
		clearGrids();
		drawGrid(getCurrentSwPoint(), getCurrentNePoint(), currentArea, onGridClicked);
    }
    else if (currentArea == thresholdArea) {
    	map.setZoom(map.getZoom() - 2);
    	newBounds = map.getBounds();
    	map.setZoom(map.getZoom() + 2);
    	clearZones();
    	requestZones(newBounds);
    }
}

/**
 * Connects to the server and retrieves the current statistics.
 *
 */
this.requestStats = function() {
	$.ajax({
		url:  'http://localhost:3000/stats',
		type: 'GET',
		success: function(res) {
			onStatsFetched(res);
		},
		error: function(err) {
			console.log(err);
		}
	});
}

/**
 * Connects to the server and retrieves the zones.
 *
 * @param bounds: (Stats) the map's bounds
 */
this.requestZones = function(bounds) {
	$("#loading-img").show();		// Show loading image
	$("#googleMap").hide();			// Hide map

	var ne = bounds.getNorthEast(); // LatLng of the north-east corner
	var sw = bounds.getSouthWest(); // LatLng of the south-west corner

	var points = [];
	points.push(new GeoPoint('', sw.lat(), sw.lng())); // sw point
	points.push(new GeoPoint('', ne.lat(), sw.lng())); // nw point
	points.push(new GeoPoint('', ne.lat(), ne.lng())); // ne point
	points.push(new GeoPoint('', sw.lat(), ne.lng())); // se point

	// Preparing buffer for HTTP request 
	var gridBounds = new GridBounds(points);
	var buffer = gridBounds.encode();
	var message = buffer.toArrayBuffer();

	$.ajax({
		url:  'http://localhost:3000/zones',
		type: 'POST',
		data: message,
		contentType: 'application/octet-stream',
		dataType: 'json',
		processData: false,
		success: function(res) {
			$("#loading-img").hide();
			$("#googleMap").show();
			reloadMainMap();
			onZonesFetched(res);
		}
	});
}

/**
 * Connects to the server and retrieves the max zone(s).
 *
 */
this.requestMaxZone = function() {
	$('#maxZoneMap').hide();
	$("#loading-img").show();
	$("#googleMap").hide();
	reloadMaxMap();

	$.ajax({
        url: 'http://localhost:3000/stats/maxZone',
        type: 'GET',
        dataType: 'json',
        success: function(res) {
        	$("#loading-img").hide();
        	$('#maxZoneMap').show();
        	reloadMaxMap();
        	onMaxZoneFetched(res);
        	

        }
    });
}

/**
 * Callback function to be called when the crimes statistics have been
 * fetched from the database.
 *
 * @param stats: (Stats) the crime statistics
 */
this.onStatsFetched = function(stats) {
	drawStats(stats);
};

/**
 * Callback function to be called when the zones have been fetched
 * from the database.
 *
 * @param zoneslist: (GeoJSON) the list of zones
 */
this.onZonesFetched = function(geozones) {
	// Parse GeoJson from response
	newJson = JSON.parse(JSON.stringify(geozones));
	drawZones(newJson);
};

this.onMaxZoneFetched = function(maxZoneJson) {
	// Parse GeoJson from response
	newJson = JSON.parse(JSON.stringify(maxZoneJson));
	maxZoneLength = Object.keys(newJson.features).length
	drawInitMaxZone(newJson);
	if (maxZoneLength > 1) {
		hidePrevButton();
		showNextButton();
	}
	else {
		hidePrevButton();
		hideNextButton();
	}
};

/**
 * Verifies if the zones are ready to be fetched.
 *
 * @param swCoord: (LatLng) the south west latitude and longitude
 * @param neCoord: (LatLng) the north east latitude and longitude
 * @param areaOfGrid: (int) the size of the grid
 */
this.isReady = function(swCoord, neCoord, areaOfGrid) {
    currentArea = areaOfGrid/parseFloat(reductionFactor);

    if (currentArea < initArea) {
        showBackButton();
    }
              
    // Fit view to the bounds of the new area
    bounds = new google.maps.LatLngBounds(swCoord, neCoord);
    map.fitBounds(bounds);
    map.setZoom(map.getZoom() + 1);

    // Verify if we are ready to fetch zones
    $.ajax({
        url: 'http://localhost:3000/grids/ready/?gridArea=' + currentArea,
        type: 'GET',
        dataType: 'text',
        success: function(res) {
            data = res;
            if (data === 'true') {
              var newBounds = map.getBounds();
              clearGrids();

              map.setZoom(map.getZoom() + 1);
              setMinimumZoom();
              requestZones(newBounds);
            }
            else {
            	clearGrids();
            	setMinimumZoom();
            	drawGrid(getCurrentSwPoint(), getCurrentNePoint(), currentArea, onGridClicked);
            }
        }
    });
}

/**
 * Callback function to be called when the user clicks 
 * on the back button.
 *
 */
this.onBackButtonClicked = function() {
	currentArea = currentArea * reductionFactor;

	if (currentArea == initArea) {
		// Hide Back button
		hideBackButton();

		// Reset map to initial location
		resetMap(swPoint, nePoint, initArea, onGridClicked);
	}
	else if (currentArea == (thresholdArea * reductionFactor)) {
		goBackToGrids(currentArea, onGridClicked);
	}
	else {
		clearGrids();
		drawGrid(getCurrentSwPoint(), getCurrentNePoint(), currentArea, onGridClicked);
	}
}

this.onMaxBackButtonClicked = function() {
	$("#maxZoneMap").hide();
	$("#googleMap").show();

	// Sets the isMaxZoneShown flag to false
	unsetMaxZoneFlag();
}