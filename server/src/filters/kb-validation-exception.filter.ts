import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus
} from '@nestjs/common';

import { PublicError } from '@kb-models';

@Catch(BadRequestException)
export class KbValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    console.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    response
      .status(HttpStatus.METHOD_NOT_ALLOWED)
      // you can manipulate the response here
      .json(new PublicError({
        statusCode: HttpStatus.METHOD_NOT_ALLOWED,
        timestamp: new Date().toISOString(),
        path: request.url,
        name: 'BadRequestException',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (exception.getResponse() as any).message as string[]
      }));
  }
}
