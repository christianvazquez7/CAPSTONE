var MarshallBuilder = require('../modules/DataProvider/marshallBuilder.js');
var test = require('unit.js');

this.testValuesOfEmptyMarshall = function() {
	var builder = new MarshallBuilder();
	var marshall = builder.build();

	test.value(marshall.getLatitudeLabel()).isEqualTo(undefined);
	test.value(marshall.getLongitudeLabel()).isEqualTo(undefined);
	test.value(marshall.getTypeLabel()).isEqualTo(undefined);
	test.value(marshall.getDateLabel()).isEqualTo(undefined);
	test.value(marshall.getTimeLabel()).isEqualTo(undefined);
	test.value(marshall.getIdLabel()).isEqualTo(undefined);
	test.value(marshall.getDomesticLabel()).isEqualTo(undefined);
	test.value(marshall.getIgnoreList()).isEqualTo(undefined);
};

this.testValuesOfPartialMarshall = function() {
	var builder = new MarshallBuilder();
	builder.lat('latitude').lon('longitude').type('crimeType');
	var marshall = builder.build();
	test.value(marshall.getLatitudeLabel()).isEqualTo('latitude');
	test.value(marshall.getLongitudeLabel()).isEqualTo('longitude');
	test.value(marshall.getTypeLabel()).isEqualTo('crimeType');
	test.value(marshall.getDateLabel()).isEqualTo(undefined);
	test.value(marshall.getTimeLabel()).isEqualTo(undefined);
	test.value(marshall.getIdLabel()).isEqualTo(undefined);
	test.value(marshall.getDomesticLabel()).isEqualTo(undefined);
	test.value(marshall.getIgnoreList()).isEqualTo(undefined);

};

this.testValuesOfFullMarshall = function() {
	var builder = new MarshallBuilder();
	var ignoreTypes = ["robbery", "drug", "murder"];
	builder.lat('latitude').lon('longitude').type('crimeType').date('Date').time('Time').id('CrimeId').domestic('isDomestic').ignore(ignoreTypes);
	var marshall = builder.build();
	test.value(marshall.getLatitudeLabel()).isEqualTo('latitude');
	test.value(marshall.getLongitudeLabel()).isEqualTo('longitude');
	test.value(marshall.getTypeLabel()).isEqualTo('crimeType');
	test.value(marshall.getDateLabel()).isEqualTo('Date');
	test.value(marshall.getTimeLabel()).isEqualTo('Time');
	test.value(marshall.getIdLabel()).isEqualTo('CrimeId');
	test.value(marshall.getDomesticLabel()).isEqualTo('isDomestic');
	test.value(marshall.getIgnoreList()).isEqualTo(ignoreTypes);
};

this.testValuesOfMarshallReusingBuilder = function () {
	var builder = new MarshallBuilder();
	builder.lat('latitud').build();
	var marshall = builder.lat('lat').build();
	test.value(marshall.getLatitudeLabel()).isEqualTo('lat');
};

this.testValuesOfEmptyMarshall();
this.testValuesOfFullMarshall();
this.testValuesOfPartialMarshall();
this.testValuesOfMarshallReusingBuilder();

