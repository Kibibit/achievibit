import { BadRequestException, HttpStatus } from '@nestjs/common';
import MockDate from 'mockdate';

import { hostMock, mockResponse } from '@kb-dev-tools';
import { KbValidationExceptionFilter } from '@kb-filters';

describe('KbValidationExceptionFilter', () => {
  it('should be defined', () => {
    expect(new KbValidationExceptionFilter()).toBeDefined();
  });

  it('should return pretty validation errors', async () => {
    MockDate.set('2000-05-04');
    const filter = new KbValidationExceptionFilter();
    const req = {
      path: '/mock-api-path',
      url: 'https://server.com/mock-api-path'
    };

    filter.catch(new BadRequestException(), hostMock(req, mockResponse));

    expect(mockResponse.status)
      .toHaveBeenCalledWith(HttpStatus.METHOD_NOT_ALLOWED);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json.mock.calls[0][0]).toMatchSnapshot();
  });
});
