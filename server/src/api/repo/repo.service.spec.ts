import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import {
  closeInMemoryDatabaseConnection,
  createInMemoryDatabaseModule,
  DtoMockGenerator
} from '@kb-dev-tools';
import { Repo } from '@kb-models';

import { RepoService } from './repo.service';

describe('RepoService', () => {
  let service: RepoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        createInMemoryDatabaseModule(),
        MongooseModule.forFeature([{
          name: Repo.modelName,
          schema: Repo.schema
        }])
      ],
      providers: [RepoService]
    }).compile();

    service = module.get<RepoService>(RepoService);
  });

  afterEach(async () => {
    await closeInMemoryDatabaseConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined(); 
  });

  it('should be able to get all repos', async () => {
    const repo1 = DtoMockGenerator.repo();
    const repo2 = DtoMockGenerator.repo();

    const createdRepo1 = await service.create(repo1);
    const createdRepo2 = await service.create(repo2);

    const foundRepos = await service.findAllRepos();

    expect(foundRepos).toContainEqual(createdRepo1);
    expect(foundRepos).toContainEqual(createdRepo2);
    expect(foundRepos.length).toBeGreaterThanOrEqual(2);
  });

  it('should be able to get a repo by name', async () => {
    const repo = DtoMockGenerator.repo();

    const createdRepo = await service.create(repo);

    const foundRepo = await service.findByName(repo.name);

    expect(foundRepo).toEqual(createdRepo);
  }); 

  it('should return null if repo does not exist', async () => {
    const foundRepo = await service.findByName('name');

    expect(foundRepo).toBeUndefined();
  });

  it('should NOT allow creating 2 repos with same fullname', async () => {
    const repo1 = new Repo({
      ...DtoMockGenerator.repo(),
      fullname: 'test-user/test-repo'
    });
    const repo2 = new Repo({
      ...DtoMockGenerator.repo(),
      fullname: 'test-user/test-repo'
    });

    const createdRepo = await service.create(repo1);
    let creationError: string;
    await service.create(repo2)
      .catch((err) => creationError = err.message);

    expect(creationError).toMatch(/E11000 duplicate key error/);
    expect(creationError).toMatch(/test-user\/test-repo/);

    const allRepos = await service.findAllRepos();
    expect(allRepos.length).toBe(1);
    expect(allRepos[0]).toEqual(expect.objectContaining(createdRepo));
    expect(allRepos[0]._id).toBeDefined()
    expect(allRepos[0]._id).toEqual(createdRepo._id);
  });
});
