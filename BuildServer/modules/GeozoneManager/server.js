var argv = require('optimist').usage('File to Initialize KYA Builder.\nUsage: $0').demand('f').alias('f', 'file').describe('f', 'Load a file').argv;
var stripJsonComments = require('strip-json-comments');
var GeozoneManager = require('./GeozoneManager.js');
var coordinate = require('./GeoCoordinate.js');
var Crime = require('./dataProvider/crime.js');
var fs = require('fs');

var SQLClient = require('pg');
var mongodb = require('mongodb');

if(argv.file != ''){
	var s = fs.createReadStream(argv.file);
}
else {
	throw new Error("Something went badly wrong!");
}
var parameter;
var lines = '';

s.on('data', function (buf) {
    lines += buf.toString();
});

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var mongoClient = mongodb.MongoClient;

var SQLconnection = "postgres://postgres:joel@localhost:5433/KYA";

// Connection URL. This is where your mongodb server is running.
//var NoSQLconnection = "mongodb://ec2-52-24-21-205.us-west-2.compute.amazonaws.com:27017/Geozone";
var NoSQLconnection = "mongodb://localhost:27017/Geozone";
var client;

var pgClient = new SQLClient.Client(SQLconnection);

pgClient.connect(function(err) {
	if(err) {
		console.error("Could not connect to postgres", err)
	}
	else {
		console.log("PostgreSQL Database Connected")
	}
});

// Use connect method to connect to the Server
mongoClient.connect(NoSQLconnection, function (err, db) {
	if (err) {
    	console.log('Unable to connect to the mongoDB server. Error:', err);
  	} 
  	else {
    	console.log('MongoDB Database Connected');
    	client = db;
    	constructGrid();
	}
});

var geo;
var nwLatitude;
var nwLongitude;
var seLatitude;
var seLongitude;
var area;
var MarshallBuilder = require('./dataProvider/marshallBuilder.js');
var marshallBuilder = new MarshallBuilder();
var DataProvider = require('./dataProvider/dataProvider.js');

var source;
var appToken;
var resource;
var marshall;
var start;
var end;
var dataProvider;

s.on('end', function () {
    parameter = JSON.parse(stripJsonComments(lines));
    source = parameter.SodaSource;
    appToken = parameter.Token;
    resource = parameter.Resource;
    start = parameter.From;
    end = parameter.To;
    ignoreStr = parameter.CrimesToIgnore;
    ignoreArr = ignoreStr.toString().split(",");
    marshall = marshallBuilder.date('fecha').time('hora').lat('point_x').lon('point_y').type('delitos_code').ignore(ignoreArr).id('delito').build();
    dataProvider = new DataProvider(marshall, pgClient);
    nwLatitude = parseFloat(parameter.NWCoordinate.toString().split(",")[0]);
    nwLongitude = parseFloat(parameter.NWCoordinate.toString().split(",")[1]);
    seLatitude = parseFloat(parameter.SECoordinate.toString().split(",")[0]);
    seLongitude = parseFloat(parameter.SECoordinate.toString().split(",")[1]);
    area = parseInt(parameter.Area) * 1000;
});

function constructGrid() {
	geo = new GeozoneManager(pgClient, client, geozoneComplete);
	geojson = geo.buildGrid(new coordinate(nwLatitude, nwLongitude), new coordinate(seLatitude, seLongitude), area, beginDataCollection);
}

function beginDataCollection() {
	console.log("Beginning data Collection from SODA...");
	dataProvider.init(onProviderReady,source,appToken,resource,start,end);
	var startTime = 0;
}

function batchComplete(){
	dataProvider.getData(onRecords,onExtractionEnd);
}

function onProviderReady() {
	console.log('Provider is ready');
	startTime = Date.now();
	dataProvider.getData(onRecords,onExtractionEnd);
}

function onRecords(data) {
	console.log('Got batch');
	geo.feedCrime(data, marshall,batchComplete);
}

function onExtractionEnd() {
	console.log('Extraction finished in: '+ (Date.now() - startTime));
	geo.prepareToClassisfy(toClassify);
}

function toClassify() {
	console.log("Classifying...");
	geo.classify();
}

function geozoneComplete() {
	client.close();
	pgClient.end();
	console.log("Geozone Building Complete...");
	console.log("--------------------------------------------------------------------------------------------------------------------------------------------------");
}