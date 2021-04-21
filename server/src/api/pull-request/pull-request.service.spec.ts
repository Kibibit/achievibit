import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import {
  closeInMemoryDatabaseConnection,
  createInMemoryDatabaseModule
} from '@kb-dev-tools';
import { PullRequest } from '@kb-models';

import { PullRequestService } from './pull-request.service';

describe('PullRequestService', () => {
  let service: PullRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        createInMemoryDatabaseModule(),
        MongooseModule.forFeature([{
          name: PullRequest.modelName,
          schema: PullRequest.schema
        }])
      ],
      providers: [PullRequestService]
    }).compile();

    service = module.get<PullRequestService>(PullRequestService);
  }, 10000);

  afterEach(async () => {
    await closeInMemoryDatabaseConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
