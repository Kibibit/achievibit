import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { PublicError } from '@kb-models';

export const KbApiValidateErrorResponse = () => {
  return applyDecorators(
    ApiResponse({
      description: 'Some validation error as accured on the given model',
      status: 405,
      type: PublicError
    })
  );
};
