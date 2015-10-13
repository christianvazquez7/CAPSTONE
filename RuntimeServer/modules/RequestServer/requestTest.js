console.log('Begin Test!');

var request = require("request");
var ProtoBuf = require("../../node_modules/protobufjs");
var TelemetryRequestHandler = require("../TelemetryManager/telemetryRequestHandler.js");

var builder = ProtoBuf.loadProtoFile("../../resources/kya.proto"),
KYA = builder.build("KYA"),
Telemetry = KYA.Telemetry;

var telRecord = new Telemetry({
	"userID" : 10,
	"notificationID" : 20
 });
 
var buffer = telRecord.encode();
var bodyBuffer = buffer.toBuffer();

request({
    url: 'http://localhost:3000/telemetry/survey', 			// URL to hit
    method: 'POST',
    headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': Buffer.byteLength(bodyBuffer)
    },
    encoding: null, 										// make response body to Buffer.
    body: bodyBuffer
}, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
//     	var telemetryRecord = Telemetry.decode(body);
        console.log(response.statusCode, body.toString('utf-8'));
    }
});