import { Test, TestingModule } from '@nestjs/testing';
import { noop } from 'lodash';

import { dtoMockGenerator } from '../../dto.mock-generator';
import { ReposController } from './repos.controller';
import { ReposService } from './repos.service';

describe('Repos Controller', () => {
  let controller: ReposController;
  let service: ReposService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ ReposController ],
      providers: [ { provide: ReposService, useValue: { findAll: noop, findOne: noop, create: noop } } ]
    }).compile();

    controller = module.get<ReposController>(ReposController);
    service = module.get<ReposService>(ReposService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service on get all repos', async () => {
    const findAllResponse = dtoMockGenerator.repoDtos();

    const spyFindAll = jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve(findAllResponse));

    const result = await controller.getAllRepos();

    expect(result).toEqual(findAllResponse);
    expect(spyFindAll).toHaveBeenCalledTimes(1);
  });
});
