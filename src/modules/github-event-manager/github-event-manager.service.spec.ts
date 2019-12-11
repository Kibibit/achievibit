import { Test, TestingModule } from '@nestjs/testing';
import { GithubEventManagerService } from './github-event-manager.service';

describe('GithubEventManagerService', () => {
  let service: GithubEventManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GithubEventManagerService],
    }).compile();

    service = module.get<GithubEventManagerService>(GithubEventManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
