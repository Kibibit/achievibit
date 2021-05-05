import { HttpStatus, NotFoundException } from '@nestjs/common';

import { hostMock, mockResponse } from '@kb-dev-tools';
import { KbNotFoundExceptionFilter } from '@kb-filters';

describe('NotFoundExceptionFilterFilter', () => {
  beforeEach(() => {
    mockResponse.mockClear();
  });

  it('should be defined', () => {
    expect(new KbNotFoundExceptionFilter('')).toBeDefined();
  });

  it('should return exepction if route starts with /api/', async () => {
    const mockRequest = {
      path: '/api/pizza'
    };
    const host = hostMock(mockRequest, mockResponse);
    const filter = new KbNotFoundExceptionFilter('');
    filter.catch(new NotFoundException('test title', 'test description'), host);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json.mock.calls[0][0]).toMatchSnapshot();
  });

  it('should return HTML file for undefined routes not inside /api/',
  async () => {
    const mockRequest = {
      path: '/pizza'
    };
    const host = hostMock(mockRequest, mockResponse);
    const filter = new KbNotFoundExceptionFilter('app-root');
    filter.catch(new NotFoundException('test title', 'test description'), host);
    expect(mockResponse.sendFile).toHaveBeenCalledTimes(1);
    expect(mockResponse.sendFile.mock.calls[0][0]).toMatchSnapshot();
  });
});
