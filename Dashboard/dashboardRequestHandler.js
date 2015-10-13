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
	var mongodb = require('mongodb');
	
	var geoZoneList;
	
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/KYA';
	
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
		    console.log('Connection established to', url);

		    // Get the documents collection
		    var collection = db.collection('GeoZones');

	        collection.find().sort({"totalCrime":-1}).limit(1).toArray(function (err, result)
	        {
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
									// console.log(minCrime);
			                        db.close();                    
			                        var stat = new Stats(maxCrime, minCrime, crimeRate);
			                        console.log('Stats');
			                        var result = stat.toJSON();
			                        console.log(result);
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
	this.requestZones = function(nwPoint, sePoint, area, callback) {
	
	};
	
};