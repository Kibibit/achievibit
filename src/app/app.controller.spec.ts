import { Test, TestingModule } from '@nestjs/testing';
import { noop } from 'lodash';

import { ConfigModule } from '@kb-config';
import { GithubEventManagerService, ReposService, UsersService } from '@kb-modules';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ ConfigModule ],
      controllers: [ AppController ],
      providers: [
        AppService,
        { provide: ReposService, useValue: { findAll: noop, findOne: noop, create: noop } },
        { provide: UsersService, useValue: { findAll: noop, findOne: noop, create: noop } },
        { provide: GithubEventManagerService, useValue: { postFromWebhook: (githubHeader: string, body: any) => githubHeader } }
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
