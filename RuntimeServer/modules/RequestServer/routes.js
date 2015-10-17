/**
 * This module is in charge of routing all requests to its respective handler.
 */
module.exports = function Route(app, handlers) {

	// Imports
	var bodyParser = require('../../node_modules/body-parser')

	// Initialization
	var bufferParser = bodyParser.raw()

	// Routes
	app.get('/stats', handlers.getStats);
	
	app.get('/zones/', handlers.getZones);
	
	app.post('/zones/current/', bufferParser, handlers.handleCurrentZone);
	
	app.post('/location/checkin/', bufferParser, handlers.handleCheckIn);
	
	app.post('/telemetry/heartbeat', bufferParser, handlers.handleHeartBeat);
	
	app.post('/telemetry/survey', bufferParser, handlers.handleSurvey);
	
	app.post('/telemetry/movement', bufferParser, handlers.handleMovement);
	
	// 
	app.use(function(req, res, next) {
 		res.status(404).send('Sorry cant find that!');
	});

};