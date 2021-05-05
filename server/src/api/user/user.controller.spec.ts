import { noop } from 'lodash';

import { Test, TestingModule } from '@nestjs/testing';

import { DtoMockGenerator } from '@kb-dev-tools';

import { UserController } from './user.controller';
import { UserService } from './user.service';

describe.only('UserController', () => { 
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{
        provide: UserService,
        useValue: { findByUsername: noop, findAllUsers: noop }
      }]
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service on get all users', async () => {
    const findAllResponse = DtoMockGenerator.users();

    // console.log('mock result: ', findAllResponse);

    const spyFindAll = jest.spyOn(userService, 'findAllUsers')
      .mockImplementation(() => Promise.resolve(findAllResponse));

    const result = await controller.getAllUsers();

    expect(result).toEqual(findAllResponse);
    expect(spyFindAll).toHaveBeenCalledTimes(1);
  });

  it('should get user by username', async () => {
    const findByUsernameResponse = DtoMockGenerator.user();

    // console.log('mock result: ', findAllResponse);
    const spyFindByUsername = jest.spyOn(userService, 'findByUsername')
      .mockImplementation(() => Promise.resolve(findByUsernameResponse));

    const result = await controller.getUser(findByUsernameResponse.username);

    expect(result).toEqual(findByUsernameResponse);
    expect(spyFindByUsername).toHaveBeenCalledTimes(1);
  });

  it('should throw error if user not found', async () => {
    const spyFindByUsername = jest.spyOn(userService, 'findByUsername')
      .mockImplementation(() => Promise.resolve(undefined));

    expect(controller.getUser('mockusername'))
      .rejects.toThrowErrorMatchingSnapshot();
    expect(spyFindByUsername).toHaveBeenCalledTimes(1);
  });
});
