import {
  applyDecorators,
  ClassSerializerInterceptor,
  Post,
  UseInterceptors
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

import { KbApiValidateErrorResponse } from '@kb-decorators';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function KbPost(type: any, path?: string | string[]) {
  return applyDecorators(
    Post(path),
    ApiOperation({ summary: `Create a new ${ type.name }` }),
    ApiCreatedResponse({
      description: `The ${ type.name } has been successfully created.`,
      type
    }),
    KbApiValidateErrorResponse(),
    UseInterceptors(ClassSerializerInterceptor)
  );
}
