import { Test, TestingModule } from '@nestjs/testing';

import { DtoMockGenerator } from '@kb-dev-tools';

import { PullRequestService } from '../pull-request/pull-request.service';
import { RepoService } from '../repo/repo.service';
import { UserService } from '../user/user.service';
import { WebhookEventManagerService } from './webhook-event-manager.service';

describe('WebhookEventManagerService', () => {
  let service: WebhookEventManagerService;
  const user = DtoMockGenerator.user();
  const repo = DtoMockGenerator.repo();
  const pullRequest = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookEventManagerService,
        {
          provide: UserService,
          useValue: { create: (...anything) => user }
        },
        {
          provide: RepoService,
          useValue: { create: (...anything) => repo }
        },
        {
          provide: PullRequestService,
          useValue: { create: (...anything) => pullRequest }
        }
      ]
    }).compile();

    service = module
      .get<WebhookEventManagerService>(WebhookEventManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
