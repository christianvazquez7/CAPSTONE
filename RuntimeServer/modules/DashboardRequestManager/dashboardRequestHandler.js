/**
 * Handles request to fetch the zones and the 
 * crimes statistics from the database.
 */
 
module.exports = function DashboardRequestHandler() {
	
	/**
	 * Module imports.
	 */
	var MongoClient = require('mongodb').MongoClient;
	var ProtoBuf = require("../../node_modules/protobufjs");
	var logger = require('../../utils/logger.js');
	var coordinate = require('../../../BuildServer/modules/GeozoneManager/GeoCoordinate.js');
	var GridController = require('../DashboardManager/gridController.js');
	var ZonesManager = require('../DashboardManager/zonesManager.js');

	// Protocol buffer initialization
	process.chdir(__dirname);
	var protoBuilder = ProtoBuf.loadProtoFile("../../../proto/KYA.proto");
	var KYA = protoBuilder.build("com.nvbyte.kya"),
		GridBounds = KYA.GridBounds,
		Stats = KYA.Stats,
		Threshold = KYA.Threshold;
	var zonesManager = new ZonesManager();
	var gridController;

	// URL for Mondo db 
	var url = 'mongodb://ec2-52-24-21-205.us-west-2.compute.amazonaws.com:27017/GeozonePR';			// Puerto Rico's geozones db
	// var url = 'mongodb://ec2-52-24-21-205.us-west-2.compute.amazonaws.com:27017/ChicagoGeozone';	// Chicago's geozones db
	// var url = 'mongodb://localhost:27017/Geozone';	// Local PR database
	
	/**
	 * Fetch the current crime statistics from KYA DB.
	 *
	 * @param callback: Callback function to be called when the crime statistics have been fecthed from the database.
	 */
	this.requestStats = function(currentMapID, callback) {
		var maxCrime;
		var minCrime;
		var crimeAverage;

		// Set current database URL
		setURL(currentMapID);
		
		// Use connect method to connect to the Server
		MongoClient.connect(url, function (err, db) {
			// Documents collection
			var collection = db.collection('Geozone');

			if (err) {
				logger.debug('ERROR: Unable to connect to the mongoDB server. Error:', err);
				callback(err);
			} 
			else {
				// Connected
				logger.debug('CONN: Connection established to', url);

				collection.find().sort({"totalCrime":-1}).limit(1).toArray(function (err, result)
				{
					if (err) {
						logger.debug('ERROR: ', err);
					}
					else if (result.length) {
						logger.debug('Fetching statistics...');
						maxCrime = result[0].totalCrime;
						thresholdString = result[0].threshold;
						thresholdArray = thresholdString.split(',')
						thresholdBound1 = parseFloat(thresholdArray[0]).toFixed(2);
						thresholdBound2 = parseFloat(thresholdArray[1]).toFixed(2);
						thresholdBounds = thresholdBound1 + ', ' + thresholdBound2;
						logger.debug('    Threshold: ', thresholdBounds);
						logger.debug('    Max crimes: ', maxCrime);
						collection.find().sort({"totalCrime":1}).limit(1).toArray(function (err, result) 
						{
							if (err) {
								logger.debug('ERROR: ', err);
							}
							else if (result.length) {
								minCrime = result[0].totalCrime;
								logger.debug('    Min crimes: ', minCrime);
								collection.aggregate([{$group: {_id:null, crimeAverage: {$avg:"$totalCrime"} } }]).toArray(function (err, result)
								{
									if (err) {
										logger.debug('ERROR: ', err);
									}
									else if (result.length) {
										crimeAverage = result[0].crimeAverage;
										logger.debug('    Crime rate: ', crimeAverage);
										db.close();  
										logger.debug('CONN: Mongodb connection closed.');                  
										var result = encodeStats(maxCrime, minCrime, crimeAverage, thresholdBounds);
										callback(err, result)
									}
								});
							}
						});
					}
					else {
						logger.debug('ERROR: No document(s) found with defined "find" criteria!');
						db.close();
						logger.debug('CONN: Mongodb connection closed.');
					}
				});
			}
		});
	};

	/**
	 * Fetch the zone(s) with the maximum number of incidents.
	 *
	 * @param callback: Callback function to be called when the zone(s) have been fecthed from the database.
	 */
	this.requestMaxZone = function(currentMapID, callback) {
		// Set current database URL
		setURL(currentMapID);

		// Use connect method to connect to the Server
		MongoClient.connect(url, function (err, db) {
			// Documents collection
			var collection = db.collection('Geozone');
			if (err) {
				logger.debug('ERROR: Unable to connect to the mongoDB server. Error:', err);
				callback(err);
			} 
			else {
				logger.debug('CONN: Connection established to', url);
				logger.debug('Fetching max zone...');
				collection.find().sort({"totalCrime":-1}).limit(1).toArray(function (err, result)
				{
					if (err) {
						logger.debug('ERROR: ', err);
					}
					else if (result.length) {
						maxNumber = result[0].totalCrime;

						collection.find({ totalCrime : maxNumber }).toArray(function (err, result)
						{
							db.close();
							logger.debug('CONN: Mongodb connection closed.');
							maxZone = zonesManager.getGeoJson(result);
							callback(err, maxZone);
						});
					}
				});
			}
		});
	};

	/**
	 * Fetch the zone(s) with the maximum number of incidents.
	 *
	 * @param callback: Callback function to be called when the zone(s) have been fecthed from the database.
	 */
	this.requestZonesByLevel = function(currentMapID, level, callback) {
		// Set current database URL
		setURL(currentMapID);

		// Use connect method to connect to the Server
		MongoClient.connect(url, function (err, db) {
			// Documents collection
			var collection = db.collection('Geozone');
			if (err) {
				logger.debug('ERROR: Unable to connect to the mongoDB server. Error:', err);
				callback(err);
			} 
			else {
				logger.debug('CONN: Connection established to', url);
				logger.debug('Fetching zones from level ' + level + '...');
				collection.find({"level": level}).toArray(function (err, result)
				{
					db.close();
					logger.debug('CONN: Mongodb connection closed.');
					zones = zonesManager.getGeoJson(result);
					callback(err, zones);
				});
			}
		});
	};
	
	/**
	 * Fetch the zones from KYA DB.
	 *
	 * @param nwPoint: the north west point
	 * @param sePoint: the south east point
	 * @param area: the size 
	 * @param callback: Callback function to be called when the zones have been fetched from the database.
	 */
	this.requestZones = function(gridBoundsBuffer, callback) {
		try {
			var gridBounds = GridBounds.decode(gridBoundsBuffer);
			var currentMapID = gridBounds.mapID;
			// Set current database URL
			setURL(currentMapID);

			var swPoint = [gridBounds.boundaries[0].longitude, gridBounds.boundaries[0].latitude];
			var nwPoint = [gridBounds.boundaries[1].longitude, gridBounds.boundaries[1].latitude];
			var nePoint = [gridBounds.boundaries[2].longitude, gridBounds.boundaries[2].latitude];
			var sePoint = [gridBounds.boundaries[3].longitude, gridBounds.boundaries[3].latitude];

			logger.debug('GET zones in... ');
			logger.debug('    SW Point', swPoint);
			logger.debug('    NW Point', nwPoint);
			logger.debug('    NE Point', nePoint);
			logger.debug('    SE Point', sePoint);
			
			MongoClient.connect(url, function (err, db) {
				// Documents collection
				var collection = db.collection('Geozone');
				if (err) {
					logger.debug('ERROR: Unable to connect to the mongoDB server. Error:', err);
					callback(err);
				} 
				else {
				    // Connected
				    logger.debug('CONN: Connection established to', url);
				    logger.debug('Fetching zones...');
					collection.find( { loc : 
		                  { $geoWithin : 
		                    { $geometry : 
		                      { type : "Polygon",
		                        coordinates : [ [ swPoint , nwPoint , nePoint , sePoint , swPoint ] ]
		                } } } } ).toArray(function (err, result) {
		                	if (err) {
								logger.debug('ERROR: ', err);
							}
							else {
								zones = zonesManager.getGeoJson(result);
								callback(err, zones);
					    	}
					    	db.close();
					    	logger.debug('CONN: Mongodb connection closed.');
					    });
				}
			});
		}
		catch(err) {
			logger.debug('ERROR: ', err);
			callback(new Error("Undefined parameter"))
		}
	};

	/**
	 * Creates a new grid given some parameters.
	 *
	 * @param swLat: the south west latitude
	 * @param swLng: the south west longitude
	 * @param neLat: the north east latitude
	 * @param neLng: the north east longitude
	 * @param area: the size for the grids
	 * @param callback: Callback function to be called when the grids have been created
	 */
	this.requestGrids = function(swLat, swLng, neLat, neLng, area, callback) {
		logger.debug('Requesting grids...');
		logger.debug('    swLat -> ', swLat);
		logger.debug('    swLng -> ', swLng);
		logger.debug('    neLat -> ', neLat);
		logger.debug('    neLng -> ', neLng);
		logger.debug('    area -> ', area);

		if (typeof swLat === 'undefined' || 
			typeof swLng === 'undefined' || 
			typeof neLat === 'undefined' || 
			typeof neLng === 'undefined' || 
			typeof area === 'undefined') {
			// Error -  undefined value
			logger.debug('ERROR: Undefined parameter.');
			callback(new Error("Undefined parameter"));
		}
		else {
			result = gridController.buildGrids(new coordinate(swLat, swLng), new coordinate(neLat, neLng), area);
			callback(null, result);
		}
	};

	/**
	 * Verifies if we are ready to fetch the zones. 
	 *
	 * @param area: the current size of the clicked grid
	 * @param callback: Callback function to be called to send the response
	 */
	this.isReady = function(area, callback) {
		logger.debug('Checking if ready to fetch zones...');
		logger.debug('    area -> ', area);
		if (typeof area === 'undefined') {
			logger.debug('ERROR: Area is undefined.');
			// Error - Area is undefined
			callback(new Error("Area is undefined"))
		}
		else {
			result = gridController.isReadyToFetch(area);
			callback(null, result);
		}
	};

	/**
	 * Sets the threshold value that indicates when to fetch the zones.
	 *
	 * @param threshold: the threshold value
	 * @param callback: Callback function to be called when the threshold have been set
	 */
	this.setThreshold = function(threshold, callback) {
		logger.debug('Setting threshold...');
		logger.debug('    threshold ->', threshold)
		try {
			var thresholdBuf = Threshold.decode(threshold);
			var areaThreshold = thresholdBuf.threshold;
			gridController = new GridController(areaThreshold);
			callback(null, 'SUCCESS');
		}
		catch(err) {
			logger.debug('ERROR:  Error when trying to set threshold.');
			callback(err);
		}
	};

	/**
	 * Sets the database URL according to the selected mapID in the client.
	 *
	 * @param mapID: the map's id
	 */
	function setURL(mapID) {
		logger.debug('Setting mapID...');
		logger.debug('    mapID --> ', mapID);
			if (mapID == 0) {
				url = 'mongodb://ec2-52-24-21-205.us-west-2.compute.amazonaws.com:27017/GeozonePR';			// Puerto Rico's geozones db
			}
			else if (mapID == 1) {
				url = 'mongodb://ec2-52-24-21-205.us-west-2.compute.amazonaws.com:27017/GeozoneBoston';		// Boston's geozones db
			}
			else if (mapID == 2) {
				url = 'mongodb://ec2-52-24-21-205.us-west-2.compute.amazonaws.com:27017/GeozoneAtlanta';	// Atlanta's geozones db
			}
			else if (mapID == 3) {
				url = 'mongodb://ec2-52-24-21-205.us-west-2.compute.amazonaws.com:27017/GeozoneSF';			// San Francisco's geozones db
			}
			else if (mapID == 4) {
				url = 'mongodb://ec2-52-24-21-205.us-west-2.compute.amazonaws.com:27017/GeozoneLA';			// Los Angeles's geozones db
			}
			else if (mapID == 5) {
				url = 'mongodb://ec2-52-24-21-205.us-west-2.compute.amazonaws.com:27017/GeozoneChicago';	// Chicago's geozones db
			}
			else {
				// Default case
				url = 'mongodb://ec2-52-24-21-205.us-west-2.compute.amazonaws.com:27017/GeozonePR';			// Puerto Rico's geozones db		
			}
	};

	/**
	 * Prepare the stats to be send via a HTTP respone.
	 *
	 * @param maxCrime: the maximum number of incidents
	 * @param minCrime: the minimum number of incidents
	 * @param crimeAverage: the crime average
	 * @param thresholdBounds: the upper and lower bound of the classification strategy
	 *
	 * @return buffer: the parameters encoded into a buffer object
	 */
	function encodeStats(maxCrime, minCrime, crimeAverage, thresholdBounds) {
		var currentStats = new Stats({
			"maxNumOfCrimes" : maxCrime,
			"minNumOfCrimes" : minCrime,
			"crimeAverage": crimeAverage,
			"thresholdBounds": thresholdBounds
 		});

 		var buffer = currentStats.encode();
 		return buffer.toBuffer().toString('base64');
	}
};