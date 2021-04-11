import { Test, TestingModule } from '@nestjs/testing';
import { mockResponse } from 'jest-mock-req-res';

import { AppController, AppService } from '@kb-app';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService]
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return an HTML page', async () => {
      const mocRes = mockResponse();
      appController.sendWebClient(mocRes);
      expect(mocRes.sendFile.mock.calls.length).toBe(1);
      const param = mocRes.sendFile.mock.calls[0][0] as string;
      expect(param.endsWith('dist/client/index.html')).toBeTruthy();
    });
  });
});
