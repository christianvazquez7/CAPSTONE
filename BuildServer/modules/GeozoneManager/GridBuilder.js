/**
 * GridBuilder module is in charge of building 
 * grids where each tile is identified by an ID. 
 */

/**
 * Module imports
 */
var Converter = require('./Converter.js');
var Geozone = require('./Geozone.js');
var GridPoint = require('./GridPoint.js');

module.exports = function GridBuilder () {

	var converter = new Converter();
	var result = [];
	var geojsonGrid = [];

	var zoneID;
	var edge

	var nwLat
	var nwLon
	var seLat
	var seLon

	/**
	 * This method build the 4-sided grid polygon with a unique ID.
	 * @param area: Area of the polygon.
	 * @param nwCoordinate: NW coordinate (Highest coordinate to begin the grid).
	 * @param seCoordinate: SE coordinate (Lowest coordinate to end the grid).
	 */
	this.buildGrid = function(nwCoordinate, seCoordinate, area) {

		// NW Coordinate
		nwLat = nwCoordinate.getLatitude();
		nwLon = nwCoordinate.getLongitude();

		// SE Coordinate
		seLat = seCoordinate.getLatitude();
		seLon = seCoordinate.getLongitude();

		edge = converter.translateArea(area);

		console.log("NW Coordinate:", nwLat, nwLon);
		console.log("SE Coordinate:", seLat, seLon);
		console.log("Area: ", area);

		// get tile numbers from corners of boundingbox
    	nwTile = converter.coordinateToTile({longitude:nwLon, latitude:nwLat}, edge);
    	seTile = converter.coordinateToTile({longitude:seLon, latitude:seLat}, edge);

    	console.log("NW Tile: ", nwTile.getX(), nwTile.getY());
    	console.log("SE Tile: ", seTile.getX(), seTile.getY());
    	console.log("Edge Side: ", edge);

    	zoneID = 0;
		// now loop between these tiles to get every other tile contained in the bounding box
		for(var x = nwTile.getX(); x <= seTile.getX(); x++) {
			for(var y = nwTile.getY(); y <= seTile.getY(); y++) {
				createTilePolygon(new GridPoint(x, y), edge, zoneID++, function(found) {
					result.push(new Geozone(found));
				});
			}
		}
		console.log("Number of zones created: ", result.length);
		return result
	}

	/**
	 * This method check if the grid is already created.
	 * @return Return a boolean value if it was ready created or not.
	 */
	this.isGridCreated = function(coordinate, area) {
		if (nwLat == coordinate.getLatitude()) {
			if (nwLon == coordinate.getLongitude()) {
				if (edge == converter.translateArea(area)) {
					return true
				}
			}
		}
		return false;
	}

	/**
	 * This method create the geographic polygon for zonde in a object array.
	 * @param gridPoint: The current posistion of coordinate as a point in plane
	 * @return a geographic polygon in a object array.
	 */
	var createTilePolygon = function(gridPoint, edge, zoneID, callback) {

		nw = converter.tileToCoordinate(gridPoint.getX(), gridPoint.getY(), edge);
		ne = converter.tileToCoordinate(gridPoint.getX() + 1, gridPoint.getY(), edge);
		se = converter.tileToCoordinate(gridPoint.getX() + 1, gridPoint.getY() + 1, edge);
		sw = converter.tileToCoordinate(gridPoint.getX(), gridPoint.getY() + 1, edge)

		callback({ "zone_id": zoneID, "level": 0, "totalCrime": 0, "loc": { "type":"Polygon", "coordinates":[[[nw.getLongitude(), nw.getLatitude()], [ne.getLongitude(), ne.getLatitude()], [se.getLongitude(), se.getLatitude()], [sw.getLongitude(), sw.getLatitude()], [nw.getLongitude(), nw.getLatitude()]]]}});
	}
}