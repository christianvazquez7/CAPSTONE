/**
 * The KYABuilder (main class of the module), receives initialization parameters. Then, it follows to request the creation of the grid, 
 * which is a synchronous operation carried out by the Geozone Manager module. Once the grid is created, the KYABuilder registers callbacks 
 * with the Data Provider by requesting criminal data to be fetched from a remote source. When data is received through asynchronous callbacks, 
 * the Data Provider feeds data in serial batches to the Geozone Manager, who keeps track of meta-data for classification. Once a certain 
 * threshold of records is met or the Data Provider signals the end of the fetch operation, the KYABuilder requests the Geozone Manager 
 * to classify and store the zones using the accumulated metadata.
 */

/**
 * Module imports.
 */
var argv 				= require('optimist').usage('File to Initialize KYA Builder.\nUsage: $0').demand('f').demand('c').alias('f', 'file').alias('c', 'code').describe('f', 'Load a file').describe('c', 'Code of city').argv;
var stripJsonComments 	= require('strip-json-comments');
var GeozoneManager 		= require('./GeozoneManager.js');
var coordinate 			= require('./GeoCoordinate.js');
var Crime 				= require('../DataProvider/crime.js');
var fs 					= require('fs');
var MarshallBuilder 	= require('../DataProvider/marshallBuilder.js');
var DataProvider 		= require('../DataProvider/dataProvider.js');
var SQLClient 			= require('pg');
var mongodb 			= require('mongodb');

/**
 * Log for the Geozone Manager.
 */
var Log = require('log');
var log = new Log('debug', fs.createWriteStream('./GeozoneLogs/' + new Date().getTime().toString() + ' ' + new Date().toString() + '.log'));

/**
 * To check if the argunments are place.
 */
if (argv.file != true){
	log.info('The city code is', argv.city);
	var lines = '';
	var s = fs.createReadStream(argv.file);
}
else {
	log.error('File or City argument are not Placed');
	throw new Error("Something went badly wrong!");
}

/**
 * Reading Parameter for to execute.
 */
log.info('Reading parameter');

s.on('data', function (buf) {
    lines += buf.toString();
});

s.on('end', function () {
    log.notice('Reading of Parameter Completed');
});

/**
 * Setting Databases
 */

// Setting "MongoClient" interface in order to connect to a mongodb server.
var mongoClient = mongodb.MongoClient;

// Connection URLs for Databases. This is where your MongoDB and PostgreSQL server are running.
var SQLconnection = "postgres://postgres:joel@localhost:5433/KYA";
var NoSQLconnection = "mongodb://localhost:27017/GeozonePR";

var pgClient = new SQLClient.Client(SQLconnection);

// Connect method to connect to the PostgreSQL Server
pgClient.connect(function(err) {
	if(err) {
		log.error('PostgreSQL Connnection Fail')
		console.error("Could not connect to postgres", err)
	}
	else {
		log.info('PostgreSQL Connection successfully');
		console.log("PostgreSQL Database Connected")
	}
});

// Connect method to connect to the MongoDB Server
var mClient
mongoClient.connect(NoSQLconnection, function (err, db) {
	if (err) {
		log.error('MongoDB Connection Fail');
    	console.log('Unable to connect to the mongoDB server. Error:', err);
  	} 
  	else {
  		log.info('MongoDB Connection successfully');
    	console.log('MongoDB Database Connected');
    	mClient = db;
    	onParameterPrepare();
	}
});

/**
 * Setting variables
 */

// Variable for Geozone Manager
var geo;
var nwLatitude;
var nwLongitude;
var seLatitude;
var seLongitude;
var area;

// Variable for Data Provider
var source;
var appToken;
var resource;
var marshall;
var marshallBuilder;
var start;
var end;
var dataProvider;


/**
 * Method to initialize variable with parameters
 */
function onParameterPrepare() {

	marshallBuilder = new MarshallBuilder();

	var parameter 	= JSON.parse(stripJsonComments(lines));

	// Initializing variable of Data Provider with parameter.
	source 			= parameter.SodaSource;
    appToken 		= parameter.Token;
    resource 		= parameter.Resource;
    start 			= parameter.From;
    end 			= parameter.To;
    ignoreStr 		= parameter.CrimesToIgnore;
    ignoreArr 		= ignoreStr.toString().split(", ");
    marshall 		= marshallBuilder.date(parameter.Marshall.Date).time(parameter.Marshall.Time).lat(parameter.Marshall.Latitude).lon(parameter.Marshall.Longitude).type(parameter.Marshall.Type).ignore(ignoreArr).id(parameter.Marshall.Id).build();
    
    // Initializing variable of Geozone Manager with parameter.
    nwLatitude 		= parseFloat(parameter.NWCoordinate.toString().split(",")[0]);
    nwLongitude 	= parseFloat(parameter.NWCoordinate.toString().split(",")[1]);
    seLatitude 		= parseFloat(parameter.SECoordinate.toString().split(",")[0]);
    seLongitude 	= parseFloat(parameter.SECoordinate.toString().split(",")[1]);
    area 			= parseInt(parameter.Area) * 1000;

    // Initialization of Data Provider.
    dataProvider = new DataProvider(marshall, pgClient);
    
    log.info('Parsing of parameter and initialization Complete.');
    constructGrid();
}



/**
 * Method to initialize Geozone Manager and construct grid.
 */
function constructGrid() {

	log.info('Creating Geozone Manager for Grid Construction');

	// Initialization of Geozone Manager.
	geo = new GeozoneManager(pgClient, mClient, clearData, log);
	geo.buildGrid(new coordinate(nwLatitude, nwLongitude), new coordinate(seLatitude, seLongitude), area, beginDataCollection);
}

/**
 * Method to initialize collection of crime record from SODA using the Data Provider.
 */
function beginDataCollection() {
	
	log.notice('Beginning data Collection from SODA using the Data Provider');

	// Begining of collection from Data Provider.
	dataProvider.init(onProviderReady,source,appToken,resource,start,end);
	var startTime = 0;
}

/**
 * Callback method when batch is complete.
 */
function batchComplete(){
	dataProvider.getData(onRecords,onExtractionEnd);
}

/**
 * Callback method when Data Provider is ready to fetch.
 */
function onProviderReady() {
	console.log('Provider is ready');
	log.notice('Provider is ready');
	startTime = Date.now();
	dataProvider.getData(onRecords,onExtractionEnd);
}

/**
 * Callback method when data is fetched to be process.
 */
function onRecords(data) {
	console.log('Got batch');
	log.info('Got Batch');
	if(data.length != 0) {
		geo.feedCrime(data, marshall,batchComplete);
	}
	else {
		log.emergency('Crime Array Empty');
	}
}

/**
 * Callback method when data fetching end.
 */
function onExtractionEnd() {
	console.log('Extraction finished in: '+ (Date.now() - startTime));
	log.notice('Extraction Completed');
	geo.prepareToClassisfy(toClassify);
}

/**
 * Method use to classify geozones.
 */
function toClassify() {
	console.log("Classifying...");
	log.info('On Classifying');
	geo.classify();
}

/**
 * Method use to clear classification data.
 */
function clearData() {
	geo.clearClassificationData(function(err, result) {
		if(!err) {
			console.log(result);
			toGeozoneEnd();
		}
	});
}

/**
 * Method use when the building get completed.
 */
function toGeozoneEnd() {
	mClient.close();
	pgClient.end();
	log.notice('KYA Building Completed');
	console.log("----------------------------------------------------------------------------| Geozone Building Complete |----------------------------------------------------------------------------");
}