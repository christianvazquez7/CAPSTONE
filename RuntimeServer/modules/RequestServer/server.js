/**
 * Creates the server, listen for requests and routes 
 * the request for its respective handler.
**/
module.exports = function Server() {
  // Imports
  var express = require('express');
  var routes = require('./routes.js');
  var logger = require('./utils/logger.js');
  
  var app = express();

  /**
   * Creates and starts the server.
   *
   * @param route : function for routing the requests
   * @param handle: handlers array
   * @param port  : the port to listen
   */
  this.start = function(handlers, port) {
  	routes(app, handlers);
    createServer(port);
  }

  /**
   * Creates the server.
   *
   * @param port: the port to listen
   */
  function createServer(mPort) {
  		
  		var port = process.env.PORT || mPort;
  		app.listen(port);
  		logger.info("app listening on port " + port + ".");
		console.log("Express server listening on port %d in %s mode", port, app.settings.env);
  }
};