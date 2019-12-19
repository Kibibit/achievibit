import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { InMemoryDatabaseModule } from '@kb-dev-tools';
import { PULL_REQUEST_MODEL_NAME, PullRequestSchema } from '@kb-models';

import { PullRequestsService } from './pull-requests.service';

describe('PullRequestsService', () => {
  let service: PullRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        InMemoryDatabaseModule,
        MongooseModule.forFeature([ { name: PULL_REQUEST_MODEL_NAME, schema: PullRequestSchema } ])
      ],
      providers: [ PullRequestsService ]
    }).compile();

    service = module.get<PullRequestsService>(PullRequestsService);
  });

  it('should be defined', async (done) => {
    expect(service).toBeDefined();

    done();
  });
});
