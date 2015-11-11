var ProtoBuf = require("../../node_modules/protobufjs");

process.chdir(__dirname);
var builder = ProtoBuf.loadProtoFile("../../resources/kya.proto"),
	KYA = builder.build("KYA"),
	Telemetry = KYA.Telemetry,
	GeoPoint = KYA.GeoPoint;

var expect = require('../../node_modules/chai').expect

/*-----------------Record with only a survey response------------------------*/
var telRecord1 = new Telemetry({
	"userID" : '999',
	"notificationID" : '999',
	"zoneID": 999,
	"survey" : {
			"actualRisk" : 9,
			"perceivedRisk" : 9
	}
 });

/*------------------Record with only heart rate data------------------------*/
var telRecord2 = new Telemetry({
	"userID" : '888',
	"notificationID" : '888',
	"zoneID": 888,
	"heartRate" : {
			"before" : 8,
			"after" : 8
	}
 });

/*------------------Record with both heart rate and survey------------------*/
var telRecord3 = new Telemetry({
	"userID" : '777',
	"notificationID" : '777',
	"zoneID": 777,
	"heartRate" : {
			"before" : 77,
			"after" : 77
	},
	"survey" : {
			"actualRisk" : 7,
			"perceivedRisk" : 7
	}
 });

/*-----------------Record with no data------------------------------------*/
var telRecord4 = new Telemetry({
	"userID" : '555',
	"notificationID" : '555',
	"zoneID": 555	
 });


/*-----------------Location data for movement tracking---------------------*/
var locRecord = new GeoPoint({
	"userID" : '444',
	"latitude" : 80.8888,
	"longitude" : 80.888	
 });

/*-----------------Objects for testing--------------------------------------*/

var TelemetryStorageManager = require("./telemetryStorageManager.js");

var manager = new TelemetryStorageManager();
var manager2 = new TelemetryStorageManager();
var manager3 = new TelemetryStorageManager();
var manager4 = new TelemetryStorageManager();
var manager5 = new TelemetryStorageManager();

/*---------------------Telemetry request manager mocha test-------------------------------*/
describe('Telemetry Storage Manager', function() {
	describe('#processRecord(telemetryRecord, surveyFlag, heartRateFlag, callback)', function () {
		
		it('should store telemetry data for a record (survey response)' , function (done) {
			manager.processRecord(telRecord1, true, false, function(err,ack){
				expect(err).to.equal(null);
				expect(ack).to.equal('Success');
				done();
			});
    	});    

    	it("should store telemetry data for a record (heart rate measure)", function (done) {
    		manager2.processRecord(telRecord2, false, true, function(err,ack){
				expect(err).to.equal(null);
				expect(ack).to.equal('Success');
				done();
			});
    	});

    	it("should store telemetry data for a record (survey and heart rate)", function (done) {
    		manager3.processRecord(telRecord3, true, true, function(err,ack){
				expect(err).to.equal(null);
				expect(ack).to.equal('Success');
				done();
			});
    	});

    	it("should throw error for a record when no flags have been set", function (done) {
    		manager4.processRecord(telRecord4, false, false, function(err, ack){
    			expect(err).to.be.an('error');
    			expect(ack).to.equal(undefined);
    			done();
    		});
    	});
    });
    describe('#storeMovementData(GeoPoint, callback)', function () {
    	it("should decode and store a GeoPoint to visualize a user's movement" , function (done) {
			manager5.storeMovementData(locRecord, function(err, ack){
    			expect(err).to.equal(null);
    			expect(ack).to.equal('Success');
    			done();
    		});
		}); 
    });
});