var ProtoBuf = require("../../node_modules/protobufjs");

process.chdir(__dirname);
var builder = ProtoBuf.loadProtoFile("../../resources/kya.proto"),
	KYA = builder.build("KYA"),
	Telemetry = KYA.Telemetry,
	GeoPoint = KYA.GeoPoint;

var expect = require('../../node_modules/chai').expect

/*-----------------Record with only a survey response------------------------*/
var telRecord1 = new Telemetry({
	"userID" : '123',
	"notificationID" : '456',
	"zoneID": 1,
	"survey" : {
			"actualRisk" : 1,
			"perceivedRisk" : 1
	}
 });

/*------------------Record with only heart rate data------------------------*/
var telRecord2 = new Telemetry({
	"userID" : '234',
	"notificationID" : '567',
	"zoneID": 2,
	"heartRate" : {
			"before" : 220			
	}
 });

/*------------------Record with only heart rate data------------------------*/
var telRecord3 = new Telemetry({
	"userID" : '234',
	"notificationID" : '567',
	"zoneID": 2,
	"heartRate" : {
			"after" : 230
	}
 });

/*------------------Record with both heart rate and survey------------------*/
var telRecord4 = new Telemetry({
	"userID" : '345',
	"notificationID" : '678',
	"zoneID": 3,
	"heartRate" : {
			"before" : 45
	},
	"survey" : {
			"actualRisk" : 2,
			"perceivedRisk" : 2
	}
 });

/*-----------------Record with no data------------------------------------*/
var telRecord5 = new Telemetry({
	"userID" : '555',
	"notificationID" : '555',
	"zoneID": 4	
 });


/*-----------------Location data for movement tracking---------------------*/
var locRecord = new GeoPoint({
	"userID" : '123',
	"latitude" : 80.8888,
	"longitude" : 80.888	
 });

/*-----------------Objects for testing--------------------------------------*/

var TelemetryStorageManager = require("./telemetryStorageManager.js");

var manager = new TelemetryStorageManager();

/*------------------------------------Node test-------------------------------------------*/
/*
manager.processRecord(telRecord2, false, true, function(err,ack){
	console.log("Err: " + err);
	console.log("Result: " + ack);
});
*/
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

    	it("should store telemetry data for a record (heart rate before measure before)", function (done) {
    		manager.processRecord(telRecord2, false, true, function(err,ack){
				expect(err).to.equal(null);
				expect(ack).to.equal('Success');
				done();
			});
    	});

    	it("should store telemetry data for a record (heart rate after measure after)", function (done) {
    		manager.processRecord(telRecord3, false, true, function(err,ack){
				expect(err).to.equal(null);
				expect(ack).to.equal('Success');
				done();
			});
    	});

    	it("should store telemetry data for a record (survey and heart rate)", function (done) {
    		manager.processRecord(telRecord4, true, true, function(err,ack){
				expect(err).to.equal(null);
				expect(ack).to.equal('Success');
				done();
			});
    	});

    	it("should throw error for a record when no flags have been set", function (done) {
    		manager.processRecord(telRecord5, false, false, function(err, ack){
    			expect(err).to.be.an('error');
    			expect(ack).to.equal(undefined);
    			done();
    		});
    	});
    });
    describe('#storeMovementData(GeoPoint, callback)', function () {
    	it("should decode and store a GeoPoint to visualize a user's movement" , function (done) {
			manager.storeMovementData(locRecord, function(err, ack){
    			expect(err).to.equal(null);
    			expect(ack).to.equal('Success');
    			done();
    		});
		}); 
    });
});