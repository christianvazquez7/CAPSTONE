var winston = require('winston');
winston.emitErrs = true;

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'filelog-info.log',
      level: 'info',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
    }),
    new (winston.transports.File)({
      name: 'debug-file',
      filename: 'filelog-debug.log',
      level: 'debug',
      handleExceptions: true,
      json: true,
      colorize: true
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'filelog-error.log',
      level: 'error',
      handleExceptions: true,
      json: true,
      colorize: true
    }),
    new (winston.transports.Console)({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ]
});

module.exports = logger;

module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};