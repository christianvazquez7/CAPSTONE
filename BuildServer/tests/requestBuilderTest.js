var RequestBuilder = require('../modules/DataProvider/requestBuilder.js');

var builder = new RequestBuilder();

builder.source('my source').start('1').end('2');

console.log(builder.build());