import {
  applyDecorators,
  ClassSerializerInterceptor,
  Patch,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation
} from '@nestjs/swagger';

import { KbApiValidateErrorResponse } from '@kb-decorators';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function KbPatch(type: any, path?: string | string[]) {
  return applyDecorators(
    Patch(path),
    ApiOperation({
      summary: `Update an existing ${ type.name }`,
      description: `Expects a partial ${ type.name }`
    }),
    ApiOkResponse({ type: type, description: `${ type.name } updated` }),
    ApiNotFoundResponse({
      description: `${ type.name } not found`
    }),
    ApiBadRequestResponse({ description: 'Invalid identifier supplied' }),
    KbApiValidateErrorResponse(),
    UseInterceptors(ClassSerializerInterceptor)
  );
}
