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
	var logger = require('../../resources/utils/logger.js');

	// Protocol buffer initialization
	var protoBuilder = ProtoBuf.loadProtoFile("../../resources/kya.proto");
	var KYA = protoBuilder.build("KYA");
	var GridBounds = KYA.GridBounds;
	var Stats = KYA.Stats;

	// URL for Mondo db 
	var url = 'mongodb://ec2-52-24-21-205.us-west-2.compute.amazonaws.com:27017/Geozones';
	
	/**
	 * Fetch the current crime statistics from KYA DB.
	 *
	 * @param callback: Callback function to be called when the crime statistics have been fecthed from the database.
	 */
	this.requestStats = function(callback) {
		var maxCrime;
		var minCrime;
		var crimeAverage;
	
		// Use connect method to connect to the Server
		MongoClient.connect(url, function (err, db) {
			// Documents collection
			var collection = db.collection('Geozones');

			if (err) {
				logger.error('Unable to connect to the mongoDB server. Error:', err);
			} 
			else {
				// Connected
				logger.debug('Connection established to', url);

				collection.find().sort({"totalCrime":-1}).limit(1).toArray(function (err, result)
				{
					if (err) {
						logger.error(err);
					}
					else if (result.length) {
						maxCrime = result[0].totalCrime;
						logger.info('Max crimes: ', maxCrime);
						collection.find().sort({"totalCrime":1}).limit(1).toArray(function (err, result) 
						{
							if (err) {
								logger.error(err);
							}
							else if (result.length) {
								minCrime = result[0].totalCrime;
								logger.info('Min crimes: ', minCrime);
								collection.aggregate([{$group: {_id:null, crimeAverage: {$avg:"$totalCrime"} } }]).toArray(function (err, result)
								{
									if (err) {
										logger.error(err);
									}
									else if (result.length) {
										crimeAverage = result[0].crimeAverage;
										logger.info('Crime rate: ', crimeAverage);
										db.close();                    
										var result = encodeStats(maxCrime, minCrime, crimeAverage);
										callback(err, result)
									}
								});
							}
						});
					}
					else {
						logger.error('No document(s) found with defined "find" criteria!');
						db.close();
					}
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
		var gridBounds = GridBounds.decode(gridBoundsBuffer);

		// Get grid bounds
		var nwPoint = gridBounds.nwPoint;
		var nePoint = gridBounds.nePoint;
		var swPoint = gridBounds.swPoint;
		var sePoint = gridBounds.sePoint;
		
		MongoClient.connect(url, function (err, db) {
			// Documents collection
			var collection = db.collection('Geozones');
			if (err) {
				logger.error('Unable to connect to the mongoDB server. Error:', err);
			} 
			else {
			    // Connected
			    logger.debug('Connection established to', url);

				collection.find( { loc : 
	                  { $geoWithin : 
	                    { $geometry : 
	                      { type : "Polygon",
	                        coordinates : [ [ nwPoint , nePoint , swPoint , sePoint , nwPoint ] ]
	                } } } } ).toArray(function (err, result) {
	                	// console.log(result[0].loc.coordinates);
	                	if (err) {
							logger.error(err);
						}
						else {
							callback(err, result);
				    	}
				    });
			}
		});
	};

	/**
	 * Prepare the stats to be send via a HTTP respone.
	 *
	 * @param maxCrime: the maximum number of incidents
	 * @param minCrime: the minimum number of incidents
	 * @param crimeAverage: the crime average
	 *
	 * @return buffer: the parameters encoded into a buffer object
	 */
	function encodeStats(maxCrime, minCrime, crimeAverage) {
		var currentStats = new Stats({
			"maxNumOfCrimes" : maxCrime,
			"minNumOfCrimes" : minCrime,
			"crimeAverage": crimeAverage
 		});

 		var buffer = currentStats.encode();
 		return buffer.toBuffer();
	}
};