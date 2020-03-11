import { Test, TestingModule } from '@nestjs/testing';

import { ShieldsController } from './shields.controller';
import { ShieldsService } from './shields.service';

class MockShieldsService {
  achievements: any;

  createAchievementsShield(): Promise<string> {
    return Promise.resolve('<svg></svg>');
  }
}

describe('Shields Controller', () => {
  let controller: ShieldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ShieldsService, useClass: MockShieldsService }
      ],
      controllers: [ ShieldsController ]
    }).compile();

    controller = module.get<ShieldsController>(ShieldsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the created svg shield', async () => {
    expect(await controller.getAchievementsShield()).toBe('<svg></svg>');
  });
});
