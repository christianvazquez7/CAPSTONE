var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
// var mongoose = require('mongoose');
// var winston = require('winston');
// var config = require('./config-debug');


describe('Routes', function() {
  var url = 'http://localhost:3000';

  // Operations that are needed to setup the tests.
  before(function(done) {
    // In our tests we use the test db
//     mongoose.connect(config.db.mongodb);
    // Constructing Telemetry Proto buffer for testing purposes
    
    
    
   			
    done();
  });
  // Testing corrct routing
  describe('Routing', function() {
    // Test /stats route
    it('should return 200 status code trying to access /stats', function(done) {
      
    request(url)
      .get('/stats')
      // end handles the response
      .expect(200) //Status code
      .end(function(err, res) {
          if (err) {
            throw err;
          }
          done();
        });
    });

    // Test /zones route
    it('should return 200 status code trying to access /zones with all parameters', function(done) {
      
    request(url)
      .get('/zones/25/10/9')
      // end handles the response
      .expect(200) //Status code
      .end(function(err, res) {
          if (err) {
            throw err;
          }
          done();
        });
    });

    // Test /zones/curent route
    it('should return 200 status code trying to access /zones/current with all parameters', function(done) {
      
    request(url)
      .get('/zones/current/70.935467/80.567889')
      // end handles the response
      .expect(200) //Status code
      .end(function(err, res) {
          if (err) {
            throw err;
          }
          done();
        });
    });
    
    // Test /location/checkin with all parameters
    it('should return 200 status code trying to access /location/checkin with all parameters', function(done) {
      
    request(url)
      .get('/location/checkin/70.935467/80.567889/25/3')
      // end handles the response
      .expect(200) //Status code
      .end(function(err, res) {
          if (err) {
            throw err;
          }
          done();
        });
    });

    
     // Test /zones with missing parameters
    it('should return 404 status code trying to access /zones with missing parameters', function(done) {
      
    request(url)
      .get('/zones/25')
      // end handles the response
      .expect(404) //Status code
      .end(function(err, res) {
          if (err) {
            throw err;
          }
          done();
        });
    });
    
     // Test /zones/current with missing parameters
    it('should return 404 status code trying to access /zones/current with missing parameters', function(done) {
      
    request(url)
      .get('/zones/current')
      // end handles the response
      .expect(404) //Status code
      .end(function(err, res) {
          if (err) {
            throw err;
          }
          done();
        });
    });

    // Test /zones route
    it('should return 404 status code trying to access /location/checkin with missing parameters', function(done) {
      
    request(url)
      .get('/location/checkin')
      // end handles the response
      .expect(404) //Status code
      .end(function(err, res) {
          if (err) {
            throw err;
          }
          done();
        });
    });

    // Test / route
    it('should return 404 status code trying to access everything else', function(done) {
      
    request(url)
      .get('/')
      // end handles the response
      .expect(404) //Status code
      .end(function(err, res) {
          if (err) {
            throw err;
          }
          done();
        });
    });

  });
});