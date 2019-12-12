import { ReposService } from '@kb-modules/repos/repos.service';
import { UsersService } from '@kb-modules/users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { noop } from 'lodash';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ AppController ],
      providers: [
        AppService,
        { provide: ReposService, useValue: { findAll: noop, findOne: noop, create: noop } },
        { provide: UsersService, useValue: { findAll: noop, findOne: noop, create: noop } }
      ]
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return package info', async () => {
      const packateDetails = await appController.getAchievibitPackageInfo();
      expect(packateDetails).toHaveProperty('name', 'achievibit');
    });
  });
});
