var ProtoBuf = require("../../../node_modules/protobufjs");

var should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest'),
    api = supertest('http://localhost:3000');

  var builder = ProtoBuf.loadProtoFile("../../resources/kya.proto"),
      KYA = builder.build("KYA"),
      Telemetry = KYA.Telemetry;
      GridBounds = KYA.GridBounds,
      GeoPoint = KYA.GeoPoint,
      Threshold = KYA.Threshold;
      Stats = KYA.Stats;
      CheckIn = KYA.CheckIn;

describe('Dashboard', function() {

  it('should return a 200 response', function(done) {
    api.get('/')
    .expect(200, done);
  });

  it('should return a 404 response', function(done) {
    api.get('/other')
    .expect(404, done);
  });

  it('should set the threshold', function(done) {

    //Preparing buffer for HTTP request 
    var threshold = new Threshold(0.2);
    var buffer = threshold.encode();
    var bodyBuffer = buffer.toBuffer();

    api.post('/threshold')
    .set('Content-Type', 'application/octet-stream')
    .send(bodyBuffer)
    .expect(200)
    .end(function(err, res) {
      done();
    });
  });

  it('should fail setting threshold with missing payload', function(done) {

    //Preparing buffer for HTTP request 
    var threshold = new Threshold(0.2);
    var buffer = threshold.encode();
    var bodyBuffer = buffer.toBuffer();

    api.post('/threshold')
    .set('Content-Type', 'application/octet-stream')
    .expect(400)
    .end(function(err, res) {

      done();
    });
  });

  it('should be a Stats ProtoBuf with curent statistics', function(done) {
    api.get('/stats')
    .expect('Content-Type', 'application/octet-stream')
    .end(function(err, res) {
      var stats = Stats.decode(res.text);
      expect(stats.maxNumOfCrimes).to.equal(10);
      expect(stats.minNumOfCrimes).to.equal(0);
      expect(stats.crimeAverage).to.equal(0);
      done();
    });
  });

  it('should be a GeoJson containing the grids', function(done) {
    var swLatPoint = 17.918636,
        swLngPoint = -67.299500,
        neLatPoint = 18.536909,
        neLngPoint = -65.176392,
        areaOfGrid = 20;

    api.get('/grids')
    .query({swLat: swLatPoint, swLng: swLngPoint, neLat: neLatPoint, neLng: neLngPoint, area: areaOfGrid})
    .expect(200)
    // end handles the response
    .end(function(err, res) {
      expect(res.body.type).to.be.equal('FeatureCollection');
      expect(res.body.features).to.have.length(48);
      done();
    });
  });

  it('should not be ready to fetch zones', function(done) {
    api.get('/grids/ready')
    .query({gridArea: 2})
    .expect(200)
    // end handles the response
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.be.text;
      expect(res.text).to.equal('false');
      done();
    });
  });

  it('should be ready to fetch zones', function(done) {
    api.get('/grids/ready/')
    .query({gridArea: 0.2})
    .expect(200)
    // end handles the response
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.be.text;
      expect(res.text).to.equal('true');
      done();
    });
  });

});

describe('Telemetry', function() {

  it('should send a heartbeat protobuffer', function(done) {

    var telRecord = new Telemetry({
      "userID" : 'AFD43245DACE',
      "notificationID" : 20,
      "zoneID" : 3,
      "heartRate" : {
        "before" : 50,
        "after" : 50
      }
    });

    var buffer = telRecord.encode();
    var bodyBuffer = buffer.toBuffer();

    api.post('/telemetry/heartbeat')
    .set('Content-Type', 'application/octet-stream')
    .send(bodyBuffer)
    .expect(200)
    .end(function(err, res) {
      done();
    });

   
  });

  it('should send a survey protobuffer', function(done) {
    var telRecord = new Telemetry({
      "userID" : 'AFD43245DACE',
      "notificationID" : 20,
      "zoneID" : 5,
      "survey" : {
        "actualRisk" : 5,
        "perceivedRisk" : 6
      }
    });

    var buffer = telRecord.encode();
    var bodyBuffer = buffer.toBuffer();

    api.post('/telemetry/survey')
    .set('Content-Type', 'application/octet-stream')
    .send(bodyBuffer)
    .expect(200)
    .end(function(err, res) {
      done();
    });
  });

  it('should send a movement protobuffer', function(done) {
    var movementRecord = new GeoPoint({
      "userID" : 'AFD43245DACE',
      "latitude" : 18.20,
      "longitude" : 66.78
    });

    var buffer = movementRecord.encode();
    var bodyBuffer = buffer.toBuffer();

    api.post('/telemetry/movement')
    .set('Content-Type', 'application/octet-stream')
    .send(bodyBuffer)
    .expect(200)
    .end(function(err, res) {
      done();
    });
  });

});

describe('Location', function() {

  it('should send a checkIn protobuffer', function(done) {
    var LocObj = new GeoPoint('AFD43245DACE', 18.0025, -67.297);
    var checkInRecord = new CheckIn('AFD43245DACE', LocObj, 9);

    var buffer = checkInRecord.encode();
    var bodyBuffer = buffer.toBuffer();

    api.post('/location/checkin')
    .set('Content-Type', 'application/octet-stream')
    .send(bodyBuffer)
    .expect(200)
    .end(function(err, res) {
      done();
    });
  });

});