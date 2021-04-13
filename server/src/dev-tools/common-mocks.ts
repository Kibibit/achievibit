import { ArgumentsHost } from '@nestjs/common';

export const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  sendFile: jest.fn().mockReturnThis(),
  mockClear: () => {
    mockResponse.status.mockClear();
    mockResponse.json.mockClear();
    mockResponse.sendFile.mockClear();
  }
};

export const hostMock = (req, res, roles?: string[]): ArgumentsHost => {
  const ctx: any = {}
  ctx.switchToHttp = jest.fn().mockReturnValue({
      getRequest: () => req,
      getResponse: () => res
  });
  ctx.getHandler = jest.fn().mockReturnValue({ roles }) as Function;

  return ctx;
};
