import pino from "pino";
import path from "path";
import fs from "fs";

const minimum_log_level = "debug";

// Ensure logs directory exists
const logsDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir, { recursive: true });
}

const streams: Array<{ level: string; stream: pino.StreamEntry["stream"] }> = [
	{
		level: "trace", //support logging of all levels to this location
		stream: process.stdout, //logs to standard output
	},
	{
		level: "trace", //support logging of all levels to this location
		stream: pino.destination(path.join(logsDir, "server-log")), //log to this file
	},
];

const logger: pino.Logger =
	process.env.CONSOLE_ONLY == "true"
		? pino({
				level: process.env.PINO_LOG_LEVEL || minimum_log_level, //minimum level to log
			})
		: pino(
				{
					level: process.env.PINO_LOG_LEVEL || minimum_log_level, //minimum level to log
				},
				pino.multistream(streams),
			);

export default logger;

