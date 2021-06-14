const config = require('config');
const Logger = require('./common/logger.js');

logger = new Logger('o.test',config.get('config.log'));
logger.info('testing log');