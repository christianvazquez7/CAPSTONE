var request = require("request");


request({
    url: 'http://localhost:3000/stats', 			// URL to hit
    method: 'GET',
   //  headers: {
//         'Content-Type': 'application/octet-stream',
//         'Content-Length': Buffer.byteLength(bodyBuffer)
//     },
//     encoding: null, 										// make response body to Buffer.
//     body: bodyBuffer
}, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
//     	var telemetryRecord = Telemetry.decode(body);
        console.log(response.statusCode, body.toString('utf-8'));
    }
});