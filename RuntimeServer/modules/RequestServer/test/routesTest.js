var ProtoBuf = require("../../../node_modules/protobufjs");
var turf = require('../../../node_modules/turf');

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
  this.timeout(5000);

  describe('GET Dashboard Views ', function() {

    it('should return a 200 response when accesing /', function() {
      api.get('/')
      .expect(200);
    });

    it('should return a 200 response when accesing /aboutus', function() {
      api.get('/aboutus')
      .expect(200);
    });

    it('should return HTML, when accesing /', function() {
      api.get('/')
      .expect(200)
      .end(function(err, res) {
        expect(res.text.indexOf("</html>")).to.be.greaterThan(0);
      });
    });

    it('should return HTML, when accesing /aboutus', function() {
      api.get('/aboutus')
      .expect(200)
      .end(function(err, res) {
        expect(res.text.indexOf("</html>")).to.be.greaterThan(0);
      });
    });

    it('should return a 404 response when accesing wrong endpoint', function() {
      api.get('/other')
      .expect(404);
    });
  });

  describe('POST to /threshold', function() {
    it('should set the threshold to 0.2', function(done) {

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

    it('should failed setting threshold with missing payload', function(done) {

      api.post('/threshold')
      .set('Content-Type', 'application/octet-stream')
      .expect(400)
      .end(function(err, res) {
        done();
      });
    });
  });

  describe('GET from /stats', function() {
    
    before(function(done) {
      // runs before all tests in this block
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

    it('should be a Stats ProtoBuf with curent statistics', function(done) {
      api.get('/stats')
      .expect('Content-Type', 'application/octet-stream')
      .end(function(err, res) {

        var stats = Stats.decode(res.text);
        expect(stats.maxNumOfCrimes).to.equal(10);
        expect(stats.minNumOfCrimes).to.equal(0);
        expect(stats.crimeAverage).to.equal(4.125);
        done();
      });
    });
  });

  describe('GET Grids from /grids', function() {

    before(function(done) {
      // runs before all tests in this block
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

    it('should have a 200 status when accesing /grids/ready with query string', function(done) {
      var swLatPoint = 17.918636,
          swLngPoint = -67.299500,
          neLatPoint = 18.536909,
          neLngPoint = -65.176392,
          areaOfGrid = 20;

      api.get('/grids')
      .query({swLat: swLatPoint, swLng: swLngPoint, neLat: neLatPoint, neLng: neLngPoint, area: areaOfGrid})
        .end(function(err, res) {
          expect(res).to.have.property('status');
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('should have a 400 status when accesing /grids/ready with missing query string', function(done) {
      api.get('/grids')
        .end(function(err, res) {
          expect(res).to.have.property('status');
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('should return a FeautureCollection', function(done) {
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

    it('should contain grids of area ~= 20,000 m2', function(done) {
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
        var length = res.body.features.length
        // expect(res.body.features).to.have.length(48);
        for (var i = 0; i < length; i++) {
          grid = res.body.features[i];
          var area = turf.area(grid);
          var intArea =   parseInt(area/1000000);
          expect(intArea).not.to.be.greaterThan(400);
          expect(intArea).not.to.be.lessThan(399);
        };
      
        done();
      });
    });

    it('should contain grids of area ~= 200 m2', function(done) {
      var swLatPoint = 18.197126385555602,
          swLngPoint = -67.14500427246094,
          neLatPoint = 18.201203242853527,
          neLngPoint = -67.13702201843262,
          areaOfGrid = 0.2;

      api.get('/grids')
      .query({swLat: swLatPoint, swLng: swLngPoint, neLat: neLatPoint, neLng: neLngPoint, area: areaOfGrid})
      .expect(200)
      // end handles the response
      .end(function(err, res) {
        var length = res.body.features.length
        // expect(res.body.features).to.have.length(48);
        for (var i = 0; i < length; i++) {
          grid = res.body.features[i];
          var area = turf.area(grid);
          var intArea =   parseInt(area/1000);
          expect(intArea).not.to.be.greaterThan(40);
          expect(intArea).not.to.be.lessThan(39);
        };
        done();
      });
    });

  });

  describe('Zones', function() {
    
    before(function(done) {
      // runs before all tests in this block
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

    describe('Verify if its ready to fetch zones from /grids/ready', function() {

      it('should have a 200 status when accesing /grids/ready?gridArea=2', function(done) {
        api.get('/grids/ready')
        .query({gridArea: 2})
        .end(function(err, res) {
          expect(res).to.have.property('status');
          expect(res.status).to.equal(200);
          done();
        });
      });

      it('should have a 400 status when accesing /grids/ready without query string', function(done) {
        api.get('/grids/ready')
        .expect(200)
        .end(function(err, res) {
          expect(res).to.have.property('status');
          expect(res.status).to.equal(400);
          done();
        });
      });

      it('should not be ready to fetch zones when area is 2km', function(done) {
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

      it('should be ready to fetch zones when area is 0.2km', function(done) {
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

    describe('GET zones from /zones', function() {
      var points = [];
      points.push(new GeoPoint('', 18.197126385555602, -67.14500427246094)); // sw point
      points.push(new GeoPoint('', 18.201203242853527, -67.14500427246094)); // nw point
      points.push(new GeoPoint('', 18.201203242853527, -67.13702201843262)); // ne point
      points.push(new GeoPoint('', 18.197126385555602, -67.13702201843262)); // se point


      var points2 = [];
      points2.push(new GeoPoint('', 18.203690078969938, -67.14566946029663)); // sw point
      points2.push(new GeoPoint('', 18.20595266131903, -67.14566946029663)); // nw point
      points2.push(new GeoPoint('', 18.20595266131903, -67.14101314544678)); // ne point
      points2.push(new GeoPoint('', 18.203690078969938, -67.14101314544678)); // se point

      // Preparing buffer for HTTP request 
      var gridBounds = new GridBounds(points);
      var buffer = gridBounds.encode();
      var bodyBuffer = buffer.toBuffer();

      // Preparing buffer for HTTP request
      var gridBounds2 = new GridBounds(points2);
      var buffer2 = gridBounds2.encode();
      var bodyBuffer2 = buffer2.toBuffer();

      it('should return a 200 response when accesing /zones', function() {
        api.get('/zones')
        .expect(200);
      });

      it('should return a FeatureCollection', function(done) {
        api.post('/zones')
        .set('Content-Type', 'application/octet-stream')
        .send(bodyBuffer)
        .expect(200)
        .end(function(err, res) {
          expect(res.body.type).to.be.equal('FeatureCollection');
          done();
        });
      });

      it('should fetch eight zones from db', function(done) {
        api.post('/zones')
        .set('Content-Type', 'application/octet-stream')
        .send(bodyBuffer)
        .expect(200)
        .end(function(err, res) {
          expect(res.body.type).to.be.equal('FeatureCollection');
          expect(res.body.features).to.have.length(8);
          done();
        });
      });

      it('should not fetch any zone from db', function(done) {
        api.post('/zones')
        .set('Content-Type', 'application/octet-stream')
        .send(bodyBuffer2)
        .expect(200)
        .end(function(err, res) {
          expect(res.body.type).to.be.equal('FeatureCollection');
          expect(res.body.features).to.have.length(0);
          done();
        });
      });

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