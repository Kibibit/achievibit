import { Test, TestingModule } from '@nestjs/testing';
import fs from 'fs-extra';

import { ApiController } from '@kb-api';

jest.mock('fs-extra');
jest.mock('@kb-app', () => ({
  AppService: jest.fn(function() {
    return {
      appRoot: 'app-root'
    }
  })
}));

describe('ApiController', () => {
  // const MockedAppService = mocked(AppService, true);
  let controller: ApiController;

  beforeEach(async () => {
    // Clears the record of calls to the mock constructor function and its methods
    // MockedAppService.mockClear();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController]
    }).compile();

    controller = module.get<ApiController>(ApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return package.json object', async () => {
    const packageInfo = {
      name: 'nice',
      description: 'nice',
      version: 'nice',
      license: 'nice',
      repository: 'nice',
      author: 'nice',
      bugs: 'nice'
    };
    fs.readJSON = jest.fn().mockResolvedValue(packageInfo);
    jest.spyOn(fs, 'readJSON');
    expect(await controller.getAPI()).toEqual(packageInfo);
    expect(fs.readJSON).toHaveBeenCalledTimes(1);
    expect(fs.readJSON).toHaveBeenCalledWith('app-root/package.json');
  });
});
