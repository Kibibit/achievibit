import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import {
  closeInMemoryDatabaseConnection,
  createInMemoryDatabaseModule,
  DtoMockGenerator
} from '@kb-dev-tools';
import { User } from '@kb-models';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        createInMemoryDatabaseModule(),
        MongooseModule.forFeature([{
          name: User.modelName,
          schema: User.schema
        }])
      ],
      providers: [UserService]
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    await closeInMemoryDatabaseConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to get all users', async () => {
    const user1 = DtoMockGenerator.user();
    const user2 = DtoMockGenerator.user();

    const createdUser1 = await service.create(user1);
    const createdUser2 = await service.create(user2);

    const foundUsers = await service.findAll();
    const foundUsersParsed = foundUsers.map((user) => user.toObject());

    expect(foundUsersParsed).toContainEqual(createdUser1);
    expect(foundUsersParsed).toContainEqual(createdUser2);
    expect(foundUsersParsed.length).toBeGreaterThanOrEqual(2);
  });

  it('should be able to get all users', async () => {
    const user1 = DtoMockGenerator.user();
    const user2 = DtoMockGenerator.user();

    const createdUser1 = await service.create(user1);
    const createdUser2 = await service.create(user2);

    const foundUsers = await service.findAllUsers();

    expect(foundUsers).toContainEqual(createdUser1);
    expect(foundUsers).toContainEqual(createdUser2);
    expect(foundUsers.length).toBeGreaterThanOrEqual(2);
  });

  it('should be able to get a user by username', async () => {
    const user = DtoMockGenerator.user();

    const createdUser = await service.create(user);

    const foundUser = await service.findByUsername(user.username);

    expect(foundUser).toEqual(createdUser);
  });

  it('should return null if user does not exist', async () => {
    const foundUser = await service.findByUsername('username');

    expect(foundUser).toBeUndefined();
  });
});