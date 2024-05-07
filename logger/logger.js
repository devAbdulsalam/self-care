import Winston from 'winston';

const options = {
	file: {
		level: 'info',
		filename: 'logs.log',
		handleExceptions: true,
		json: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: false,
	},
	console: {
		level: 'debug',
		handleExceptions: true,
		json: true,
		colorize: true,
	},
};

const logger = Winston.createLogger({
	transports: [
		new Winston.transports.File(options.file),
		new Winston.transports.Console(options.console),
	],
	exitOnError: false,
});
if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new Winston.transports.Console({
			format: Winston.format.simple(),
		})
	);
}
export default logger;
