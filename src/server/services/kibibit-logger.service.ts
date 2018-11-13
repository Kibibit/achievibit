import * as colors from 'colors';
import { Logger } from '@nestjs/common';

export class KibibitLoggerService extends Logger {
  info(message: string) {
    super.log(`${ colors.bgBlue.black(' [INFO] ') } ${ colors.blue(message) }`);
  }
}
