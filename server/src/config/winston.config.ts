import { basename, join } from 'path';

import bytes from 'bytes';
import winston, { createLogger } from 'winston';

import {
  nestLike,
  winstonInstance
} from '@kibibit/nestjs-winston';

const fiveMegaBytes = bytes('5MB');

const omitMeta = [
  'file',
  'env'
];

export function initializeWinston(rootFolder: string) {
  winstonInstance.logger = createLogger({
    transports: [
      new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestLike('achievibit', omitMeta),
        )
      }),
      new winston.transports.File({
        level: 'debug',
        filename: join(rootFolder, '/logs/server.log'),
        maxsize: fiveMegaBytes,
        maxFiles: 5,
        tailable: true
      })
    ],
    exceptionHandlers: [
      new winston.transports.File({
        level: 'debug',
        filename: join(rootFolder, '/logs/exceptions.log'),
        maxsize: fiveMegaBytes,
        maxFiles: 5,
        tailable: true
      })
    ],
    handleExceptions: true,
    format: winston.format.combine(
      winston.format((info) => {
        info.env = process.env.NODE_ENV;
        const filename = getCallerFile();

        if (filename) {
          info.file = basename(getCallerFile());
        }
        return info;
      })(),
      winston.format.timestamp(),
      winston.format.splat(),
      winston.format.json()
    )
  });

  function getCallerFile(): string {
    try {
      const err = new Error();
      let callerfile;
      Error.prepareStackTrace = function (_err, stack) { return stack; };
      const currentfile = (err.stack as any).shift().getFileName();

      while (err.stack.length) {
        callerfile = (err.stack as any).shift().getFileName();

        if (currentfile !== callerfile &&
          !callerfile.includes('node_modules') &&
          !callerfile.includes('internal/process')) return callerfile;
      }
    } catch (err) { }
    return '';
  }
}
