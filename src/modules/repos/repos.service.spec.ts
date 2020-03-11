import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { DtoMockGenerator, InMemoryDatabaseModule } from '@kb-dev-tools';
import { REPO_MODEL_NAME, RepoSchema } from '@kb-models';

import { ReposService } from './repos.service';

describe('ReposService', () => {
  let service: ReposService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        InMemoryDatabaseModule,
        MongooseModule.forFeature([ { name: REPO_MODEL_NAME, schema: RepoSchema } ])
      ],
      providers: [ ReposService ]
    }).compile();

    service = module.get<ReposService>(ReposService);
  });

  afterEach(async (done) => {
    await InMemoryDatabaseModule.closeDatabase();

    done();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to create and get a repo', async () => {
    const repo = DtoMockGenerator.repoDto();

    const createdRepo = await service.create(repo);

    const foundRepo = await service.findOne(repo.fullname);

    expect(createdRepo).toEqual(foundRepo);
  });

  it('should be able to get all repos', async () => {
    const repo1 = DtoMockGenerator.repoDto();
    const repo2 = DtoMockGenerator.repoDto();

    const createdRepo1 = await service.create(repo1);
    const createdRepo2 = await service.create(repo2);

    const foundRepos = await service.findAll();

    expect(foundRepos).toContainEqual(createdRepo1);
    expect(foundRepos).toContainEqual(createdRepo2);
    expect(foundRepos.length).toBeGreaterThanOrEqual(2);
  });
});
