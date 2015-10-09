/**
 * Creates the server, listen for requests and routes 
 * the request for its respective handler.
**/
module.exports = function Server() {

  // Imports
  var http = require("http");
  var url = require("url");

  var mRoute;
  var mHandle;

  /**
   * Creates and starts the server.
   *
   * @param route : function for routing the requests
   * @param handle: handlers array
   * @param port  : the port to listen
   */
  this.start = function(route, handle, port) {
    mRoute = route;
    mHandle = handle;
    createServer(port);
  }

  /**
   * Routes the requests to its handler.
   *
   * @param request : request received
   * @param response: response to request
   */
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    var parsedUrl = url.parse(request.url, true);

    mRoute(mHandle, pathname, parsedUrl, response);
  }

  /**
   * Creates the server.
   *
   * @param port: the port to listen
   */
  function createServer(port) {
    http.createServer(onRequest).listen(port);
    console.log("Server has started listening on port " + port);
  }

};