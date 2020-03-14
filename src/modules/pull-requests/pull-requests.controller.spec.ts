import { Test, TestingModule } from '@nestjs/testing';

import { PullRequestDto } from '@kb-models';
import { PullRequestsService } from '@kb-modules';

import { PullRequestsController } from './pull-requests.controller';

describe('PullRequests Controller', () => {
  let controller: PullRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ PullRequestsController ],
      providers: [
        { provide: PullRequestsService, useValue: { create: (...anything) => PullRequestDto } }
      ]
    }).compile();

    controller = module.get<PullRequestsController>(PullRequestsController);
  });

  it('should be defined', async (done) => {
    expect(controller).toBeDefined();

    done();
  });
});
