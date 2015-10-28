var unit = require('unit.js');
var MarshallBuilder = require('../modules/DataProvider/marshallBuilder.js');
var Crime = require('../modules/DataProvider/crime.js');
var dummy = new Crime();
var marshallBuilder = new MarshallBuilder();


function buildCrimeUsingConstructor() {
	var crime = new Crime(13.2,-12.5,'robo','2015/10/01','7:00pm',1234,true);
	unit.value(crime.getLatitude()).isEqualTo(13.2);
	unit.value(crime.getLongitude()).isEqualTo(-12.5);
	unit.value(crime.getType()).isEqualTo('robo');
	unit.value(crime.getDate()).isEqualTo('2015/10/01');
	unit.value(crime.getTime()).isEqualTo('7:00pm');
	unit.value(crime.getId()).isEqualTo(1234);
	unit.value(crime.isDomestic()).isEqualTo(true);
}

function buildCrimeFromEmptyList() {
	var list = [];
	var marshall = marshallBuilder.date('fecha').time('hora').lat('point_x').lon('point_y').type('delitos_code').id('delito').build();
	var myList = Crime.fromList(list,marshall);
	myList.should.be.empty;
}

function buildCrimeFromList() {
	var marshall = marshallBuilder.date('fecha').time('hora').lat('point_x').lon('point_y').type('delitos_code').id('delito').build();
	var list = [
		{
			"fecha": '2015/10/01',
			"hora": '7:00pm',
			"point_x": 13.2,
			"point_y": -12.5,
			"delitos_code": 'robo',
			"delito": 1234
		},
		{
			"fecha": '2015/10/02',
			"hora": '7:02pm',
			"point_x": 13.22,
			"point_y": -12.52,
			"delitos_code": 'asesinato',
			"delito": 1235
		}
	];
	var myList = Crime.fromList(list,marshall);
	var crime = myList[0];
	unit.value(crime.getLatitude()).isEqualTo(13.2);
	unit.value(crime.getLongitude()).isEqualTo(-12.5);
	unit.value(crime.getType()).isEqualTo('robo');
	unit.value(crime.getDate()).isEqualTo('2015/10/01');
	unit.value(crime.getTime()).isEqualTo('7:00pm');
	unit.value(crime.getId()).isEqualTo(1234);

	crime = myList[1];
	unit.value(crime.getLatitude()).isEqualTo(13.22);
	unit.value(crime.getLongitude()).isEqualTo(-12.52);
	unit.value(crime.getType()).isEqualTo('asesinato');
	unit.value(crime.getDate()).isEqualTo('2015/10/02');
	unit.value(crime.getTime()).isEqualTo('7:02pm');
	unit.value(crime.getId()).isEqualTo(1235);

}

suite('Crime', function() {
  test('Building a crime using contructor.', buildCrimeUsingConstructor);
  test('Building a crime using fromList static method with empty list.', buildCrimeFromEmptyList);
  test('Building a crime using fromList static method.', buildCrimeFromList);
});