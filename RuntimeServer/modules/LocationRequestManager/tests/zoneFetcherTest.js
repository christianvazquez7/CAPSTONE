/* Test Zone fetcher**/

var ZoneFetcher = require('../zoneFetcher.js');
// ../../../node_module/turf

var fetcherTest = new ZoneFetcher();
var location = 
{
	longitude: -66.70000000000000,
	latitude: 18.09
};
var numRings = 1;

fetcherTest.fetchByLocation(location, numRings, function(result){
	console.log("Zones fetched:");
	console.log("Number of zones: " + result.length);
	console.log(result);
});