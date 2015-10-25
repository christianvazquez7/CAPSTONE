var MarshallBuilder = require('../modules/DataProvider/marshallBuilder.js');
var unit = require('unit.js');

function testValuesOfEmptyMarshall() {
	var builder = new MarshallBuilder();
	var marshall = builder.build();

	unit.value(marshall.getLatitudeLabel()).isEqualTo(undefined);
	unit.value(marshall.getLongitudeLabel()).isEqualTo(undefined);
	unit.value(marshall.getTypeLabel()).isEqualTo(undefined);
	unit.value(marshall.getDateLabel()).isEqualTo(undefined);
	unit.value(marshall.getTimeLabel()).isEqualTo(undefined);
	unit.value(marshall.getIdLabel()).isEqualTo(undefined);
	unit.value(marshall.getDomesticLabel()).isEqualTo(undefined);
	unit.value(marshall.getIgnoreList()).isEqualTo(undefined);
}

function testValuesOfPartialMarshall() {
	var builder = new MarshallBuilder();
	builder.lat('latitude').lon('longitude').type('crimeType');
	var marshall = builder.build();
	unit.value(marshall.getLatitudeLabel()).isEqualTo('latitude');
	unit.value(marshall.getLongitudeLabel()).isEqualTo('longitude');
	unit.value(marshall.getTypeLabel()).isEqualTo('crimeType');
	unit.value(marshall.getDateLabel()).isEqualTo(undefined);
	unit.value(marshall.getTimeLabel()).isEqualTo(undefined);
	unit.value(marshall.getIdLabel()).isEqualTo(undefined);
	unit.value(marshall.getDomesticLabel()).isEqualTo(undefined);
	unit.value(marshall.getIgnoreList()).isEqualTo(undefined);
}

function testValuesOfFullMarshall() {
	var builder = new MarshallBuilder();
	var ignoreTypes = ["robbery", "drug", "murder"];
	builder.lat('latitude').lon('longitude').type('crimeType').date('Date').time('Time').id('CrimeId').domestic('isDomestic').ignore(ignoreTypes);
	var marshall = builder.build();
	unit.value(marshall.getLatitudeLabel()).isEqualTo('latitude');
	unit.value(marshall.getLongitudeLabel()).isEqualTo('longitude');
	unit.value(marshall.getTypeLabel()).isEqualTo('crimeType');
	unit.value(marshall.getDateLabel()).isEqualTo('Date');
	unit.value(marshall.getTimeLabel()).isEqualTo('Time');
	unit.value(marshall.getIdLabel()).isEqualTo('CrimeId');
	unit.value(marshall.getDomesticLabel()).isEqualTo('isDomestic');
	unit.value(marshall.getIgnoreList()).isEqualTo(ignoreTypes);
}

function testValuesOfMarshallReusingBuilder() {
	var builder = new MarshallBuilder();
	builder.lat('latitud').build();
	var marshall = builder.lat('lat').build();
	unit.value(marshall.getLatitudeLabel()).isEqualTo('lat');
}

suite('Marshall/Marshall Builder', function() {
  test('Values of empty marshall should be undefined.', testValuesOfEmptyMarshall);
  test('Values of partially instantiated marshall correct. Parameters not defined remain undefined.', testValuesOfPartialMarshall);
  test('Fully instantiated marshall. All values defined with correct values.', testValuesOfFullMarshall);
  test('Reusing marshall is succesful.', testValuesOfMarshallReusingBuilder);
});

