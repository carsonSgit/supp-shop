const pino = require('pino');

const minimum_log_level = "debug";

const streams = [
         {    
           stream: process.stdout, // logs to the standard output
         },
         {    
           stream: pino.destination("logs/server-log"), // log to this file
        },
       ];
const logger =
  process.env.CONSOLE_ONLY == "true"
    ? pino({
        level: process.env.PINO_LOG_LEVEL || minimum_log_level, // minimum level to log
      })
    : pino(
        {
          level: process.env.PINO_LOG_LEVEL || minimum_log_level, // minimum level to log
        },
        pino.multistream(streams)
      );




module.exports = logger;