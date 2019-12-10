import { Test, TestingModule } from '@nestjs/testing';
import { noop } from 'lodash';

import { ShieldsController } from './shields.controller';
import { ShieldsService } from './shields.service';

describe('Shields Controller', () => {
  let controller: ShieldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ShieldsService, useValue: { createAchievementsShield: noop } }
      ],
      controllers: [ ShieldsController ]
    }).compile();

    controller = module.get<ShieldsController>(ShieldsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
