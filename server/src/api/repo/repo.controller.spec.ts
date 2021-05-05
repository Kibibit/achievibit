import { noop } from 'lodash';

import { Test, TestingModule } from '@nestjs/testing';

import { RepoService } from '@kb-api';
import { DtoMockGenerator } from '@kb-dev-tools';

import { RepoController } from './repo.controller';

describe('RepoController', () => {
  let controller: RepoController;
  let repoService: RepoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ 
      controllers: [RepoController],
      providers: [{
        provide: RepoService,
        useValue: { findAllRepos: noop, findByName: noop }
      }]
    }).compile();

    controller = module.get<RepoController>(RepoController);
    repoService = module.get<RepoService>(RepoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service on get all repos', async () => {
    const findAllResponse = DtoMockGenerator.repos();

    // console.log('mock result: ', findAllResponse);

    const spyFindAll = jest.spyOn(repoService, 'findAllRepos')
      .mockImplementation(() => Promise.resolve(findAllResponse));

    const result = await controller.getAllRepos();

    expect(result).toEqual(findAllResponse);
    expect(spyFindAll).toHaveBeenCalledTimes(1);
  });

  it('should get repo by name', async () => {
    const findByNameResponse = DtoMockGenerator.repo();

    // console.log('mock result: ', findAllResponse);
    const spyFindByUsername = jest.spyOn(repoService, 'findByName')
      .mockImplementation(() => Promise.resolve(findByNameResponse));

    const result = await controller.getRepo(findByNameResponse.name);

    expect(result).toEqual(findByNameResponse);
    expect(spyFindByUsername).toHaveBeenCalledTimes(1);
  });

  it('should throw error if repo not found', async () => {
    const spyFindByName = jest.spyOn(repoService, 'findByName')
      .mockImplementation(() => Promise.resolve(undefined));

    expect(controller.getRepo('mockname'))
      .rejects.toThrowErrorMatchingSnapshot();
    expect(spyFindByName).toHaveBeenCalledTimes(1);
  });
});
