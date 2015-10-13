// lets require/import the mongodb native drivers.
// var mongodb = require('mongodb');
// 
// We need to work with "MongoClient" interface in order to connect to a mongodb server.
// var MongoClient = mongodb.MongoClient;
// 
// Connection URL. This is where your mongodb server is running.
// var url = 'mongodb://localhost:27017/KYA';
// 
// Use connect method to connect to the Server
// MongoClient.connect(url, function (err, db) {
//   if (err) {
//     console.log('Unable to connect to the mongoDB server. Error:', err);
//   } else {
//     HURRAY!! We are connected. :)
//     console.log('Connection established to', url);
// 
//     Get the documents collection
//     var collection = db.collection('GeoZones');
// 
//     Create some users
//     var zone1 = {zone_id: '1', level: 4, totalCrime: 200};
//     var zone2 = {zone_id: '2', level: 6, totalCrime: 300};
//     var zone3 = {zone_id: '3', level: 8, totalCrime: 600};
// 
// Insert some users
//     collection.find({zone_id: '1'})
//     collection.find().sort({"totalCrime":-1}).limit(1).toArray(function (err, result) {
//       if (err) {
//         console.log(err);
//       } else if (result.length) {
//         console.log('Found:', result);
//       } else {
//         console.log('No document(s) found with defined "find" criteria!');
//       }
//       Close connection
//       db.close();
//     });
//   }
// });