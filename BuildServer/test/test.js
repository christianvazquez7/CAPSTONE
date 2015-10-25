var pg = require('pg');
var conString = "postgres://postgres:Aguaseka7!@localhost/KYAUtility";
var client = new pg.Client(conString);

client.connect(function(err) {
			if(err) {
				return console.error('could not connect to postgres', err);
			}
			console.log('connected');
			client.query('SELECT * FROM utility', function(err, result) {
				if(err) {
					return console.error('error running query', err);
				}
					console.log(result.rows[0]);
					client.end();
			});
		});