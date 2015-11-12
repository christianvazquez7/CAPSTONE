var ProtoBuf = require('protobufjs');

process.chdir(__dirname);
var builder = ProtoBuf.loadProtoFile("../../../proto/KYA.proto"),
	KYA = builder.build("com.nvbyte.kya"),
	Telemetry = KYA.Telemetry,
	GeoPoint = KYA.GeoPoint;

var expect = require('chai').expect;

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

var buffer1 = telRecord1.encode();
var messagegpb1 = buffer1.toBuffer();

/*------------------Record with only heart rate data------------------------*/
var telRecord2 = new Telemetry({
	"userID" : '234',
	"notificationID" : '567',
	"zoneID": 2,
	"heartRate" : {
			"before" : 220			
	}
 });


var buffer2 = telRecord2.encode();
var messagegpb2 = buffer2.toBuffer();

/*------------------Record with only heart rate data------------------------*/
var telRecord3 = new Telemetry({
	"userID" : '234',
	"notificationID" : '567',
	"zoneID": 2,
	"heartRate" : {
			"after" : 230
	}
 });

var buffer3 = telRecord3.encode();
var messagegpb3 = buffer3.toBuffer();

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

var buffer4 = telRecord4.encode();
var messagegpb4 = buffer4.toBuffer();

/*-----------------Record with no data------------------------------------*/
var telRecord5 = new Telemetry({
	"userID" : '555',
	"notificationID" : '555',
	"zoneID": 4	
 });

var buffer5 = telRecord5.encode();
var messagegpb5 = buffer5.toBuffer();

/*-----------------Location data for movement tracking---------------------*/
var locRecord = new GeoPoint({
	"userID" : '123',
	"latitude" : 80.8888,
	"longitude" : 80.888	
 });

var buffer6 = locRecord.encode();
var messagegpb6 = buffer6.toBuffer();

/*-----------------Objects for testing--------------------------------------*/

var TelemetryRequestHandler = require("./telemetryRequestHandler.js");

var handler = new TelemetryRequestHandler();

/*---------------------Telemetry request handler mocha test-------------------------------*/
describe('Telemetry Request Handler', function() {
	this.timeout(20000);
	describe('#handleTelemetryData(telemetryDataBuffer, callback)', function () {
			    	
    	it('should decode and store telemetry data for a record (survey response)' , function (done) {
			handler.handleTelemetryData(messagegpb1, function(err,ack){
				expect(err).to.be.null;
				expect(ack).to.equal('Success');
				done();
			});
    	});    

    	it("should decode and store telemetry data for a record (heart rate measure before)", function (done) {
    		handler.handleTelemetryData(messagegpb2, function(err,ack){
				expect(err).to.be.null;
				expect(ack).to.equal('Success');
				done();
			});
    	});

    	it("should decode and store telemetry data for a record (heart rate measure after)", function (done) {
    		handler.handleTelemetryData(messagegpb3, function(err,ack){
				expect(err).to.be.null;
				expect(ack).to.equal('Success');
				done();
			});
    	});

		it("should decode and store telemetry data for a record (survey and heart rate)", function (done) {
    		handler.handleTelemetryData(messagegpb4, function(err,ack){
				expect(err).to.be.null;
				expect(ack).to.equal('Success');
				done();
			});
    	});

    	it("should throw error for a record with no data", function (done) {
    		handler.handleTelemetryData(messagegpb5, function(err, ack){
    			expect(err).to.be.an('error');
    			expect(ack).to.be.undefined;
    			done();
    		});
    	});
    });
    describe('#handleMovementData(GeoPointBuffer, callback)', function () {
    	it("should decode and store a GeoPoint to visualize a user's movement" , function (done) {
			handler.handleMovementData(messagegpb6, function(err, ack){
    			expect(err).to.be.null;
    			expect(ack).to.equal('Success');
    			done();
    		});
		}); 
    });
});
