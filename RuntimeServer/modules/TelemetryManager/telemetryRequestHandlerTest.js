var ProtoBuf = require("../../node_modules/protobufjs");

var builder = ProtoBuf.loadProtoFile("../../resources/kya.proto"),
	KYA = builder.build("KYA"),
	Telemetry = KYA.Telemetry,
	GeoPoint = KYA.GeoPoint;

var expect = require('chai').expect;

/*-----------------Record with only a survey response------------------------*/
var telRecord1 = new Telemetry({
	"userID" : '50',
	"notificationID" : '50',
	"zoneID": 50,
	"survey" : {
			"actualRisk" : 50,
			"perceivedRisk" : 50
	}
 });

var buffer1 = telRecord1.encode();
var messagegpb1 = buffer1.toBuffer();

/*------------------Record with only heart rate data------------------------*/
var telRecord2 = new Telemetry({
	"userID" : '50',
	"notificationID" : '50',
	"zoneID": 50,
	"heartRate" : {
			"before" : 50,
			"after" : 50
	}
 });

var buffer2 = telRecord2.encode();
var messagegpb2 = buffer2.toBuffer();

/*------------------Record with both heart rate and survey------------------*/
var telRecord3 = new Telemetry({
	"userID" : '70',
	"notificationID" : '70',
	"zoneID": 7,
	"heartRate" : {
			"before" : 700,
			"after" : 777
	},
	"survey" : {
			"actualRisk" : 70,
			"perceivedRisk" : 70
	}
 });

var buffer3 = telRecord3.encode();
var messagegpb3 = buffer3.toBuffer();

/*-----------------Record with only a survey response------------------------*/
var telRecord4 = new Telemetry({
	"userID" : 50,
	"notificationID" : 50,
	"zoneID": 50
 });

var buffer4 = telRecord4.encode();
var messagegpb4 = buffer4.toBuffer();

/*-----------------Location data for movement tracking---------------------*/
var locRecord = new GeoPoint({
	"userID" : '80',
	"latitude" : 80.8888,
	"longitude" : 80.888	
 });
var buffer5 = locRecord.encode();
var messagegpb5 = buffer5.toBuffer();

/*-----------------Objects for testing--------------------------------------*/

var TelemetryRequestHandler = require("./telemetryRequestHandler.js");

var handler = new TelemetryRequestHandler();
var handler2 = new TelemetryRequestHandler();
var handler3 = new TelemetryRequestHandler();
var handler4 = new TelemetryRequestHandler();
var handler5 = new TelemetryRequestHandler();

/*---------------------Telemetry request handler mocha test-------------------------------*/
describe('Telemetry Request Handler', function() {
	describe('#handleTelemetryData(telemetryDataBuffer, callback)', function () {
			    	
    	it('should decode and store telemetry data for a record (survey response)' , function (done) {
			handler.handleTelemetryData(messagegpb1, function(err,ack){
				expect(err).to.be.null;
				expect(ack).to.equal('Success');
				done();
			});
    	});    

    	it("should decode and store telemetry data for a record (heart rate measure)", function (done) {
    		handler2.handleTelemetryData(messagegpb2, function(err,ack){
				expect(err).to.be.null;
				expect(ack).to.equal('Success');
				done();
			});
    	});

    	it("should decode and store telemetry data for a record (survey and heart rate)", function (done) {
    		handler3.handleTelemetryData(messagegpb3, function(err,ack){
				expect(err).to.be.null;
				expect(ack).to.equal('Success');
				done();
			});
    	});

    	it("should throw error for a record with no data", function (done) {
    		handler4.handleTelemetryData(messagegpb4, function(err, ack){
    			expect(err).to.be.an('error');
    			expect(ack).to.be.undefined;
    			done();
    		});
    	});
    });
    describe('#handleMovementData(GeoPointBuffer, callback)', function () {
    	it("should decode and store a GeoPoint to visualize a user's movement" , function (done) {
			handler5.handleMovementData(messagegpb5, function(err, ack){
    			expect(err).to.be.null;
    			expect(ack).to.equal('Success');
    			done();
    		});
		}); 
    });
});
