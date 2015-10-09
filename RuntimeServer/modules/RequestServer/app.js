// Imports
var Server = require("./server");
var RequestHandlers = require("./requestHandlers");
var router = require("./route");

var requestHandler = new RequestHandlers();
var server = new Server();
var handle = {}
var port;

// Declare handlers
handle["/stats"] = requestHandler.getStats;
handle["/zones"] = requestHandler.getZones;
handle["/checkIn"] = requestHandler.handleCheckIn;
handle["/heartBeat"] = requestHandler.handleHeartBeat;
handle["/survey"] = requestHandler.handleSurvey;
handle["/currentZone"] = requestHandler.getCurrentZone;

// Start server
server.start(router, handle, port);