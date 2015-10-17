/**
 * Handles request to fetch the zones and the 
 * crimes statistics from the database.
 */
 
module.exports = function DashboardRequestHandler() {
	
	/**
	 * Module imports.
	 */
	// var GeoZone = require('./geoZone.js');
	var Stats = require('./stats.js');
	var MongoClient = require('mongodb').MongoClient;
	var ProtoBuf = require("../../node_modules/protobufjs");

	// Protocol buffer initialization
	var protoBuilder = ProtoBuf.loadProtoFile("../../resources/kya.proto");
	// URL for Mondo db 
	var url = 'mongodb://ec2-52-24-21-205.us-west-2.compute.amazonaws.com:27017/Geozones';
	// Documents collection
	var collection = db.collection('GeoZones');

	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  insertDocument(db, function() {
	      db.close();
	  });
	});
	
	var geoZoneList;
	
	/**
	 * Fetch the current crime statistics from KYA DB.
	 *
	 * @param callback: Callback function to be called when the crime statistics have been fecthed from the database.
	 */
	this.requestStats = function(callback) {
		var maxCrime;
		var minCrime;
		var crimeRate;
	
		// Use connect method to connect to the Server
		MongoClient.connect(url, function (err, db) {
		  if (err) {
		    console.log('Unable to connect to the mongoDB server. Error:', err);
		  } 
		  else {
		    // Connected
		    // console.log('Connection established to', url);

	        collection.find().sort({"totalCrime":-1}).limit(1).toArray(function (err, result)
	        {
	        	console.log(result);
	            if (err) {
	            	console.log(err);
	            }
	            else if (result.length) {
	            	maxCrime = result[0].totalCrime;
	            	collection.find().sort({"totalCrime":1}).limit(1).toArray(function (err, result)
	                {
	                	if (err) {
	            			console.log(err);
	            		}
	            		else if (result.length) {
	                		minCrime = result[0].totalCrime;
							collection.aggregate([{$group: {_id:null, crimeRate: {$avg:"$totalCrime"} } }]).toArray(function (err, result)
							{
								if (err) {
									console.log(err);
	            				}
	            				else if (result.length) {
	            					crimeRate = result[0].crimeRate;
									// console.log(crimeRate);
									console.log(minCrime);
			                        db.close();                    
			                        var stat = new Stats(maxCrime, minCrime, crimeRate);
// 			                        console.log('Stats');
			                        var result = stat.toJSON();
			                        // console.log(result);
			                        callback(err, result)
	            				}
							});
	                    }
	                });
	            }
	            else {
	            	console.log('No document(s) found with defined "find" criteria!');
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
			if (err) {
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} 
			else {
			    // Connected
			    // console.log('Connection established to', url);
			    
			    var query = {};
				query['coordinates'] = [mNwPoint, mSePoint];
				query['type'] = "Point";

				collection.find( { loc : 
	                  { $geoWithin : 
	                    { $geometry : 
	                      { type : "Polygon",
	                        coordinates : [ [ nwPoint , nePoint , swPoint , sePoint , nwPoint ] ]
	                } } } } ).toArray(function (err, result) {
	                	console.log(result);
	                	if (err) {
							console.log(err);
						}
						else {
							callback(err, result);
				    	}
				    });

				// collection.find({loc:{$geoIntersects: {$geometry: query }}}).toArray(function (err, result) {
				// console.log(result);
				// 	if (err) {
				// 		console.log(err);
				// 	}
				// 	else {
				// 		callback(err, result);
				//     }
				// });
			}
		});
	};
};