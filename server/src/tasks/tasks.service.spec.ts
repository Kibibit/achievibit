import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import MockDate from 'mockdate';

import { PullRequestService } from '@kb-api';
import {
  closeInMemoryDatabaseConnection,
  createInMemoryDatabaseModule,
  DtoMockGenerator
} from '@kb-dev-tools';
import { PullRequest } from '@kb-models';
import { TasksService } from '@kb-tasks';

describe('TasksService', () => {
  let service: TasksService;
  let prService: PullRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        createInMemoryDatabaseModule(),
        MongooseModule.forFeature([{
          name: PullRequest.modelName,
          schema: PullRequest.schema
        }])
      ],
      providers: [
        TasksService,
        PullRequestService
      ]
    }).compile();

    service = module.get<TasksService>(TasksService);
    prService = module.get<PullRequestService>(PullRequestService);
  });

  afterEach(async () => await closeInMemoryDatabaseConnection());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should ignore PR that is younger than 100 days', async () => {
    const stalePr = DtoMockGenerator.pullRequest();
    const aMonthAgo = new Date();
    aMonthAgo.setDate(aMonthAgo.getDate() - 99);
    MockDate.set(aMonthAgo);
    await prService.create(stalePr);
    MockDate.reset();
    const spy = jest.spyOn(prService, 'deleteAsync');
    await service.removeStalePullRequests();
    expect(spy).not.toHaveBeenCalledTimes(1);
  });

  it('should delete PR that is old or equal to 100 days', async () => {
    const stalePr = DtoMockGenerator.pullRequest();
    const aMonthAgo = new Date();
    aMonthAgo.setDate(aMonthAgo.getDate() - 100);
    MockDate.set(aMonthAgo);
    await prService.create(stalePr);
    MockDate.reset();
    const spy = jest.spyOn(prService, 'deleteAsync');
    await service.removeStalePullRequests();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
