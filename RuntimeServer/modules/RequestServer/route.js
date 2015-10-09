/**
 * This module is in charge of routing all requests to its respective handler.
 */
module.exports = function route(handle, pathname, parsedUrl, response) {
	console.log("pathname = " + typeof handle[pathname])
  if (typeof handle[pathname] === 'function') {
    handle[pathname](parsedUrl, response);
 	
  } else {
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not found");
    response.end();
  }
};