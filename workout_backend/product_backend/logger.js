const pino = require('pino');
const streams = [
    {
        level: "trace", // support logging of all different levels
        stream: process.stdout, // logs to the standard output
    },
    {
        level: "trace", // support logging of all different levels
        stream: pino.destination("logs/server.log"), // logs to this file
    },
];
const logger = pino(
    {
        level: "info",
    },
    pino.multistream(streams)
);


module.exports = logger;