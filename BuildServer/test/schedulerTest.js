var Scheduler = require('../modules/DataProvider/scheduler.js');
var unit = require('unit.js');
var sleep = require('sleep');
var threshold = 500;

function testNewlyCreatedScheduler() {
	var scheduler = new Scheduler(1,1,3600000);
	unit.value(scheduler.getCount()).isEqualTo(0);
}

function testNewlyCreatedSchedulerWithOneRequest() {
	var scheduler = new Scheduler(1000,1,3600000);
	for(var i = 0; i<10;i++)
		scheduler.addRequest();
	unit.value(scheduler.getCount()).isEqualTo(10);
}

function testNewlyCreatedSchedulerWithOneRequest() {
	var scheduler = new Scheduler(1000,1,3600000);
	for(var i = 0; i<10;i++)
		scheduler.addRequest();
	unit.value(scheduler.getCount()).isEqualTo(10);
}

function testSchedulingExactLimit(done) {
	var scheduler = new Scheduler(10,2000,5);
	var  now = new Date().getTime();
	for(var i = 0; i<10;i++)
		scheduler.addRequest();
	var  then = new Date().getTime();
	unit.value(then - now).isLessThan(9000);
	done();
}

function testSchedulingExactLimitPlusOne(done) {
	this.timeout(10000);
	var scheduler = new Scheduler(10,2000,5);
	var  now = new Date().getTime();
	for(var i = 0; i<11;i++)
		scheduler.addRequest();
	var  then = new Date().getTime();
	unit.value(then - now).isApprox(5000,threshold);
	done();
}

function testSchedulingExactLimitPlusExact(done) {
	this.timeout(10000);
	var scheduler = new Scheduler(10,2000,5);
	var  now = new Date().getTime();
	for(var i = 0; i<20;i++)
		scheduler.addRequest();
	var  then = new Date().getTime();
	unit.value(then - now).isApprox(5000,threshold);
	done();
}

function testSchedulingExactLimitPlusOver(done) {
	this.timeout(12000);
	var scheduler = new Scheduler(10,2000,5);
	var  now = new Date().getTime();
	for(var i = 0; i<21;i++)
		scheduler.addRequest();
	var  then = new Date().getTime();
	unit.value(then - now).isApprox(10000,threshold);
	done();
}

function testSchedulingExactWait(done) {
	this.timeout(12000);
	var scheduler = new Scheduler(10,2000,5);
	var  now = new Date().getTime();
	for(var i = 0; i<10;i++)
		scheduler.addRequest();
	sleep.sleep(2);
	scheduler.addRequest();
	var then = new Date().getTime();
	unit.value(then - now).isApprox(2000,threshold);
	done();
}

function testSchedulingExactWaitExact(done) {
	this.timeout(12000);
	var scheduler = new Scheduler(10,2000,5);
	var  now = new Date().getTime();
	for(var i = 0; i<10;i++)
		scheduler.addRequest();
	sleep.sleep(2);
	for(var i = 0 ; i<10 ; i++)
		scheduler.addRequest();	var then = new Date().getTime();
	unit.value(then - now).isApprox(2000,threshold);
	done();
}

function testSchedulingExactWaitOver(done) {
	this.timeout(12000);
	var scheduler = new Scheduler(10,2000,5);
	var  now = new Date().getTime();
	for(var i = 0; i<10;i++)
		scheduler.addRequest();
	sleep.sleep(2);
	for(var i = 0 ; i<11 ; i++)
		scheduler.addRequest();	
	var then = new Date().getTime();
	unit.value(then - now).isApprox(7000,threshold);
	done();
}

suite('Scheduler', function() {
  test('New Scheduler has no requests.', testNewlyCreatedScheduler);
  test('Adding ten requests to scheduler.', testNewlyCreatedScheduler);
  test('Testing exact number of requests. Should not sleep.', testSchedulingExactLimit);
  test('Testing exact number of requests plus one. Should sleep for 5 seconds.', testSchedulingExactLimitPlusOne);
  test('Testing exact number of requests plus exact. Should sleep for 5 seconds.', testSchedulingExactLimitPlusExact);
  test('Testing exact number of requests plus over twice. Should sleep for 10 seconds.', testSchedulingExactLimitPlusOver);
  test('Testing exact number of requests, wait two seconds, then request. Should not sleep.', testSchedulingExactWait);
  test('Testing exact number of requests, wait two seconds, then request exact. Should sleep 5 seconds.', testSchedulingExactWaitOver);
});