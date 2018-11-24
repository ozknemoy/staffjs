
import {transports, createLogger, format} from "winston";
const { combine, timestamp, label, printf } = format;


export const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    /*
    * error: 0,
      warn: 1,
      info: 2,
      verbose: 3,
      debug: 4,
      silly: 5
    */
    //new transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV === 'development') {
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  logger.add(new transports.Console({format: format.colorize()}));
  logger.format = combine(
    timestamp(),
    printf(info => `================> ${info.timestamp} ${info.level}: ${info.message}`)
  )
} else {
  logger.add(new transports.File({ filename: 'error.log', level: 'error' }));
  logger.add(new transports.File({ filename: 'info.log', level: 'info' }));
}
