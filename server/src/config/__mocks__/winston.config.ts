
import winston, { createLogger } from 'winston';

import {
  winstonInstance
} from '@kibibit/nestjs-winston';

export function initializeWinston() {
  winstonInstance.logger = createLogger({
    transports: [
      new winston.transports.Console({
        silent: true,
        level: 'debug'
      })
    ]
  });
}

initializeWinston();
