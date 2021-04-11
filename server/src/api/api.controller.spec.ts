import { Test, TestingModule } from '@nestjs/testing';

import { ApiController } from '@kb-api';

describe('ApiController', () => {
  let controller: ApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController]
    }).compile();

    controller = module.get<ApiController>(ApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it.skip('should return package.json object', () => {
    expect(controller.getAPI()).toBe('API');
  });
});
