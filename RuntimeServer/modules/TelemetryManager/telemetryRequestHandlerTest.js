console.log('Begin Test!');

var ProtoBuf = require("../../node_modules/protobufjs");
var TelemetryRequestHandler = require("./telemetryRequestHandler.js");

var builder = ProtoBuf.loadProtoFile("../../resources/kya.proto"),
	KYA = builder.build("KYA"),
	Telemetry = KYA.Telemetry,
	GeoPoint = KYA.GeoPoint;

/*--------------------------------------*/
var telRecord1 = new Telemetry({
	"userID" : 50,
	"notificationID" : 50,
	"zoneID": 50,
	"survey" : {
			"actualRisk" : 50,
			"perceivedRisk" : 50
	}
 });

var buffer1 = telRecord1.encode();
var messagegpb1 = buffer1.toBuffer();

/*--------------------------------------*/
var telRecord2 = new Telemetry({
	"userID" : 50,
	"notificationID" : 50,
	"zoneID": 50,
	"heartRate" : {
			"before" : 50,
			"after" : 50
	}
 });

var buffer2 = telRecord2.encode();
var messagegpb2 = buffer2.toBuffer();

/*---------------------------------------*/
var telRecord3 = new Telemetry({
	"userID" : 70,
	"notificationID" : 70,
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

/*--------------------------------------*/
var locRecord = new GeoPoint({
	"userID" : 80,
	"latitude" : 80.8888,
	"longitude" : 80.888	
 });
var buffer4 = locRecord.encode();
var messagegpb4 = buffer4.toBuffer();

/*--------------------------------------*/

var handler = new TelemetryRequestHandler();
var handler2 = new TelemetryRequestHandler();
var handler3 = new TelemetryRequestHandler();
var handler4 = new TelemetryRequestHandler();


handler.handleTelemetryData(messagegpb1);

handler2.handleTelemetryData(messagegpb2);

handler3.handleTelemetryData(messagegpb3);

handler4.handleMovementData(messagegpb4);
