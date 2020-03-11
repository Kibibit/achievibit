import { Test, TestingModule } from '@nestjs/testing';
import { noop } from 'lodash';

import { DtoMockGenerator } from '@kb-dev-tools';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('Users Controller', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ UsersController ],
      providers: [ { provide: UsersService, useValue: { findAll: noop, findOne: noop, create: noop } } ]
    }).compile();

    controller = module.get<UsersController>(UsersController);

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service on get all users', async () => {
    const findAllResponse = DtoMockGenerator.userDtos();

    // console.log('mock result: ', findAllResponse);

    const spyFindAll = jest.spyOn(usersService, 'findAll').mockImplementation(() => Promise.resolve(findAllResponse));

    const result = await controller.getAllUsers();

    expect(result).toEqual(findAllResponse);
    expect(spyFindAll).toHaveBeenCalledTimes(1);
  });

  it('should call service on get user', async () => {
    const findOneResponse = DtoMockGenerator.userDto();

    const spyFindOne = jest.spyOn(usersService, 'findOne').mockImplementation(() => Promise.resolve(findOneResponse));

    const result = await controller.getRawUser(findOneResponse.username);

    expect(result).toEqual(findOneResponse);
    expect(spyFindOne).toHaveBeenCalledTimes(1);
  });

  it('should render user HTML page', async () => {
    const findOneResponse = DtoMockGenerator.userDto();

    const spyFindOne = jest.spyOn(usersService, 'findOne').mockImplementation(() => Promise.resolve(findOneResponse));

    const result = await controller.getUser(findOneResponse.username);

    // expect(result).toEqual(findOneResponse);
    expect(spyFindOne).toHaveBeenCalledTimes(1);
  });
});
