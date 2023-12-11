import winston from 'winston'
import LogModel from '../models/apiLog.js';

// Custom transport for Sequelize
class SequelizeTransport extends winston.Transport {
  constructor(options) {
    super(options);
    this.name = 'SequelizeTransport';
  }
  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });
    LogModel.create({
      level: info.level,
      message: info.message,
      meta: info.meta,
      statusCode: info.statusCode,
    })
      .then(() => {
        callback(null, true);
      })
      .catch((error) => {
        console.error('Error saving log entry to Sequelize:', error);
        callback(error);
      });
  }
}

const sequelizeTransport = new SequelizeTransport();
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    sequelizeTransport,
  ],
});
// Export the logger for use in other modules
export default logger;