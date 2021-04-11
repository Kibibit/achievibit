import {
  applyDecorators,
  ClassSerializerInterceptor,
  Get,
  UseInterceptors
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GetAll(model: any, path?: string | string[]) {
  return applyDecorators(
    Get(path),
    ApiOperation({ summary: `Get all ${ model.name }` }),
    ApiOkResponse({ description: `Return a list of all ${ model.name }s` }),
    UseInterceptors(ClassSerializerInterceptor)
  );
}
