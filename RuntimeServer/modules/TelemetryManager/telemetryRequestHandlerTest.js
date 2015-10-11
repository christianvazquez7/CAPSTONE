console.log('Begin Test!');

var ProtoBuf = require("../../node_modules/protobufjs");
var TelemetryRequestHandler = require("./telemetryRequestHandler.js");

var builder = ProtoBuf.loadProtoFile("../../resources/kya.proto"),
KYA = builder.build("KYA"),
Telemetry = KYA.Telemetry;

var telRecord = new Telemetry({
	"userID" : 10,
	"notificationID" : 20
 });

var buffer = telRecord.encode();
var messagegpb = buffer.toBuffer();

var handler = new TelemetryRequestHandler();
handler.handleTelemetry(messagegpb, 3);
