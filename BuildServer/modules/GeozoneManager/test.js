#!/usr/bin/env node
var argv = require('optimist')
    .usage('File to Initialize KYA Builder.\nUsage: $0')
    .demand('f')
    .alias('f', 'file')
    .describe('f', 'Load a file')
    .argv
;

var stripJsonComments = require('strip-json-comments');
 
var fs = require('fs');
var s = fs.createReadStream(argv.file);
var parameter;
 
var lines = '';
s.on('data', function (buf) {
    lines += buf.toString()//.match(/\n/g).length;
});
 
s.on('end', function () {
    parameter = JSON.parse(stripJsonComments(lines));
    print();
});

function print() {
	console.log(parameter.SodaSource);
}