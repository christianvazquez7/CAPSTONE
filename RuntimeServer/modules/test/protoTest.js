var ProtoBuf = require("../../node_modules/protobufjs");
var turf = require('../../node_modules/turf');

var should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest'),
    api = supertest('http://localhost:3000');

var builder = ProtoBuf.loadProtoFile("../../../proto/KYA.proto"),
    KYA = builder.build("com.nvbyte.kya"),
    Telemetry = KYA.Telemetry;
    GridBounds = KYA.GridBounds,
    GeoPoint = KYA.GeoPoint,
     Threshold = KYA.Threshold;
     Stats = KYA.Stats;
     CheckIn = KYA.CheckIn;

describe('Protocol Buffers', function() {
  this.timeout(5000);

  describe('GridBounds', function() {

    it('should correctly encode and decode a GridBounds Buffer', function() {
      var points = [];
      points.push(new GeoPoint('', 18.197126385555602, -67.14500427246094)); // sw point
      points.push(new GeoPoint('', 18.201203242853527, -67.14500427246094)); // nw point
      points.push(new GeoPoint('', 18.201203242853527, -67.13702201843262)); // ne point
      points.push(new GeoPoint('', 18.201203242853527, -67.13702201843262)); // se point

      // Preparing buffer for HTTP request 
      var gridBoundsBuffer = new GridBounds(points);
      var buffer = gridBoundsBuffer.encode();
      var bodyBuffer = buffer.toBuffer();
      var gridBounds = GridBounds.decode(bodyBuffer);

      expect(gridBounds.boundaries[0].longitude).to.be.equal(-67.14500427246094);
      expect(gridBounds.boundaries[1].longitude).to.be.equal(-67.14500427246094);
      expect(gridBounds.boundaries[2].longitude).to.be.equal(-67.13702201843262);
      expect(gridBounds.boundaries[3].longitude).to.be.equal(-67.13702201843262);
      expect(gridBounds.boundaries[0].latitude).to.be.equal(18.197126385555602);
      expect(gridBounds.boundaries[1].latitude).to.be.equal(18.201203242853527);
      expect(gridBounds.boundaries[2].latitude).to.be.equal(18.201203242853527);
      expect(gridBounds.boundaries[3].latitude).to.be.equal(18.201203242853527);
    });
  });

  describe('Threshold', function() {

    it('should correctly encode and decode a threshold Buffer', function() {
   
      // Preparing buffer for HTTP request 
      var thresholdBuffer = new Threshold(0.2);
      var buffer = thresholdBuffer.encode();
      var bodyBuffer = buffer.toBuffer();
      var threshold = Threshold.decode(bodyBuffer);

      expect(threshold.threshold).to.be.equal(0.2);

    });
  });

  describe('Stats', function() {

    it('should correctly encode and decode a Stats Buffer', function() {
      // Preparing buffer for HTTP request 
      var statsBuffer = new Stats(10, 2, 12);
      var buffer = statsBuffer.encode();
      var bodyBuffer = buffer.toBuffer();
      var stats = Stats.decode(bodyBuffer);

      expect(stats.maxNumOfCrimes).to.be.equal(10);
      expect(stats.minNumOfCrimes).to.be.equal(2);
      expect(stats.crimeAverage).to.be.equal(12);
     
    });
  });
  
});